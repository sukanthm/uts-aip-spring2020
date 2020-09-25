const fs = require('fs');
const { Op } = require("sequelize");
import fpUser from '../persistence/objects/fpUser';
import fpFavor from '../persistence/objects/fpFavor';
const helperModule = require('./helper.js');
var multer  = require('multer');

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

module.exports = function(app){

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
        let [successFlag, [email, loginToken]] = helperModule.get_req_headers(req, ['email', 'loginToken'], res);
        if (!successFlag)
            return;

        let [validationSuccess, user] = await helperModule.validate_user_loginToken(email, loginToken, res);
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
        helperModule.manipulate_response_and_send(res, true, 'sent all requested favors', 200);
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
            test image upload
        */
        let [successFlag, [email, loginToken, payeeEmail, payerEmail, rewardID]] = 
            helperModule.get_req_headers(req, ['email', 'loginToken', 'payeeEmail', 'payerEmail', 'rewardID'], res);
        if (!successFlag)
            return;
        
        let [validationSuccess, user] = await helperModule.validate_user_loginToken(email, loginToken, res);
        if (!validationSuccess)
            return;

        if (![payeeEmail, payerEmail].includes(email)){
            helperModule.manipulate_response_and_send(res, false, 'unAuthorised user, favor creator is neither payee nor payer', 403);
            return;
        }
        if (payerEmail === payeeEmail){
            helperModule.manipulate_response_and_send(res, false, 'payer == payee, illegal', 418);
            return;
        }

        const payeeUser = await fpUser.findOne({
            where: {email: payeeEmail},
        })
        const payerUser = await fpUser.findOne({
            where: {email: payerEmail},
        })
        if (payeeUser === null || payerUser === null){
            helperModule.manipulate_response_and_send(res, false, 'payee email or payer email not found in DB', 409);
            return;
        }

        const newFavor = fpFavor.build({
            rewardID: rewardID,
            payeeID: await payeeUser.id,
            payerID: await payerUser.id,
        });

        if (email === payeeEmail){
            if ([undefined, null, '', 'null'].includes(req.file)){
                helperModule.manipulate_response_and_send(res, false, 'favor creator is payee, image proof missing', 400);
                return;
            }
            if (!req.file.mimetype.startsWith('image')){
                helperModule.manipulate_response_and_send(res, false, 'Not an image. please upload only an image file', 400);
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
            helperModule.manipulate_response_and_send(res, true, 'new favor (id: '+newFavor.id+') created', 200);
            return;
        } catch (err){
            fs.unlink(req.file.path, (err) => {
                if (err) throw err;
                console.log('successfully deleted image associated with failed db save @ '+req.file.path);
            });
            await newFavor.destroy();
            helperModule.manipulate_response_and_send(res, false, err, 500);
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
        let [successFlag, [email, loginToken, favorID]] = helperModule.get_req_headers(req, ['email', 'loginToken', 'favorID'], res);
        if (!successFlag)
            return;

        let [validationSuccess, user] = await helperModule.validate_user_loginToken(email, loginToken, res);
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
            helperModule.manipulate_response_and_send(res, false, 'bad favor id requested', 404);
            return;    
        }
        if (![favor.toJSON().payee_id.payeeEmail, favor.toJSON().payer_id.payerEmail].includes(email)){
            helperModule.manipulate_response_and_send(res, false, 'unAuthorised user', 403);
            return;    
        }

        res.set('output', JSON.stringify(favor));
        helperModule.manipulate_response_and_send(res, true, 'sent requested favor', 200);
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
        TODO:
            test image upload
        */
        let [successFlag, [email, loginToken, favorID]] = 
            helperModule.get_req_headers(req, ['email', 'loginToken', 'favorID'], res);
        if (!successFlag)
            return;

        let [validationSuccess, user] = await helperModule.validate_user_loginToken(email, loginToken, res);
        if (!validationSuccess)
            return;
        
        let favor = await fpFavor.findOne({
            where: {
                id: favorID,
            } 
        });

        if (favor === null){
            helperModule.manipulate_response_and_send(res, false, 'bad favor id requested', 404);
            return;    
        }
        let payerID = await favor.payerID, payeeID = await favor.payeeID, userID = await user.id;
        if (![payerID, payeeID].includes(userID)){
            helperModule.manipulate_response_and_send(res, false, 'unAuthorised user, favor updator is neither payee nor payer', 403);
            return;
        }
        if (await favor.status === 'Paid'){
            helperModule.manipulate_response_and_send(res, false, 'favor already Paid. ignoring current request', 409);
            return;
        }

        if (userID === payerID){
            if ([undefined, null, '', 'null'].includes(req.file)){
                helperModule.manipulate_response_and_send(res, false, 'favor updator is payer, image proof missing', 400);
                return;
            }
            if (!req.file.mimetype.startsWith('image')){
                helperModule.manipulate_response_and_send(res, false, 'Not an image. please upload only an image file', 400);
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
            helperModule.manipulate_response_and_send(res, true, 'favorID: '+favorID+' set to Paid', 200);
            return;
        } catch (err){
            helperModule.manipulate_response_and_send(res, false, err, 500);
            return;
        }
    })
  
}