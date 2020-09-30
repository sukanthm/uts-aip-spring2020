const fs = require('fs');
const { Op } = require("sequelize");
import fpUser from '../persistence/objects/fpUser';
import fpFavor from '../persistence/objects/fpFavor';
import fpRequest from '../persistence/objects/fpRequest';
import fpRequestReward from '../persistence/objects/fpRequestReward';
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

    app.post('/request', upload.single('proofImage'), async function(req, res){
        /*
        Adds a request

        request headers:
            loginToken (string)
            email (string)
            title (string)
            description (string)
            rewards (JSON): {rewardID: rewardCount, ...}
        taskImage (form-data): optional. check https://github.com/expressjs/multer for frontend form
        response headers:
            success (bool)
            message (string)
        response body:
            success (bool)
            message (string)
            newRequestID (int)
        TODO:
            test image upload
        */
        let [successFlag, [email, loginToken, title, description, rewards]] = 
            helperModule.get_req_headers(req, ['email', 'loginToken', 'title', 'description', 'rewards'], res);
        if (!successFlag)
            return;
        
        let [validationSuccess, user] = await helperModule.validate_user_loginToken(email, loginToken, res);
        if (!validationSuccess)
            return;

        let creatorID = user.id;
        const newRequest = fpRequest.build({
            title: title,
            description: description,
            creatorID: creatorID,
        })
        
        if (![undefined, null, '', 'null'].includes(req.file)){
            if (!req.file.mimetype.startsWith('image')){
                helperModule.manipulate_response_and_send(res, {
                    'success': false, 
                    'message': 'Not an image. please upload only an image file', 
                    }, 400);
                fs.unlink(req.file.path, (err) => {
                    if (err) throw err;
                    console.log('successfully deleted bad upload @ '+req.file.path);
                });
                return;
            }
            newRequest.taskImagePath = req.file.path;
        }

        try {
            await newRequest.save();
            res.set('newRequestID', newRequest.id);
        } catch (err){
            fs.unlink(req.file.path, (err) => {
                if (err) throw err;
                console.log('successfully deleted image associated with failed db save @ '+req.file.path);
            });
            helperModule.manipulate_response_and_send(res, {
                'success': false, 
                'message': err,
                }, 500);
            return;
        }

        rewards = JSON.parse(rewards);
        let rewardsInstances = [];
        for (let reward in rewards){
            try {
                let newfpRequestReward = await fpRequestReward.create({
                    rewardID: Number(reward),
                    rewardCount: rewards[reward],
                    sponsorID: creatorID,
                    requestID: newRequest.id,
                });
                rewardsInstances.push(newfpRequestReward);
            } catch (err) {
                fs.unlink(req.file.path, (err) => {
                    if (err) throw err;
                    console.log('successfully deleted image associated with failed db save @ '+req.file.path);
                });
                await newRequest.destroy();
                for (let i=0; i<rewardsInstances.length; i++){
                    await rewardsInstances[i].destroy();
                }
                helperModule.manipulate_response_and_send(res, {
                    'success': false, 
                    'message': err,
                    }, 500);
                return;
            }
        }
        helperModule.manipulate_response_and_send(res, {
            'success': true, 
            'message': 'new Request (id: '+newRequest.id+') and corresponding rewards created',
            'newRequestID': newRequest.id,
            }, 200);
        return;
    })

    app.get('/requests', async function(req, res){   
        /*
        gets all requests (no auth) - use for front/landing page

        request headers:
            requestStatus (string): one of ['Open', 'Completed', 'All']
        response headers:
            success (bool)
            message (string)
        response body:
            success (bool)
            message (string)
            output (array of json)
        TODO:
            pagination
        */
        let [successFlag, [requestStatus]] = helperModule.get_req_headers(req, ['requestStatus'], res);
        if (!successFlag)
            return;
        
        if (!['Open', 'Completed', 'All'].includes(requestStatus)){
            helperModule.manipulate_response_and_send(res, {
                'success': false, 
                'message': 'bad requestStatus header value sent', 
                }, 406);
            return;
        }
        if (requestStatus === 'All')
            requestStatus = ['Open', 'Completed'];
        else
            requestStatus = [requestStatus];
        
        let allRequests = await fpRequest.findAll({
            attributes: ['id', 'status', 'title', 'description', 'completedAt', 'createdAt', 'taskImagePath', 'completionProofPath'],
            where: {
                status: {
                  [Op.or]: requestStatus,
                },
              },
            include: [
            {
                model: fpRequestReward,
                as: 'request_id',
                attributes: ['rewardID', 'rewardCount'],
            },
        ]
        });

        let outputAllRequests = JSON.parse(JSON.stringify(allRequests));
        for (let i=0; i<allRequests.length; i++){
            outputAllRequests[i]['rewards'] = outputAllRequests[i]['request_id'];
            delete outputAllRequests[i]['request_id'];
        }

        helperModule.manipulate_response_and_send(res, {
            'success': true, 
            'message': 'sent requests as queried',
            'output': outputAllRequests,
            }, 200);
        return;
    })

    app.get('/request', async function(req, res){
        /*
        gets a request

        request headers:
            loginToken (string)
            email (string)
            requestID (int)
        response headers:
            success (bool)
            message (string)
        response body:
            success (bool)
            message (string)
            output (json)
        TODO:
            improve sponsor_id -> sponsorEmail transaltion
        */
        let [successFlag, [loginToken, email, requestID]] = helperModule.get_req_headers(req, ['loginToken', 'email', 'requestID'], res);
        if (!successFlag)
            return;

        let [validationSuccess, user] = await helperModule.validate_user_loginToken(email, loginToken, res);
        if (!validationSuccess)
            return;
        
        let oneRequest = await fpRequest.findOne({
            attributes: ['id', 'status', 'title', 'description', 'completedAt', 'createdAt', 'taskImagePath', 'completionProofPath'],
            where: {
                id: requestID
              },
            include: [
            {
                model: fpUser,
                as: 'creator_id',
                attributes: [['email', 'creatorEmail']],
            },{
                model: fpUser,
                as: 'completor_id',
                attributes: [['email', 'completorEmail']],
            },{
                model: fpRequestReward,
                as: 'request_id',
                attributes: ['rewardID', 'rewardCount', 'sponsorID'],
            },
        ]
        });

        if (oneRequest === null){
            helperModule.manipulate_response_and_send(res, {
                'success': false, 
                'message': 'bad request id requested', 
                }, 404);
            return;    
        }

        oneRequest = JSON.parse(JSON.stringify(oneRequest));
        oneRequest['rewards'] = oneRequest['request_id'];
        delete oneRequest['request_id'];
        oneRequest['creatorEmail'] = oneRequest['creator_id']['creatorEmail'];
        delete oneRequest['creator_id'];
        if (oneRequest['completorEmail'] != null){
            oneRequest['completorEmail'] = oneRequest['completor_id']['completorEmail'];
            delete oneRequest['completor_id'];
        }
        else {
            oneRequest['completorEmail'] = null;
            delete oneRequest['completor_id'];
        }

        let sponsorMap = {}; //improve sponsor_id -> sponsorEmail transaltion
        for (let i=0; i<oneRequest['rewards'].length; i++){
            if(!(oneRequest['rewards'][i]['sponsorID'] in sponsorMap)){
                let sponsor = await fpUser.findOne({
                    where: {id: oneRequest['rewards'][i]['sponsorID']},
                });
                sponsorMap[sponsor.id] = sponsor.email;
            } 
            oneRequest['rewards'][i]['sponsorEmail'] = sponsorMap[oneRequest['rewards'][i]['sponsorID']];
            delete oneRequest['rewards'][i]['sponsorID'];
        }

        helperModule.manipulate_response_and_send(res, {
            'success': true, 
            'message': 'sent request as queried', 
            'output': oneRequest,
            }, 200);
        return;
    })

    app.put('/request', upload.single('proofImage'), async function(req, res){
        /*
        completes a request

        request headers:
            loginToken (string)
            email (string)
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
        TODO:
            test image upload
        */
        let [successFlag, [email, loginToken, requestID, completorComment]] = 
            helperModule.get_req_headers(req, ['email', 'loginToken', 'requestID', 'completorComment'], res);
        if (!successFlag)
            return;
        
        let [validationSuccess, user] = await helperModule.validate_user_loginToken(email, loginToken, res);
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
            helperModule.manipulate_response_and_send(res, {
                'success': false, 
                'message': 'bad request id requested', 
                }, 404);
            return;    
        }
        if (oneRequest.status === 'Completed'){
            helperModule.manipulate_response_and_send(res, {
                'success': false, 
                'message': 'request already Completed. ignoring current request',
                }, 409);
            return;
        }
        if (oneRequest.creatorID === user.id){
            helperModule.manipulate_response_and_send(res, {
                'success': false, 
                'message': 'request cannot be Completed by creator. ignoring current request',
                }, 409);
            return;
        }
        
        if (![undefined, null, '', 'null'].includes(req.file)){
            helperModule.manipulate_response_and_send(res, {
                'success': false, 
                'message': 'image proof missing, need proof to Complete a request',
                }, 400);
            return;
        } 
        else {
            if (!req.file.mimetype.startsWith('image')){
                helperModule.manipulate_response_and_send(res, {
                    'success': false, 
                    'message': 'Not an image. please upload only an image file',
                    }, 400);
                fs.unlink(req.file.path, (err) => {
                    if (err) throw err;
                    console.log('successfully deleted bad upload @ '+req.file.path);
                });
                return;
            }
            oneRequest.completionProofPath = req.file.path;
            oneRequest.completorID = user.id;
            oneRequest.status = 'Completed';
            oneRequest.completorComment = completorComment;
        }

        try {
            await oneRequest.save();
        } catch (err) {
            fs.unlink(req.file.path, (err) => {
                if (err) throw err;
                console.log('successfully deleted image associated with failed db save @ '+req.file.path);
            });
            helperModule.manipulate_response_and_send(res, {
                'success': false, 
                'message': err,
                }, 500);
            return;
        }

        let favorTrace = [];
        let favors = oneRequest['request_id'];
        for (let i=0; i<favors.length; i++){
            for (let j=0; j<Number(favors[i]['rewardCount']); j++){
                let favor = fpFavor.build({
                    payeeID: user.id,
                    payerID: favors[i]['sponsor_id'],
                    rewardID: favors[i]['rewardID'],
                    comment: 'automagically created for requestID: '+oneRequest.id+' completion',
                });
                favorTrace.push(favor);
            }
        }

        for (let i=0; i<favorTrace.length; i++){
            try {
                favorTrace[i].save();
            } catch (err) {
                for (let j=0; j<=i; j++){
                    favorTrace[j].destroy();
                }
                fs.unlink(req.file.path, (err) => {
                    if (err) throw err;
                    console.log('successfully deleted image associated with failed db save @ '+req.file.path);
                });
                oneRequest.completionProofPath = '';
                oneRequest.completorID = null;
                oneRequest.status = 'Open';
                oneRequest.completorComment = '';
                oneRequest.save();
                helperModule.manipulate_response_and_send(res, {
                    'success': false, 
                    'message': err,
                    }, 500);
                return;
            }
        }
        helperModule.manipulate_response_and_send(res, {
            'success': true, 
            'message': 'requestID: '+requestID+' Completed, favors added to you',
            'completedrequestID': requestID,
            }, 200);
        return;
    })

    app.put('/request/sponsor', upload.single('proofImage'), async function(req, res){
        /*
        changes a request's sponsor's rewards

        request headers:
            loginToken (string)
            email (string)
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
        let [successFlag, [email, loginToken, requestID, rewardChanges]] = 
        helperModule.get_req_headers(req, ['email', 'loginToken', 'requestID', 'rewardChanges'], res);
        if (!successFlag)
            return;
   
        let [validationSuccess, user] = await helperModule.validate_user_loginToken(email, loginToken, res);
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
            helperModule.manipulate_response_and_send(res, {
                'success': false, 
                'message': 'bad request id requested', 
                }, 404);
            return;    
        }
        if (oneRequest.status === 'Completed'){
            helperModule.manipulate_response_and_send(res, {
                'success': false, 
                'message': 'request already Completed. ignoring current request', 
                }, 409);
            return;
        }

        let requestRewards = JSON.parse(JSON.stringify(oneRequest))['request_id'];
        rewardChanges = JSON.parse(rewardChanges);

        for (let rewardChange in rewardChanges){
            rewardChange = Number(rewardChange);
            let foundFlag = false;
            for (let i=0; i<requestRewards.length; i++){
                if (user.id == requestRewards[i]['sponsorID'] && rewardChange == requestRewards[i]['rewardID']){
                    requestRewards[i]['rewardCount'] += Number(rewardChanges[rewardChange]);
                    let x = await fpRequestReward.findOne({
                        where: {
                            requestID: oneRequest.id,
                            sponsorID: requestRewards[i]['sponsorID'],
                            rewardID: rewardChange,
                        }
                    });
                    x.rewardCount += Number(rewardChanges[rewardChange]);
                    if (requestRewards[i]['rewardCount'] <= 0){
                        requestRewards.splice(i,1);
                        await x.destroy();
                    } else await x.save();
                    foundFlag = true;
                    break;
                }
            }
            if (!foundFlag){
                if (rewardChanges[rewardChange] > 0){
                    requestRewards.push(
                        {
                            rewardCount: rewardChanges[rewardChange],
                            rewardID: rewardChange,
                            sponsorID: user.id,
                        }
                    );
                    await fpRequestReward.create({
                            rewardCount: rewardChanges[rewardChange],
                            rewardID: rewardChange,
                            sponsorID: user.id,
                            requestID: oneRequest.id,                         
                    });
                }
            }
        }

        if (requestRewards.length === 0){
            oneRequest.destroy();
            helperModule.manipulate_response_and_send(res, {
                'success': true, 
                'message': 'requestID: '+oneRequest.id+' has no rewards left, deleting request',
                'deletedRequestID': oneRequest.id,
                }, 200);
            return;
        } else {
            helperModule.manipulate_response_and_send(res, {
                'success': true, 
                'message': 'requestID: '+oneRequest.id+' rewards updated',
                'updatedRequestID': oneRequest.id,
                }, 200);
            return;
        }
    })

}