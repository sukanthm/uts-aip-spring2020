import {sequelize} from '../persistence/objects/sequelize';
const { Op, QueryTypes } = require("sequelize");
import fpUser from '../persistence/objects/fpUser';
import fpFavor from '../persistence/objects/fpFavor';
const helperModule = require('./helper.js');
const backendModule = require('../backend.js');

module.exports = function(app){

    app.get('/api/favors/:targetEmail', backendModule.multerUpload.none(), async function(req, res){
        /*
        Gets all of a user's favors with another user (owed and owing)

        request cookie:
            aip_fp
        url resource:
            targetEmail (string)
        request body keys:
            statusFilter (string): one of ['Paid', 'Pending']
        request query params:
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
        let [validationSuccess, user] = await helperModule.validate_user_loginToken(req, res);
        if (!validationSuccess)
            return;
        
        let targetEmail = helperModule.test_data_type(req.params.targetEmail, 'string')[1];

        let [successFlag, [statusFilter]] = helperModule.get_req_body_json(req, [
                ['statusFilter', 'string']
            ], res);
        if (!successFlag)
            return;

        if (!['Pending', 'Paid'].includes(statusFilter)){
            helperModule.manipulate_response_and_send(req, res, {
                'success': false, 
                'message': 'bad statusFilter header value sent', 
                }, 406);
            return;
        }

        let [successFlag2, [currentPage, itemsPerPage]] = helperModule.get_req_query_params(req, [
            ['currentPage', 'integer'], ['itemsPerPage', 'integer'],
        ], res, true);
        currentPage = currentPage ? currentPage : 0;
        itemsPerPage = itemsPerPage ? itemsPerPage : 5;

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
                    {status: statusFilter},
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

        //output json clean up
        favors = JSON.parse(JSON.stringify(favors)); //deep copy & remove ORM headers
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
            'message': 'sent all requested '+statusFilter+' favors', 
            'output': favors,
            }, 200);
        return;
    });

    app.post('/api/favor', backendModule.multerUpload.single('proofImage'), async function(req, res){
        /*
        Adds a favor

        request cookie:
            aip_fp
        request body keys:
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
            helperModule.get_req_body_json(req, [
                ['payeeEmail', 'string'], ['payerEmail', 'string'], ['rewardID', 'rewardID'],
            ], res);
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

    app.get('/api/favor/:favorID', backendModule.multerUpload.none(), async function(req, res){
        /*
        Gets a user's favor

        request cookie:
            aip_fp
        url resource:
            favorID (int)
        response headers:
            success (bool)
            message (string)
        response body:
            success (bool)
            message (string)
            output (json)
        */
        let [successFlag, favorID] = helperModule.test_data_type(req.params.favorID, 'integer');
        if (!successFlag){
                helperModule.manipulate_response_and_send(req, res, {
                    'success': false, 
                    'message': 'bad favor id requested', 
                    }, 404);
                return;
        }

        let [validationSuccess, user] = await helperModule.validate_user_loginToken(req, res);
        if (!validationSuccess)
            return;
        
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
        //deep copy & remove ORM headers
        favor = JSON.parse(JSON.stringify(favor));
        if (![favor.payee_id.payeeEmail, favor.payer_id.payerEmail].includes(user.email)){
            helperModule.manipulate_response_and_send(req, res, {
                'success': false, 
                'message': 'unAuthorised user', 
                }, 403);
            return;    
        }

        //output json clean up
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

    app.put('/api/favor', backendModule.multerUpload.single('proofImage'), async function(req, res){
        /*
        Closes a user's favor (set to Paid)

        request cookie:
            aip_fp
        request body keys:
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
        let [successFlag, [favorID]] = helperModule.get_req_body_json(req, [
            ['favorID', 'integer']
        ], res);
        if (!successFlag)
            return;

        let [validationSuccess, user] = await helperModule.validate_user_loginToken(req, res);
        if (!validationSuccess)
            return;
        
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
        let payerID = favor.payerID, payeeID = favor.payeeID, userID = user.id;
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

    app.get('/api/dashboard/favors', backendModule.multerUpload.none(), async function(req, res){
        /*
        Gets a user's consolidated favors stats

        request cookie:
            aip_fp
        request body keys:
            statusFilter (string): one of ['Paid', 'Pending']
        response headers:
            success (bool)
            message (string)
        response body:
            success (bool)
            message (string)
            output (json)
        */
        let [validationSuccess, user] = await helperModule.validate_user_loginToken(req, res);
        if (!validationSuccess)
            return;

        let [successFlag, [statusFilter]] = helperModule.get_req_body_json(req, [
                ['statusFilter', 'string']
            ], res);
        if (!successFlag)
            return;

        if (!['Pending', 'Paid'].includes(statusFilter)){
            helperModule.manipulate_response_and_send(req, res, {
                'success': false, 
                'message': 'bad statusFilter header value sent', 
                }, 406);
            return;
        }

        let output = await sequelize.query(
            `
            SELECT DISTINCT u2.email as "payeeEmail", u1.email as "payerEmail", f."rewardID", f.status, 
                COUNT(*) OVER(PARTITION BY f."rewardID", f.status, u2.email, u1.email) as "favorCount"
            FROM "fp_favors" f
            JOIN "fp_users" u1 ON f."payerID" = u1.id
            JOIN "fp_users" u2 ON f."payeeID" = u2.id
            where (f."payerID" = :userID OR f."payeeID" = :userID) AND f.status = :statusFilter
            ;`,
            {
                replacements: { //ORM escapes these values
                    userID: user.id,
                    statusFilter: statusFilter,
                },    
                type: QueryTypes.SELECT
            }
        );

        //output json clean up
        let dataEmail, inOrOutFlag;
        let newOutput1 = new helperModule.defaultDict();
        let newOutput2 = new helperModule.defaultDict();
        for (let i=0; i<output.length; i++){
            if(user.email === output[i]['payerEmail']){
                inOrOutFlag = 'outgoing';
                dataEmail = output[i]['payeeEmail']
            } else {
                inOrOutFlag = 'incoming';
                dataEmail = output[i]['payerEmail']
            }

            newOutput1.add(
                [inOrOutFlag, output[i]['rewardID']], 
                output[i]['favorCount']
            );

            newOutput2.add(
                [dataEmail, inOrOutFlag, output[i]['rewardID']], 
                output[i]['favorCount']
            );
        }

        helperModule.manipulate_response_and_send(req, res, {
            'success': true, 
            'message': statusFilter + ' favors dashboard data sent',
            'output': {
                'consolidated': newOutput1.data,
                'byUser': newOutput2.data,
            },
        }, 200);
        return;
    })
}