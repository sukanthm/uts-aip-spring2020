const url = require('url');
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

async function custom_hash(input){ //from https://github.com/kelektiv/node.bcrypt.js#readme
    return new Promise((resolve, reject) => {
        bcrypt.hash(input, saltRounds, function(err, hash) {
          if (err) reject(err);
          resolve(hash);
        });
    });
}

async function is_secret_valid(plaintext, hashed){ //from https://github.com/kelektiv/node.bcrypt.js#readme
    return new Promise((resolve, reject) => {
        bcrypt.compare(plaintext, hashed, function(err, result) {
        if (err) reject(err);
        resolve(result);
        });
    });
}

function test_data_type(input, type){
    let flag;
    switch(type) {
        case "string":
            if ([undefined, null].includes(input))
                return [false, undefined]
            return [true, String(input).trim().replace(/(?![\x00-\x7F])./g, '').substring(0, 255)];
        case "integer": 
            flag = /^-?\d+$/.test(input);
            return [flag, flag ? Number(input) : undefined];
        case "rewardID": 
            flag = /^[12345]$/.test(input);
            return [flag, flag ? Number(input) : undefined];
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
    for (let i = 0; i < headers.length; i++) {
        header = req.header(headers[i][0]);
        [testDataType, header] = test_data_type(header, headers[i][1]);
        output.push(header);

        if (!allOptional){
            if (!testDataType){
                manipulate_response_and_send(req, res, {
                    'success': false, 
                    'message': 'bad header {'+headers[i][0]+'} data type. expecting '+headers[i][1],
                    }, 400);
                return [false, null];
            }
            if (header === undefined){
                manipulate_response_and_send(req, res, {
                    'success': false, 
                    'message': 'mandatory request headers missing',
                    }, 400);
                return [false, null];
            }
        }
    }
    return [true, output];
}

function get_req_query_params(req, params, res, allOptional=false){
    let param, output = [], testDataType;
    const queryObject = url.parse(req.url, true).query;
    for (let i = 0; i < params.length; i++) {
        param = queryObject[params[i][0]];
        [testDataType, param] = test_data_type(param, params[i][1]);
        output.push(param);

        if (!allOptional){   
            if (!testDataType){
                manipulate_response_and_send(req, res, {
                    'success': false, 
                    'message': 'bad param {'+params[i][0]+'} data type. expecting '+params[i][1],
                    }, 400);
                return [false, null];
            }
            if (!(param)){
                manipulate_response_and_send(req, res, {
                    'success': false, 
                    'message': 'mandatory query params missing',
                    }, 400);
                return [false, null];
            }
        }
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

const imagesDir = path.join(__dirname + '/../public_images/'); //w.r.t. to current folder

var multerStorage = multer.diskStorage({ //from https://github.com/expressjs/multer#readme
    destination: function (req, file, cb) {
        cb(null, imagesDir);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, uniqueSuffix + '-' + file.originalname)
    }
})

class defaultDict {
    constructor(){
        this.data = {};
    }
    add(keys, value){
        let evalString, sliceJoin;
        for (let i=0; i<keys.length; i++){
            sliceJoin = '["' + keys.slice(0, i).join(`"]["`) + '"]';
            evalString = sliceJoin.length > 4 ? 'this.data' + sliceJoin : 'this.data';
            if(!(eval('"'+keys[i]+'" in '+evalString+';'))){
                if (i<keys.length-1)
                    eval(evalString + '["' + keys[i] + '"] = {};');
                else
                    eval(evalString + '["' + keys[i] + '"] = 0;');
            }
        }
        eval(evalString + '["' + keys[keys.length - 1] + '"] += ' + value + ';');
    }
}

module.exports = {
    manipulate_response_and_send: manipulate_response_and_send,
    is_secret_valid: is_secret_valid,
    get_req_headers: get_req_headers,
    custom_hash: custom_hash,
    validate_user_loginToken: validate_user_loginToken,
    multerStorage: multerStorage,
    clean_and_shuffle: clean_and_shuffle,
    date_sort: date_sort,
    imagesDir: imagesDir,
    get_req_query_params: get_req_query_params,
    test_data_type: test_data_type,
    defaultDict: defaultDict,
}