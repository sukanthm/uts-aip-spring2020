import {sequelize, Sequelize} from '../persistence/objects/sequelize';
const { Op, QueryTypes } = require("sequelize");
import fpUser from '../persistence/objects/fpUser';
import fpFavor from '../persistence/objects/fpFavor';
import fpRequest from '../persistence/objects/fpRequest';
import fpRequestReward from '../persistence/objects/fpRequestReward';
const helperModule = require('./helper.js');
const backendModule = require('../backend.js');

module.exports = function(app){

    app.post('/api/request', backendModule.multerUpload.single('proofImage'), async function(req, res){
        /*
        Adds a request

        request cookie:
            aip_fp
        request body keys:
            title (string)
            description (string): optional.
            rewards (JSON): {rewardID: rewardCount, ...}
        taskImage (form-data): optional. check https://github.com/expressjs/multer for frontend form
        response headers:
            success (bool)
            message (string)
        response body:
            success (bool)
            message (string)
            newRequestID (int)
        */
        let [successFlag1, [title, rewards]] = helperModule.get_req_body_json(req, [
            ['title', 'string'], ['rewards', 'rewardsDict'],
        ], res);
        if (!successFlag1)
            return;

        let [successFlag2, [description]] = helperModule.get_req_body_json(req, [
            ['description', 'string']
        ], res, true);
        
        let [validationSuccess, user] = await helperModule.validate_user_loginToken(req, res);
        if (!validationSuccess)
            return;

        let creatorID = user.id;
        const newRequest = fpRequest.build({
            title: title,
            description: description,
            creatorID: creatorID,
        })

        if (Object.keys(rewards).length === 0 || (
                    Math.min.apply(null, Object.values(rewards)) <= 0 && 
                    Math.max.apply(null, Object.values(rewards)) <= 0
                )){
            helperModule.manipulate_response_and_send(req, res, {
                'success': false, 
                'message': 'creator must sponsor some rewards', 
                }, 400);
            return;
        }
        
        if (req.file !== undefined){
            if (!req.file.mimetype.startsWith('image')){
                helperModule.manipulate_response_and_send(req, res, {
                    'success': false, 
                    'message': 'Not an image. please upload only an image file', 
                    }, 400);
                return;
            }
            newRequest.taskImagePath = req.file.filename;
        }

        try {
            await newRequest.save();
            res.set('newRequestID', newRequest.id);
        } catch (err){
            helperModule.manipulate_response_and_send(req, res, {
                'success': false, 
                'message': err,
                }, 500);
            return;
        }

        //requestRewards creation trace. to roll back db state if something fails.
        let rewardsInstances = [];
        for (let reward in rewards){
            if (rewards[reward] > 0){
                try {
                    let newfpRequestReward = await fpRequestReward.create({
                        rewardID: reward,
                        rewardCount: rewards[reward],
                        sponsorID: creatorID,
                        requestID: newRequest.id,
                    });
                    rewardsInstances.push(newfpRequestReward);
                } catch (err) {
                    await newRequest.destroy();
                    for (let i=0; i<rewardsInstances.length; i++){
                        await rewardsInstances[i].destroy();
                    }
                    helperModule.manipulate_response_and_send(req, res, {
                        'success': false,
                        'message': err,
                        }, 500);
                    return;
                }
            }
        }
        helperModule.manipulate_response_and_send(req, res, {
            'success': true, 
            'message': 'new Request (id: '+newRequest.id+') and corresponding rewards created',
            'newRequestID': newRequest.id,
            }, 200);
        return;
    })

    app.get('/api/requests', backendModule.multerUpload.none(), async function(req, res){   
        /*
        gets all requests (no auth) - use for front/landing page

        request http headers:
            dashboardFilter (string): optional. one of ['Creator', 'Sponsor', 'Completor', 'All'] >> created by me, sponsored by me, etc.
            searchData (string): optional. searches in request title, request description and reward name
            requestStatus (string): optional. one of ['Open', 'Completed', 'All'] >> global filter for request status.
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
        let [successFlag1, [requestStatus, searchData, dashboardFilter]] = 
            helperModule.get_req_headers(req, [
                ['requestStatus', 'string'], ['searchData', 'string'], ['dashboardFilter', 'string'],
            ], res, true);
        let [successFlag2, [currentPage, itemsPerPage]] = 
            helperModule.get_req_query_params(req, [
                ['currentPage', 'integer'], ['itemsPerPage', 'integer'],
            ], res, true);
        currentPage = currentPage ? currentPage : 0;
        itemsPerPage = itemsPerPage ? itemsPerPage : 5;
        searchData = helperModule.clean_and_shuffle(searchData);
        requestStatus = requestStatus ? requestStatus : 'All';
        let dashboardFilterSQL = '/* */'; //postgres multiline comment => no filter, for when dashboardFilter == All

        if (!(dashboardFilter === undefined)){
            //dashboardFilter can be used only by logged in users
            let [validationSuccess, user] = await helperModule.validate_user_loginToken(req, res);
            if (!validationSuccess)
                return;

            if (!['Creator', 'Sponsor', 'Completor', 'All'].includes(dashboardFilter)){
                helperModule.manipulate_response_and_send(req, res, {
                    'success': false, 
                    'message': 'bad dashboardFilter header value sent', 
                    }, 406);
                return;
            }
            switch(dashboardFilter) {
                //creating custom dashboardFilter SQL line
                case "Creator":
                    dashboardFilterSQL = `"fp_requests"."creatorID" = '` + user.id + `' AND`;
                    break;
                case "Sponsor":
                    dashboardFilterSQL = `"fp_request_rewards"."sponsorID" = '` + user.id + `' AND`;
                    break;
                case "Completor":
                    dashboardFilterSQL = `"fp_requests"."completorID" = '` + user.id + `' AND`;
                    break;
            }
        } 

        if (!['Open', 'Completed', 'All'].includes(requestStatus)){
            helperModule.manipulate_response_and_send(req, res, {
                'success': false, 
                'message': 'bad requestStatus header value sent', 
                }, 406);
            return;
        }
        requestStatus = requestStatus === 'All' ? '%' : requestStatus; //match anything
        
        
        //find requests that satisfy requestStatus and dashboardFilter and searchData
        //then paginate, then (subquery) get the sponsor details
        let allRequests = await sequelize.query(
            `select a.*, "fp_request_rewards"."rewardID", sum("fp_request_rewards"."rewardCount") as "rewardCount", "fp_rewards"."title" as "rewardTitle" from (
                select COUNT(*) OVER() as customCount, "fp_requests"."id", "fp_requests"."title", "fp_requests"."description", "fp_requests"."taskImagePath", "fp_requests"."completedAt", 
                    "fp_requests"."completionProofPath", "fp_requests"."completorComment", "fp_requests"."status", "fp_requests"."createdAt"
                from "fp_requests"
                LEFT OUTER JOIN "fp_request_rewards" on "fp_requests"."id" = "fp_request_rewards"."requestID"
                LEFT OUTER JOIN "fp_rewards" on "fp_request_rewards"."rewardID" = "fp_rewards"."id"
                where
                    ` + dashboardFilterSQL + `
                    "fp_requests"."status" ilike :requestStatus AND (
                        "fp_requests"."title" ilike ANY (ARRAY[:searchData]) OR
                        "fp_requests"."description" ilike ANY (ARRAY[:searchData]) OR
                        "fp_rewards"."title" ilike ANY (ARRAY[:searchData])
                    )
                GROUP BY "fp_requests"."id", "fp_requests"."title", "fp_requests"."description", "fp_requests"."taskImagePath", "fp_requests"."completedAt", 
                    "fp_requests"."completionProofPath", "fp_requests"."completorComment", "fp_requests"."status", "fp_requests"."createdAt"
                ORDER BY "fp_requests"."createdAt" DESC
                LIMIT :itemsPerPage OFFSET :offset
            ) a 
            LEFT OUTER JOIN "fp_request_rewards" on a."id" = "fp_request_rewards"."requestID"
            LEFT OUTER JOIN "fp_rewards" on "fp_request_rewards"."rewardID" = "fp_rewards"."id"
            GROUP BY a.customCount, a."id", a."title", a."description", a."taskImagePath", a."completedAt", a."completionProofPath", 
                a."completorComment", a."status", a."createdAt", "fp_request_rewards"."rewardID", "fp_rewards"."title"
            ;`,
            {
              replacements: { //ORM escapes these values
                  requestStatus: requestStatus,
                  searchData: searchData,
                  itemsPerPage: itemsPerPage,
                  offset: currentPage * itemsPerPage,
                },
              type: QueryTypes.SELECT
            }
        );

        //output json clean up
        let totalCount;
        let outputAllRequests = {'data': {}};
        for (let i=0; i<allRequests.length; i++){
            if (allRequests[i]['id'] in outputAllRequests['data']){
                outputAllRequests['data'][allRequests[i]['id']]['rewards']
                    [allRequests[i]['rewardID']] = allRequests[i]['rewardCount'];
            } else {
                totalCount = allRequests[i]['customcount'];
                outputAllRequests['data'][allRequests[i]['id']] = {
                    'id': allRequests[i]['id'],
                    'title': allRequests[i]['title'],
                    'description': allRequests[i]['description'],
                    'taskImagePath': allRequests[i]['taskImagePath'],
                    'completedAt': allRequests[i]['completedAt'],
                    'completionProofPath': allRequests[i]['completionProofPath'],
                    'completorComment': allRequests[i]['completorComment'],
                    'status': allRequests[i]['status'],
                    'createdAt': allRequests[i]['createdAt'],
                    'rewards': {
                        [allRequests[i]['rewardID']]: allRequests[i]['rewardCount'],
                    }
                }
            }
        }
        outputAllRequests['rows'] = Object.values(outputAllRequests['data']);
        outputAllRequests['rows'] = outputAllRequests['rows'].sort(helperModule.date_sort);
        delete outputAllRequests['data'];
        outputAllRequests['totalItems'] = totalCount ? Number(totalCount) : 0;
        outputAllRequests['totalPages'] = Math.ceil(outputAllRequests['totalItems']/itemsPerPage);
        outputAllRequests['itemsPerPage'] = itemsPerPage;
        outputAllRequests['currentPage'] = currentPage;

        helperModule.manipulate_response_and_send(req, res, {
            'success': true, 
            'message': 'sent requests as queried',
            'output': outputAllRequests,
            }, 200);
        return;
    })

    app.get('/api/request/:requestID', backendModule.multerUpload.none(), async function(req, res){
        /*
        gets a request

        request cookie:
            aip_fp
        url resource:
            requestID (int)
        response headers:
            success (bool)
            message (string)
        response body:
            success (bool)
            message (string)
            output (json)
        */
        let [successFlag, requestID] = helperModule.test_data_type(req.params.requestID, 'integer');
        if (!successFlag){
                helperModule.manipulate_response_and_send(req, res, {
                    'success': false, 
                    'message': 'bad request id requested', 
                    }, 404);
                return;
        }

        let [validationSuccess, user] = await helperModule.validate_user_loginToken(req, res);
        if (!validationSuccess)
            return;

        let oneRequest = await sequelize.query(
            `
            SELECT r.id, r.status, r.title, r.description, r."completedAt", r."createdAt", r."taskImagePath", r."completionProofPath",
                u1.email as "creatorEmail", u2.email as "completorEmail", u3.email as "sponsorEmail", rr."rewardID", rr."rewardCount"
            FROM "fp_requests" r
            JOIN "fp_users" u1 on u1.id = r."creatorID"
            LEFT JOIN "fp_users" u2 on u2.id = r."completorID"
            JOIN "fp_request_rewards" rr on rr."requestID" = r.id
            JOIN "fp_users" u3 on u3.id = rr."sponsorID"
            WHERE r.id = :requestID
            ;`,
            {
              replacements: { //ORM escapes these values
                requestID: requestID,
                },
              type: QueryTypes.SELECT
            }
        );

        if (oneRequest.length === 0){
            helperModule.manipulate_response_and_send(req, res, {
                'success': false, 
                'message': 'bad request id requested', 
                }, 404);
            return;    
        }

        //output json clean up
        let outputOneRequest = {"rewards": {}}
        for (let i=0; i<oneRequest.length; i++){
            if (!(oneRequest[i]['sponsorEmail'] in outputOneRequest['rewards']))
                outputOneRequest['rewards'][oneRequest[i]['sponsorEmail']] = {};
            outputOneRequest['rewards'][oneRequest[i]['sponsorEmail']]
                [oneRequest[i]['rewardID']] = oneRequest[i]['rewardCount'];
        }
        let keys = ['id', 'status', 'title', 'description', 'createdAt', 
            'taskImagePath', 'completionProofPath', 'creatorEmail', 'completorEmail'];
        for (let i=0; i<keys.length; i++)
            outputOneRequest[keys[i]] = oneRequest[0][keys[i]];

        helperModule.manipulate_response_and_send(req, res, {
            'success': true, 
            'message': 'sent request as queried', 
            'output': outputOneRequest,
            }, 200);
        return;
    })

    app.put('/api/request', backendModule.multerUpload.single('proofImage'), async function(req, res){
        /*
        completes a request

        request cookie:
            aip_fp
        request body keys:
            requestID (int)
            completorComment (string)
        taskImage (form-data): check https://github.com/expressjs/multer for frontend form
        response headers:
            success (bool)
            message (string)
        response body:
            success (bool)
            message (string)
            completedrequestID (int)
        */
        let [successFlag, [requestID, completorComment]] = 
            helperModule.get_req_body_json(req, [
                ['requestID', 'integer'], ['completorComment', 'string']
            ], res);
        if (!successFlag)
            return;
        
        let [validationSuccess, user] = await helperModule.validate_user_loginToken(req, res);
        if (!validationSuccess)
            return;

        let oneRequest = await fpRequest.findOne({
            where: {
                id: requestID
                },
            include: [
                {
                    model: fpRequestReward,
                    as: 'request_id',
                    attributes: ['rewardID', 'rewardCount', 'sponsorID'],
                },
            ]
        });

        if (oneRequest === null){
            helperModule.manipulate_response_and_send(req, res, {
                'success': false, 
                'message': 'bad request id requested', 
                }, 404);
            return;    
        }
        if (oneRequest.status === 'Completed'){
            helperModule.manipulate_response_and_send(req, res, {
                'success': false, 
                'message': 'request already Completed. ignoring current request',
                }, 409);
            return;
        }
        if (oneRequest.creatorID === user.id){
            helperModule.manipulate_response_and_send(req, res, {
                'success': false, 
                'message': 'request cannot be Completed by creator. ignoring current request',
                }, 409);
            return;
        }

        //gets all sponsors for a request, needs hacky ORM code
        let sponsors = await fpRequestReward.findAll({
            attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('sponsorID')), 'sponsorID']],
            where: {
                requestID: oneRequest.id,
            }
        });
        //deep copy & remove ORM headers
        sponsors = JSON.parse(JSON.stringify(sponsors));
        for (let i=0; i<sponsors.length; i++){
            if (user.id === sponsors[i]['sponsorID']){
                helperModule.manipulate_response_and_send(req, res, {
                    'success': false, 
                    'message': 'request cannot be Completed by a sponsor. ignoring current request',
                    }, 409);
                return;
            }
        }
        
        if (req.file === undefined){
            helperModule.manipulate_response_and_send(req, res, {
                'success': false, 
                'message': 'image proof missing, need proof to Complete a request',
                }, 400);
            return;
        } 
        else {
            if (!req.file.mimetype.startsWith('image')){
                helperModule.manipulate_response_and_send(req, res, {
                    'success': false, 
                    'message': 'Not an image. please upload only an image file',
                    }, 400);
                return;
            }
            oneRequest.completionProofPath = req.file.filename;
            oneRequest.completorID = user.id;
            oneRequest.status = 'Completed';
            oneRequest.completorComment = completorComment;
            oneRequest.completedAt = Date.now();
        }

        try {
            await oneRequest.save();
        } catch (err) {
            helperModule.manipulate_response_and_send(req, res, {
                'success': false, 
                'message': err,
                }, 500);
            return;
        }

        //create favors creation trace. to roll back db state if something fails.
        let favorTrace = [];
        let favors = JSON.parse(JSON.stringify(oneRequest['request_id'])); //deep copy & remove ORM headers
        for (let i=0; i<favors.length; i++){
            for (let j=0; j<Number(favors[i]['rewardCount']); j++){
                let favor = fpFavor.build({
                    payeeID: user.id,
                    payerID: favors[i]['sponsorID'],
                    rewardID: favors[i]['rewardID'],
                    comment: 'automagically created for requestID: '+oneRequest.id+' completion',
                    creationProofPath: req.file.filename,
                });
                favorTrace.push(favor);
            }
        }

        //execute favors trace, with rollback on error for the completed request and all it's favors
        for (let i=0; i<favorTrace.length; i++){
            try {
                favorTrace[i].save();
            } catch (err) {
                for (let j=0; j<=i; j++){
                    favorTrace[j].destroy();
                }
                oneRequest.completionProofPath = '';
                oneRequest.completorID = null;
                oneRequest.status = 'Open';
                oneRequest.completorComment = '';
                oneRequest.completedAt = null;
                oneRequest.save();
                helperModule.manipulate_response_and_send(req, res, {
                    'success': false, 
                    'message': err,
                    }, 500);
                return;
            }
        }
        helperModule.manipulate_response_and_send(req, res, {
            'success': true, 
            'message': 'requestID: '+requestID+' Completed, favors added to you',
            'completedrequestID': requestID,
            }, 200);
        return;
    })

    app.put('/api/request/sponsor', backendModule.multerUpload.none(), async function(req, res){
        /*
        changes a request's sponsor's rewards

        request cookie:
            aip_fp
        request body keys:
            requestID (int)
            rewardChanges (JSON): {rewardID: rewardCountChange, ...}
        response headers:
            success (bool)
            message (string)
        response body:
            success (bool)
            message (string)
            updatedRequestID/deletedRequestID (int)
        */
        let [successFlag, [requestID, rewardChanges]] = 
        helperModule.get_req_body_json(req, [
            ['requestID', 'integer'], ['rewardChanges', 'rewardsDict']
        ], res);
        if (!successFlag)
            return;
   
        let [validationSuccess, user] = await helperModule.validate_user_loginToken(req, res);
            if (!validationSuccess)
            return;

        let oneRequest = await fpRequest.findOne({
            where: {
                id: requestID
                },
            include: [
                {
                    model: fpRequestReward,
                    as: 'request_id',
                    attributes: ['rewardID', 'rewardCount', 'sponsorID'],
                },
            ]
        });

        if (oneRequest === null){
            helperModule.manipulate_response_and_send(req, res, {
                'success': false, 
                'message': 'bad request id requested', 
                }, 404);
            return;    
        }
        if (oneRequest.status === 'Completed'){
            helperModule.manipulate_response_and_send(req, res, {
                'success': false, 
                'message': 'request already Completed. ignoring current request', 
                }, 409);
            return;
        }

        let oneRequestReward;
        for (let rewardID in rewardChanges){
            //find api caller's sponsorhip rows and create/update/delete as necessary
            oneRequestReward = await fpRequestReward.findOne({
                where: {
                    requestID: oneRequest.id,
                    sponsorID: user.id,
                    rewardID: rewardID,
                }
            });
            if (oneRequestReward === null){
                if (rewardChanges[rewardID] > 0){
                    await fpRequestReward.create({
                        rewardCount: rewardChanges[rewardID],
                        rewardID: rewardID,
                        sponsorID: user.id,
                        requestID: oneRequest.id,                         
                    });
                }
            } else {
                oneRequestReward.rewardCount += rewardChanges[rewardID];
                if (oneRequestReward.rewardCount <= 0)
                    await oneRequestReward.destroy();
                else
                    await oneRequestReward.save();
            }
        }

        //find total rewards present for this request post update
        let totalRewardsCount = await sequelize.query(
            `
            SELECT SUM(a."rewardCount") as "sum"
            FROM "fp_request_rewards" a
            WHERE a."requestID" = :requestID
            ;`,
            {
              replacements: { //ORM escapes these values
                  requestID: oneRequest.id,
              }, type: QueryTypes.SELECT
            }
        );
        if (totalRewardsCount[0]['sum'] === null){
            oneRequest.destroy();
            helperModule.manipulate_response_and_send(req, res, {
                'success': true, 
                'message': 'requestID: '+oneRequest.id+' has no rewards left, deleting request',
                'deletedRequestID': oneRequest.id,
                }, 200);
            return;
        } else {
            helperModule.manipulate_response_and_send(req, res, {
                'success': true, 
                'message': 'requestID: '+oneRequest.id+' rewards updated',
                'updatedRequestID': oneRequest.id,
                }, 200);
            return;
        }
    })

}