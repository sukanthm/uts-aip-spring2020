import fpUser from '../persistence/objects/fpUser';
const bcrypt = require('bcrypt');
const saltRounds = 10;

async function custom_hash(input){
    return new Promise((resolve, reject) => {
        bcrypt.hash(input, saltRounds, function(err, hash) {
          if (err) reject(err);
          resolve(hash);
        });
    });
}

async function is_password_valid(plaintextPassword, hashedPassword){
    return new Promise((resolve, reject) => {
        bcrypt.compare(plaintextPassword, hashedPassword, function(err, result) {
        if (err) reject(err);
        resolve(result);
        });
    });
}

function get_req_headers(req, headers) {
    let header, output = [];
    for (let i = 0, len = headers.length; i < len; i++) {
        header = req.header(headers[i]);
        if (header === undefined || header === 'null'){
            return [false, headers];
        }
        output.push(header);
    }
    return [true, output];
}

module.exports = function(app){

    app.get('/signup', function(req, res){
        //show signup HTML here
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
            console.error('mandatory request headers missing');
            res.set('success', false);
            res.set('message', 'mandatory request headers missing');
            res.redirect(400, '/signup');
            return;
        }

        const [newUser, created] = await fpUser.findOrCreate({
            where: {email: email},
        });

        if (created){
            newUser.password = await custom_hash(password);
            newUser.name = name;
            await newUser.save();

            res.set('success', true);
            res.set('message', 'user created');
            res.redirect(200, '/login');
        }
        else {;
            console.info(email + ' already exists');
            res.set('success', false);
            res.set('message', 'email already exists');
            res.redirect(409, '/login');
        }
    });

    app.get('/login', async function(req, res){
        /*
        request headers:
            email (string): regex checked in react
            password (string): plaintext
        response headers:
            success (bool)
            message (string)
            cooke with login token (string)
        TODO:

        */
        let [successFlag, [email, password]] = get_req_headers(req, ['email', 'password']);
        if (!successFlag){
            console.error('mandatory request headers missing');
            res.set('success', false);
            res.set('message', 'mandatory request headers missing');
            res.redirect(400, '/login');
            return;
        }

        const user = await fpUser.findOne({
           where: {email: email},
        });

        if (user === null) {
            console.info(email + ' not registered');
            res.set('success', false);
            res.set('message', 'email not registered');
            res.redirect(406, '/signup');
            return;
        } 
        else {
            const isPasswordValid = await is_password_valid(password, user.password);
            if (!isPasswordValid) {
                res.set('message', 'incorrect email password combo');
                res.set('success', false);
                res.redirect(401, '/login');                
            } 
            else {
                //const cookie = req.cookies.aip_fp;
                const loginToken = await custom_hash(user.id.toString());
                res.cookie('aip_fp', loginToken, {maxAge: 3600});
                res.set('message', 'login token generated and cookie set');
                res.set('success', true);
                res.redirect(200, '/');
            }
        }
    });
}