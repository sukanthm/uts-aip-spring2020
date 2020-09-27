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

        let creatorID = await user.id;
        const newRequest = fpRequest.build({
            title: title,
            description: description,
            creatorID: creatorID,
        })
        
        if (![undefined, null, '', 'null'].includes(req.file)){
            if (!req.file.mimetype.startsWith('image')){
                helperModule.manipulate_response_and_send(res, false, 'Not an image. please upload only an image file', 400);
                fs.unlink(req.file.path, (err) => {
                    if (err) throw err;
                    console.log('successfully deleted bad upload @ '+req.file.path);
                });
                return;
            }
            newFavor.taskImagePath = req.file.path;
        }

        try {
            await newRequest.save();
            res.set('newRequestID', newRequest.id);
        } catch (err){
            helperModule.manipulate_response_and_send(res, false, err, 500);
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
                helperModule.manipulate_response_and_send(res, false, err, 500);
                return;
            }
        }
        helperModule.manipulate_response_and_send(res, true, 'new Request (id: '+newRequest.id+') and corresponding rewards created', 200);
        return;
    })

    app.get('/requests', async function(req, res){   
        /*
        gets all requests (no auth) - use for landing page

        request headers:
            requestStatus (string): one of ['Open', 'Completed', 'All']

        response headers:
            success (bool)
            message (string)
            output (string): json to string
        */
        let [successFlag, [requestStatus]] = helperModule.get_req_headers(req, ['requestStatus'], res);
        if (!successFlag)
            return;
        
        if (!['Open', 'Completed', 'All'].includes(requestStatus)){
            helperModule.manipulate_response_and_send(res, false, 'bad requestStatus header value sent', 406);
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

        res.set('output', JSON.stringify(outputAllRequests));
        helperModule.manipulate_response_and_send(res, true, 'sent requests as queried.', 200);
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
            output (string): json to string
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

        res.set('output', JSON.stringify(oneRequest));
        helperModule.manipulate_response_and_send(res, true, 'sent request as queried.', 200);
        return;
    })


}