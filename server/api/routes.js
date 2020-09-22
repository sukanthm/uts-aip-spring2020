import fpUser from '../persistence/objects/fpUser';
const bcrypt = require('bcrypt');
const saltRounds = 10;

function manipulate_response_and_send(res, successFlag, message, httpCode, redirectUrl=false){
    console.log(message);
    res.set('success', successFlag);
    res.set('message', message);
    res.status(httpCode);
    if (redirectUrl != false)
        res.redirect(redirectUrl);
    else
        res.send();
    return;
}

async function validate_user(email, loginToken){
    const user = await fpUser.findOne({
        where: {email: email},
    });
    if (is_secret_valid(await user.id, loginToken)){
        return [true, user];
    }
    else{
        return [false, undefined];
    }
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

function get_req_headers(req, headers){
    let header, output = [];
    for (let i = 0, len = headers.length; i < len; i++) {
        header = req.header(headers[i]);
        if ([undefined, null, '', 'null'].includes(header)){
            return [false, headers];
        }
        output.push(header);
    }
    return [true, output];
}

module.exports = function(app){

    app.get('/signup', function(req, res){
        //show signup HTML here
        res.send('HI, use the post API to login');
    });

    app.post('/signup', async function(req, res){
        /*
        request headers:
            email (string): regex checked in react
            password (string): plaintext
            name (string)
        response headers:
            success (bool)
            message (string)
        TODO:

        */
        let [successFlag, [email, password, name]] = get_req_headers(req, ['email', 'password', 'name']);
        if (!successFlag){
            manipulate_response_and_send(res, false, 'mandatory request headers missing', 400);
            return;
        }

        const [newUser, created] = await fpUser.findOrCreate({
            where: {email: email},
        });

        if (created){
            newUser.password = await custom_hash(password);
            newUser.name = name;
            await newUser.save();

            manipulate_response_and_send(res, true, 'user '+email+' created', 200);
            return;
        }

        manipulate_response_and_send(res, false, email+' already exists', 409);
        return;
    });

    app.get('/login', async function(req, res){
        /*
        request headers:
            email (string): regex checked in react
            password (string): plaintext
        response headers:
            success (bool)
            message (string)
            cookie {aip_fp}: sets login token
        TODO:

        */
        let [successFlag, [email, password]] = get_req_headers(req, ['email', 'password']);
        if (!successFlag){
            manipulate_response_and_send(res, false, 'mandatory request headers missing', 400);
            return;
        }

        const user = await fpUser.findOne({
           where: {email: email},
        });

        if (user === null) {
            manipulate_response_and_send(res, false, email+' not registered', 406);
            return;
        }

        const isPasswordValid = await is_secret_valid(password, user.password);
        if (!isPasswordValid) {
            manipulate_response_and_send(res, false, 'incorrect email password combo', 401);
            return;
        }

        const loginToken = await custom_hash(user.id.toString());
        res.cookie('aip_fp', JSON.stringify({
            loginToken: loginToken,
            email: email, }), 
            {maxAge: 3600});
        manipulate_response_and_send(res, true, 'login token generated and cookie set for '+email, 200);
        return;
    });

    app.get('/favors', async function(req, res){
        /*
        Gets a user's favors (owed and owing)

        request headers:
            aip_fp (string): login token
        response headers:
            success (bool)
            message (string)
            output (json)
        TODO:
            add core functionality
        */
        let [successFlag, [email, loginToken]] = get_req_headers(req, ['email', 'loginToken']);
        if (!successFlag){
            manipulate_response_and_send(res, false, 'mandatory request headers missing', 400);
            return;
        }

        let [validationSuccess, user] = validate_user(email, loginToken);
        if (!validationSuccess){
            manipulate_response_and_send(res, false, 'unAuthenticated user', 401);
            return;
        }
    
    });
}