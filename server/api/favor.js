const { Op } = require("sequelize");
import fpUser from '../persistence/objects/fpUser';
import fpFavor from '../persistence/objects/fpFavor';
const helperModule = require('./helper.js');
var multer  = require('multer');

var multerStorage = helperModule.multerStorage;
var upload = multer({ storage: multerStorage });

module.exports = function(app){

    app.get('/api/favors', async function(req, res){
        /*
        Gets all of a user's favors with another user (owed and owing)

        request cookie:
            aip_fp
        request headers:
            targetEmail (string)
            currentPage (int): optional. pagination page, default = 0
            itemsPerPage (int): optional. pagination items per page, default = 5
        response headers:
            success (bool)
            message (string)
        response body:
            success (bool)
            message (string)
            output (array of json)
        */
        let [successFlag, [targetEmail]] = helperModule.get_req_headers(req, ['targetEmail'], res);
        if (!successFlag)
            return;

        let [validationSuccess, user] = await helperModule.validate_user_loginToken(req, res);
        if (!validationSuccess)
            return;
        
        let [successFlag2, [currentPage, itemsPerPage]] = helperModule.get_req_headers(req, ['page', 'itemsPerPage'], res, true);
        currentPage = currentPage ? Number(currentPage) : 0;
        itemsPerPage = itemsPerPage ? Number(itemsPerPage) : 5;

        const targetUser = await fpUser.findOne({
            where: {email: targetEmail},
        })
        if (targetUser === null){
            helperModule.manipulate_response_and_send(req, res, {
                'success': false, 
                'message': 'target email not found in DB', 
                }, 409);
            return;
        }

        let favors = await fpFavor.findAndCountAll({
            attributes: ['id', 'status', 'rewardID', 'createdAt', 'paidAt', 'creationProofPath', 'completionProofPath', 'comment'],
            limit: itemsPerPage,
            offset: currentPage * itemsPerPage,
            where: {
                [Op.and]: [
                    {[Op.or]: [
                        {payerID: user.id},
                        {payerID: targetUser.id},
                    ]},
                    {[Op.or]: [
                        {payeeID: targetUser.id},
                        {payeeID: user.id},
                    ]},
                ],
            }, 
            order: [
                ['createdAt', 'DESC'],
            ],
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

        favors = JSON.parse(JSON.stringify(favors));
        favors['totalItems'] = favors['count'];
        delete favors['count'];
        favors['totalPages'] = Math.ceil(favors['totalItems']/itemsPerPage);
        favors['itemsPerPage'] = itemsPerPage;
        favors['currentPage'] = currentPage;

        for (let i=0; i<favors.rows.length; i++){
            favors.rows[i]['payeeEmail'] = favors.rows[i]['payee_id']['payeeEmail'];
            delete favors.rows[i]['payee_id'];
            favors.rows[i]['payerEmail'] = favors.rows[i]['payer_id']['payerEmail'];
            delete favors.rows[i]['payer_id'];
        }

        helperModule.manipulate_response_and_send(req, res, {
            'success': true, 
            'message': 'sent all requested favors', 
            'output': favors,
            }, 200);
        return;
    });

    app.post('/api/favor', upload.single('proofImage'), async function(req, res){
        /*
        Adds a favor

        request cookie:
            aip_fp
        request headers:
            payeeEmail (string)
            payerEmail (string)
            rewardID (int)
        proofImage (form-data): optional. required iff email == payee. check https://github.com/expressjs/multer for frontend form
        response headers:
            success (bool)
            message (string)
        response body:
            success (bool)
            message (string)
            newFavorID (int)
        */
        let [successFlag, [payeeEmail, payerEmail, rewardID]] = 
            helperModule.get_req_headers(req, ['payeeEmail', 'payerEmail', 'rewardID'], res);
        if (!successFlag)
            return;
        
        let [validationSuccess, user] = await helperModule.validate_user_loginToken(req, res);
        if (!validationSuccess)
            return;

        if (![payeeEmail, payerEmail].includes(user.email)){
            helperModule.manipulate_response_and_send(req, res, {
                'success': false, 
                'message': 'unAuthorised user, favor creator is neither payee nor payer', 
                }, 403);
            return;
        }
        if (payerEmail === payeeEmail){
            helperModule.manipulate_response_and_send(req, res, {
                'success': false, 
                'message': 'payer == payee, illegal', 
                }, 418);
            return;
        }

        const payeeUser = await fpUser.findOne({
            where: {email: payeeEmail},
        })
        const payerUser = await fpUser.findOne({
            where: {email: payerEmail},
        })
        if (payeeUser === null || payerUser === null){
            helperModule.manipulate_response_and_send(req, res, {
                'success': false, 
                'message': 'payee email or payer email not found in DB', 
                }, 409);
            return;
        }

        const newFavor = fpFavor.build({
            rewardID: rewardID,
            payeeID: payeeUser.id,
            payerID: payerUser.id,
            comment: 'manually created by: '+user.email,
        });

        if (user.email === payeeEmail){
            if (req.file === undefined){
                helperModule.manipulate_response_and_send(req, res, {
                    'success': false, 
                    'message': 'favor creator is payee, image proof missing', 
                    }, 400);
                return;
            }
            if (!req.file.mimetype.startsWith('image')){
                helperModule.manipulate_response_and_send(req, res, {
                    'success': false, 
                    'message': 'Not an image. please upload only an image file', 
                    }, 400);
                return;
            }
            newFavor.creationProofPath = req.file.filename;
        }

        try{
            await newFavor.save();
            res.set('newFavorID', newFavor.id);
            helperModule.manipulate_response_and_send(req, res, {
                'success': true, 
                'message': 'new favor (id: '+newFavor.id+') created',
                'newFavorID': newFavor.id,
                }, 200);
            return;
        } catch (err){
            await newFavor.destroy();
            helperModule.manipulate_response_and_send(req, res, {
                'success': false, 
                'message': err,
                }, 500);
            return;
        }
    });

    app.get('/api/favor', async function(req, res){
        /*
        Gets a user's favor

        request cookie:
            aip_fp
        request headers:
            favorID (int)
        response headers:
            success (bool)
            message (string)
        response body:
            success (bool)
            message (string)
            output (json)
        */
        let [successFlag, [favorID]] = helperModule.get_req_headers(req, ['favorID'], res);
        if (!successFlag)
            return;

        let [validationSuccess, user] = await helperModule.validate_user_loginToken(req, res);
        if (!validationSuccess)
            return;
        
        favorID = Number(favorID);
        let favor = await fpFavor.findOne({
            attributes: ['id', 'status', 'rewardID', 'createdAt', 'paidAt', 'creationProofPath', 'completionProofPath', 'comment'],
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
            helperModule.manipulate_response_and_send(req, res, {
                'success': false, 
                'message': 'bad favor id requested', 
                }, 404);
            return;    
        }
        if (![favor.toJSON().payee_id.payeeEmail, favor.toJSON().payer_id.payerEmail].includes(user.email)){
            helperModule.manipulate_response_and_send(req, res, {
                'success': false, 
                'message': 'unAuthorised user', 
                }, 403);
            return;    
        }

        favor = JSON.parse(JSON.stringify(favor));
        favor['payeeEmail'] = favor['payee_id']['payeeEmail'];
        delete favor['payee_id'];
        favor['payerEmail'] = favor['payer_id']['payerEmail'];
        delete favor['payer_id'];

        helperModule.manipulate_response_and_send(req, res, {
            'success': true, 
            'message': 'sent requested favor',
            'output': favor,
            }, 200);
        return;
    })

    app.put('/api/favor', upload.single('proofImage'), async function(req, res){
        /*
        Closes a user's favor (set to Paid)

        request cookie:
            aip_fp
        request headers:
            favorID (int)
        proofImage (form-data): optional. required iff email == payer. check https://github.com/expressjs/multer for frontend form
        response headers:
            success (bool)
            message (string)
        response body:
            success (bool)
            message (string)
            closedFavorID (int)
        */
        let [successFlag, [favorID]] = helperModule.get_req_headers(req, ['favorID'], res);
        if (!successFlag)
            return;

        let [validationSuccess, user] = await helperModule.validate_user_loginToken(req, res);
        if (!validationSuccess)
            return;
        
        favorID = Number(favorID);
        let favor = await fpFavor.findOne({
            where: {
                id: favorID,
            } 
        });

        if (favor === null){
            helperModule.manipulate_response_and_send(req, res, {
                'success': false, 
                'message': 'bad favor id requested', 
                }, 404);
            return;    
        }
        let payerID = await favor.payerID, payeeID = await favor.payeeID, userID = await user.id;
        if (![payerID, payeeID].includes(userID)){
            helperModule.manipulate_response_and_send(req, res, {
                'success': false, 
                'message': 'unAuthorised user, favor updator is neither payee nor payer', 
                }, 403);
            return;
        }
        if (favor.status === 'Paid'){
            helperModule.manipulate_response_and_send(req, res, {
                'success': false, 
                'message': 'favor already Paid. ignoring current request', 
                }, 409);
            return;
        }

        if (userID === payerID){
            if (req.file === undefined){
                helperModule.manipulate_response_and_send(req, res, {
                    'success': false, 
                    'message': 'favor updator is payer, image proof missing', 
                    }, 400);
                return;
            }
            if (!req.file.mimetype.startsWith('image')){
                helperModule.manipulate_response_and_send(req, res, {
                    'success': false, 
                    'message': 'Not an image. please upload only an image file', 
                    }, 400);
                return;
            }
            favor.completionProofPath = req.file.filename;
        }

        favor.paidAt = Date.now();
        favor.status = 'Paid';
        try{
            await favor.save();
            helperModule.manipulate_response_and_send(req, res, {
                'success': true, 
                'message': 'favorID: '+favorID+' set to Paid', 
                'closedFavorID': favorID,
                }, 200);
            return;
        } catch (err){
            helperModule.manipulate_response_and_send(req, res, {
                'success': false, 
                'message': err,
                }, 500);
            return;
        }
    })
  
}