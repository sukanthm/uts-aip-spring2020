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
            build rollback trace on error
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
            newFavor.proofPath = req.file.path;
        }

        try {
            await newRequest.save();
            res.set('newRequestID', newRequest.id);
        } catch (err){
            helperModule.manipulate_response_and_send(res, false, err, 500);
            return;
        }

        rewards = JSON.parse(rewards);
        for (let reward in rewards){
            try {
                await fpRequestReward.create({
                    rewardID: Number(reward),
                    rewardCount: rewards[reward],
                    sponsorID: creatorID,
                    requestID: newRequest.id,
                })
            } catch (err) {
                helperModule.manipulate_response_and_send(res, false, err, 500);
                return;
            }
        }
        helperModule.manipulate_response_and_send(res, true, 'new Request (id: '+newRequest.id+') and corresponding rewards created', 200);
        return;
    })
}