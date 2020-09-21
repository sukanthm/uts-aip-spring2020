import fpUser from '../persistence/objects/fpUser';
const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = function(app){

    app.get('/signup', function(req, res){
        //show signup HTML here
    });

    app.post('/signup', async function(req, res){
        /*
        req headers:
            email (string): regex checked in react
            password (string): plaintext
            name (string)
        res headers:
            success (bool)
            message (string)
        TODO:
            add checks for empty input strings and test flow
        */
        let email, password, name;
        try {
            email = req.header('email');
            password = req.header('password');
            name = req.header('name');
            //add checks for empty strings
        } catch (error) {
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
            const hashedPassword = await new Promise((resolve, reject) => {
                bcrypt.hash(password, saltRounds, function(err, hash) {
                  if (err) reject(err);
                  resolve(hash);
                });
            });
            newUser.password = hashedPassword;
            newUser.name = name;

            await newUser.save();

            res.set('success', true);
            res.set('message', 'user created');
            res.redirect(200, '/login');
        }
        else {
            console.info(email + ' already exists');
            res.set('success', false);
            res.set('message', 'email already exists');
            res.redirect(409, '/login');
        }
    });

    app.get('/login', async function(req, res){
        /*
        req headers:
            email (string): regex checked in react
            password (string): plaintext
        res headers:
            success (bool)
            message (string)
            token (string)
        TODO:
            add checks for empty input strings and test flow
        */
        let email, password, name;
        try {
            email = req.header('email');
            password = req.header('password');
            //add checks for empty strings
        } catch (error) {
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
            res.redirect(401, '/signup');
            return;
        } 
        else {
            const is_valid_password = await new Promise((resolve, reject) => {
                bcrypt.compare(password, user.password, function(err, result) {
                if (err) reject(err);
                resolve(result);
                });
            });
            if (!is_valid_password) {
                res.set('message', 'incorrect email password combo');
                res.set('success', false);
                res.redirect(401, '/login');                
            } 
            else {
                const cookie = req.cookies.aip_fp;
                if (cookie === undefined) {
                    const login_token = await new Promise((resolve, reject) => {
                        bcrypt.hash(user.id.toString(), saltRounds, function(err, hash) {
                        if (err) reject(err);
                        resolve(hash);
                        });
                    });
                    res.cookie('aip_fp', login_token, {maxAge: 3600});
                    res.set('message', 'login token generated and cookie set');
                    res.set('success', true);
                    res.redirect(200, '/');
                } 
            }
        }
    });
}