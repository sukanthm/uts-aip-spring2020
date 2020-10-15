var assert = require('assert');
var path = require('path');
var multer  = require('multer');
const fs = require('fs');
import fpUser from '../persistence/objects/fpUser';
const bcrypt = require('bcrypt');

const saltRounds = 10;

function date_sort(a, b) {
    if (a['createdAt'] > b['createdAt']) return -1;
    if (b['createdAt'] > a['createdAt']) return 1;
    return 0;
  }

function clean_and_shuffle(input){
    input = input ? input.split(/[\n\r\t\v\f\s,=({["'-;#]+/) : [''];

    var j, x, i;
    for (i=0; i<input.length; i++){
        if (input[i] === '')
            input.splice(i,1);
    }
    
    if (input.length === 0)
        return ['%'];

    for (i = input.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = input[i];
        input[i] = input[j];
        input[j] = x;
    }

    for (let i=0; i<input.length; i++){
        input[i] = '%' + input[i] + '%';
    }
    return input;
}

function manipulate_response_and_send(req, res, resBodyObject, httpCode){
    console.log(resBodyObject);
    res.set('success', resBodyObject['success']);
    res.set('message', resBodyObject['message']);
    res.status(httpCode);

    if (httpCode != 200 && req.file !== undefined){
        fs.unlink(req.file.path, (err) => {
            if (err) throw err;
            console.log('successfully deleted bad upload @ '+req.file.path);
        });
    }

    res.send(resBodyObject);
    return;
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

function test_data_type(input, type){
    switch(type) {
        case "string":
            return [true, String(input).trim()];
        case "integer": 
            return [/^-?\d+$/.test(input), Number(input)];
        case "rewardID": 
            return [/^[12345]$/.test(input), Number(input)];
        case "rewardsDict": //{rewardID: integer, ...}
            try {
                if (typeof input === 'string')
                    input = JSON.parse(input);
                if (!(input.constructor == Object))
                    return [false, undefined]; 

                let output = {}, test1, test2, new_key, new_value;
                for (let key in input){
                    [test1, new_key] = test_data_type(key, 'rewardID')
                    assert(test1);
                    [test2, new_value] = test_data_type(input[key], 'integer')
                    assert(test2);
                    output[new_key] = new_value;
                }
                return [true, output];
            } catch (err) {
                return [false, undefined];
            }
    }
}

function get_req_headers(req, headers, res, allOptional=false){
    let header, output = [], testDataType;
    for (let i = 0, len = headers.length; i < len; i++) {
        header = req.header(headers[i][0]);

        if (!allOptional){
            [testDataType, header] = test_data_type(header, headers[i][1]);
            if (!testDataType){
                manipulate_response_and_send(req, res, {
                    'success': false, 
                    'message': 'bad header {'+headers[i][0]+'} data type. expecting '+headers[i][1],
                    }, 400);
                return [false, headers];
            }

            if ([undefined, null, '', 'null'].includes(header)){
                manipulate_response_and_send(req, res, {
                    'success': false, 
                    'message': 'mandatory request headers missing',
                    }, 400);
                return [false, headers];
            }
        }
        output.push(header);
    }
    return [true, output];
}

async function validate_user_loginToken(req, res){
    let aipFpCookie = req.cookies.aip_fp;
    if (aipFpCookie === undefined){
        manipulate_response_and_send(req, res, {
            'success': false, 
            'message': 'not logged in',
            }, 401);
        return [false, undefined];
    }

    try {
        aipFpCookie = JSON.parse(aipFpCookie);
        assert(Object.keys(aipFpCookie).length === 2);
        assert(Object.keys(aipFpCookie).includes('email'));
        assert(Object.keys(aipFpCookie).includes('loginToken'));
    }
    catch (err) {
        manipulate_response_and_send(req, res, {
            'success': false, 
            'message': 'bad cookie',
            }, 406);
        return [false, undefined];
    }

    const user = await fpUser.findOne({
        where: {email: aipFpCookie['email']},
    });
    if (user === null){
        manipulate_response_and_send(req, res, {
            'success': false, 
            'message': 'unRegistered user',
            }, 404);
        return [false, undefined];
    }
    if (! await is_secret_valid(await user.id, aipFpCookie['loginToken'])){
        manipulate_response_and_send(req, res, {
            'success': false, 
            'message': 'unAuthenticated user',
            }, 401);
        return [false, undefined];
    }
    return [true, user];
}

var multerStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname + '/../../frontend/public/proof_images/'));
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, uniqueSuffix + '-' + file.originalname)
    }
})

module.exports = {
    manipulate_response_and_send: manipulate_response_and_send,
    is_secret_valid: is_secret_valid,
    get_req_headers: get_req_headers,
    custom_hash: custom_hash,
    validate_user_loginToken: validate_user_loginToken,
    multerStorage: multerStorage,
    clean_and_shuffle: clean_and_shuffle,
    date_sort: date_sort,
}