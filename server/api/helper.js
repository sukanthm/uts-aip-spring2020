import fpUser from '../persistence/objects/fpUser';
const bcrypt = require('bcrypt');

const saltRounds = 10;

function manipulate_response_and_send(res, resBodyObject, httpCode){
    console.log(resBodyObject);
    res.set('success', resBodyObject['success']);
    res.set('message', resBodyObject['message']);
    res.status(httpCode);
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

function get_req_headers(req, headers, res){
    let header, output = [];
    for (let i = 0, len = headers.length; i < len; i++) {
        header = req.header(headers[i]);
        if ([undefined, null, '', 'null'].includes(header)){
            manipulate_response_and_send(res, {
                'success': false, 
                'message': 'mandatory request headers missing',
                }, 400);
            return [false, headers];
        }
        output.push(header.trim());
    }
    return [true, output];
}

async function validate_user_loginToken(email, loginToken, res){
    const user = await fpUser.findOne({
        where: {email: email},
    });
    if (user === null){
        manipulate_response_and_send(res, {
            'success': false, 
            'message': 'unRegistered user',
            }, 404);
        return [false, undefined];
    }
    if (! await is_secret_valid(await user.id, loginToken)){
        manipulate_response_and_send(res, {
            'success': false, 
            'message': 'unAuthenticated user',
            }, 401);
        return [false, undefined];
    }
    return [true, user];
}

module.exports = {
    manipulate_response_and_send: manipulate_response_and_send,
    is_secret_valid: is_secret_valid,
    get_req_headers: get_req_headers,
    custom_hash: custom_hash,
    validate_user_loginToken: validate_user_loginToken,
}