const fs = require('fs');
const { Op } = require("sequelize");
import {sequelize, Sequelize} from '../persistence/initORM.js';
import fpUser from '../persistence/objects/fpUser';
import fpFavor from '../persistence/objects/fpFavor';
var partyModule = require('./party.js');
const bcrypt = require('bcrypt');
var multer  = require('multer');
const saltRounds = 10;

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '../public_images/')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  })
var upload = multer({ storage: storage })

function manipulate_response_and_send(res, successFlag, message, httpCode, redirectUrl=false){
    console.log(message);
    res.set('success', successFlag);
    res.set('message', message);
    res.status(httpCode);
    if (redirectUrl != false)
        res.redirect(redirectUrl);
    else
        res.send();
    return;
}

async function validate_user_loginToken(email, loginToken, res){
    const user = await fpUser.findOne({
        where: {email: email},
    });
    if (user === null){
        manipulate_response_and_send(res, false, 'unRegistered user', 404);
        return [false, undefined];
    }
    if (! await is_secret_valid(await user.id, loginToken)){
        manipulate_response_and_send(res, false, 'unAuthenticated user', 401);
        return [false, undefined];
    }
    return [true, user];
}

async function custom_hash(input){
    return new Promise((resolve, reject) => {
        bcrypt.hash(input, saltRounds, function(err, hash) {
          if (err) reject(err);
          resolve(hash);
        });
    });
}

async function is_secret_valid(plaintext, hashed){
    return new Promise((resolve, reject) => {
        bcrypt.compare(plaintext, hashed, function(err, result) {
        if (err) reject(err);
        resolve(result);
        });
    });
}

function get_req_headers(req, headers, res){
    let header, output = [];
    for (let i = 0, len = headers.length; i < len; i++) {
        header = req.header(headers[i]);
        if ([undefined, null, '', 'null'].includes(header)){
            manipulate_response_and_send(res, false, 'mandatory request headers missing', 400);
            return [false, headers];
        }
        output.push(header);
    }
    return [true, output];
}

module.exports = function(app){

    app.get('/signup', function(req, res){
        //show signup HTML here
        res.send('HI, use the post API to login');
    });

    app.post('/signup', async function(req, res){
        /*
        request headers:
            email (string): regex checked in react
            password (string): plaintext
            name (string)
        response headers:
            success (bool)
            message (string)
        */
        let [successFlag, [email, password, name]] = get_req_headers(req, ['email', 'password', 'name'], res);
        if (!successFlag)
            return;

        const [newUser, created] = await fpUser.findOrCreate({
            where: {email: email},
        });

        if (created){
            newUser.password = await custom_hash(password);
            newUser.name = name;
            await newUser.save();

            manipulate_response_and_send(res, true, 'user '+email+' created', 200);
            return;
        }

        manipulate_response_and_send(res, false, email+' already exists', 409);
        return;
    });

    app.get('/login', async function(req, res){
        /*
        request headers:
            email (string): regex checked in react
            password (string): plaintext
        response headers:
            success (bool)
            message (string)
            cookie {aip_fp}: sets login token
        */
        let [successFlag, [email, password]] = get_req_headers(req, ['email', 'password'], res);
        if (!successFlag)
            return;

        const user = await fpUser.findOne({
           where: {email: email},
        });

        if (user === null) {
            manipulate_response_and_send(res, false, email+' not registered', 406);
            return;
        }

        const isPasswordValid = await is_secret_valid(password, user.password);
        if (!isPasswordValid) {
            manipulate_response_and_send(res, false, 'incorrect email password combo', 401);
            return;
        }

        const loginToken = await custom_hash(user.id.toString());
        res.cookie('aip_fp', JSON.stringify({
            loginToken: loginToken,
            email: email }), 
          {maxAge: 3600});
        manipulate_response_and_send(res, true, 'login token generated and cookie set for '+email, 200);
        return;
    });

    app.get('/favors', async function(req, res){
        /*
        Gets all of a user's favors (owed and owing)

        request headers:
            loginToken (string)
            email (string)
        response headers:
            success (bool)
            message (string)
            output (string): json to string
        */
        let [successFlag, [email, loginToken]] = get_req_headers(req, ['email', 'loginToken'], res);
        if (!successFlag)
            return;

        let [validationSuccess, user] = await validate_user_loginToken(email, loginToken, res);
        if (!validationSuccess)
            return;

        let favors = await fpFavor.findAll({
            attributes: ['id', 'status', 'rewardID', 'createdAt'],
            where: {
                [Op.or]:[
                    {payerID: user.id},
                    {payeeID: user.id},
                ],
            }, 
            include: [
                {
                    model: fpUser,
                    as: 'payee_id',
                    attributes: [['email', 'payeeEmail']],
                },{
                    model: fpUser,
                    as: 'payer_id',
                    attributes: [['email', 'payerEmail']],
                },
            ]
        });

        res.set('output', JSON.stringify(favors));
        manipulate_response_and_send(res, true, 'sent all requested favors', 200);
        return;
    });

    app.post('/favor', upload.single('proofImage'), async function(req, res){
        /*
        Adds a favor

        request headers:
            loginToken (string)
            email (string)
            payeeEmail (string)
            payerEmail (string)
            rewardID (int)
            proofImage (form-data): optional. required iff email == payee. check https://github.com/expressjs/multer for frontend form
        response headers:
            success (bool)
            message (string)
            newFavorID (int)
        TODO:
            Test image upload
        */
        let [successFlag, [email, loginToken, payeeEmail, payerEmail, rewardID]] = 
            get_req_headers(req, ['email', 'loginToken', 'payeeEmail', 'payerEmail', 'rewardID'], res);
        if (!successFlag)
            return;
        
        let [validationSuccess, user] = await validate_user_loginToken(email, loginToken, res);
        if (!validationSuccess)
            return;

        if (![payeeEmail, payerEmail].includes(email)){
            manipulate_response_and_send(res, false, 'unAuthorised user, favor creator is neither payee nor payer', 403);
            return;
        }
        if (payerEmail === payeeEmail){
            manipulate_response_and_send(res, false, 'payer == payee, illegal', 418);
            return;
        }

        const payeeUser = await fpUser.findOne({
            where: {email: payeeEmail},
        })
        const payerUser = await fpUser.findOne({
            where: {email: payerEmail},
        })
        if (payeeUser === null || payerUser === null){
            manipulate_response_and_send(res, false, 'payee email or payer email not found in DB', 409);
            return;
        }

        const newFavor = fpFavor.build({
            rewardID: rewardID,
            payeeID: await payeeUser.id,
            payerID: await payerUser.id,
        });

        if (email === payeeEmail){
            if ([undefined, null, '', 'null'].includes(req.file)){
                manipulate_response_and_send(res, false, 'favor creator is payee, image proof missing', 400);
                return;
            }
            if (!req.file.mimetype.startsWith('image')){
                manipulate_response_and_send(res, false, 'Not an image. please upload only an image file', 400);
                fs.unlink(req.file.path, (err) => {
                    if (err) throw err;
                    console.log('successfully deleted bad upload @ '+req.file.path);
                });
                return;
            }
            newFavor.proofPath = req.file.path;
        }

        try{
            await newFavor.save();
            res.set('newFavorID', newFavor.id);
            manipulate_response_and_send(res, true, 'new favor (id: '+await newFavor.id+') created', 200);
            return;
        } catch (err){
            manipulate_response_and_send(res, false, err, 500);
            return;
        }
    });

    app.get('/favor', async function(req, res){
        /*
        Gets a user's favor

        request headers:
            loginToken (string)
            email (string)
            favorID (int)
        response headers:
            success (bool)
            message (string)
            output (string): json to string
        */
        let [successFlag, [email, loginToken, favorID]] = get_req_headers(req, ['email', 'loginToken', 'favorID'], res);
        if (!successFlag)
            return;

        let [validationSuccess, user] = await validate_user_loginToken(email, loginToken, res);
        if (!validationSuccess)
            return;
        
        let favor = await fpFavor.findOne({
            attributes: ['id', 'status', 'rewardID', 'createdAt'],
            where: {
                id: favorID,
            }, 
            include: [
                {
                    model: fpUser,
                    as: 'payee_id',
                    attributes: [['email', 'payeeEmail']],
                },{
                    model: fpUser,
                    as: 'payer_id',
                    attributes: [['email', 'payerEmail']],
                },
            ]
        });

        if (favor === null){
            manipulate_response_and_send(res, false, 'bad favor id requested', 404);
            return;    
        }
        if (![favor.toJSON().payee_id.payeeEmail, favor.toJSON().payer_id.payerEmail].includes(email)){
            manipulate_response_and_send(res, false, 'unAuthorised user', 403);
            return;    
        }

        res.set('output', JSON.stringify(favor));
        manipulate_response_and_send(res, true, 'sent requested favor', 200);
        return;
    })

    app.put('/favor', upload.single('proofImage'), async function(req, res){
        /*
        Closes a user's favor (set to Paid)

        request headers:
            loginToken (string)
            email (string)
            favorID (int)
            proofImage (form-data): optional. required iff email == payer. check https://github.com/expressjs/multer for frontend form
        response headers:
            success (bool)
            message (string)
        */
        let [successFlag, [email, loginToken, favorID]] = 
            get_req_headers(req, ['email', 'loginToken', 'favorID'], res);
        if (!successFlag)
            return;

        let [validationSuccess, user] = await validate_user_loginToken(email, loginToken, res);
        if (!validationSuccess)
            return;
        
        let favor = await fpFavor.findOne({
            where: {
                id: favorID,
            } 
        });

        if (favor === null){
            manipulate_response_and_send(res, false, 'bad favor id requested', 404);
            return;    
        }
        let payerID = await favor.payerID, payeeID = await favor.payeeID, userID = await user.id;
        if (![payerID, payeeID].includes(userID)){
            manipulate_response_and_send(res, false, 'unAuthorised user, favor updator is neither payee nor payer', 403);
            return;
        }
        if (await favor.status === 'Paid'){
            manipulate_response_and_send(res, false, 'favor already Paid. ignoring current request', 409);
            return;
        }

        if (userID === payerID){
            if ([undefined, null, '', 'null'].includes(req.file)){
                manipulate_response_and_send(res, false, 'favor updator is payer, image proof missing', 400);
                return;
            }
            if (!req.file.mimetype.startsWith('image')){
                manipulate_response_and_send(res, false, 'Not an image. please upload only an image file', 400);
                fs.unlink(req.file.path, (err) => {
                    if (err) throw err;
                    console.log('successfully deleted bad upload @ '+req.file.path);
                });
                return;
            }
            if (!await favor.proofPath === ''){
                fs.unlink(req.file.path, (err) => {
                    if (err) throw err;
                    console.log('successfully deleted old image @ '+req.file.path);
                });
            }
            favor.proofPath = req.file.path;
        }

        favor.status = 'Paid';
        try{
            await favor.save();
            manipulate_response_and_send(res, true, 'favorID: '+favorID+' set to Paid', 200);
            return;
        } catch (err){
            manipulate_response_and_send(res, false, err, 500);
            return;
        }
    })

    app.get('/party', async function(req, res){
        /*
        Detects a user's potential parties

        request headers:
            loginToken (string)
            email (string)
        response headers:
            success (bool)
            message (string)
            output (string): json to string
        */
       let [successFlag, [email, loginToken]] = get_req_headers(req, ['email', 'loginToken'], res);
       if (!successFlag)
           return;

       let [validationSuccess, user] = await validate_user_loginToken(email, loginToken, res);
       if (!validationSuccess)
           return;

        let output = await partyModule.party_detector(user);
        res.set('output', JSON.stringify(output));
        manipulate_response_and_send(res, true, 'party data sent', 200);
        return;
    })


}

