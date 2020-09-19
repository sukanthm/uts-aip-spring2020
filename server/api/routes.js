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
        */
        let email, password, name;
        try {
            email = req.header('email');
            password = req.header('password');
            name = req.header('name');
        } catch (error) {
            console.error('mandatory request headers missing');
            res.status(400);
            res.set('success', false);
            res.set('message', 'mandatory request headers missing');
            res.send('add html');
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

            res.status(200);
            res.set('success', true);
            res.set('message', 'user created');
            res.send('add html');
        }
        else {
            console.info(email + ' already exists');
            res.status(409);
            res.set('success', false);
            res.set('message', 'email already exists');
            res.send('add html');
        }
    });

    app.get('/login', function(req, res){
        /*
        req headers:
            email (string): regex checked in react
            password (string): plaintext
        res headers:
            success (bool)
            message (string)
            token (string)
        */
        let email, password, name;
        try {
            email = req.header('email');
            password = req.header('password');
        } catch (error) {
            console.error('mandatory request headers missing');
            res.status(400);
            res.set('success', false);
            res.set('message', 'mandatory request headers missing');
            res.send('add html');
            return;
        }

        const user = await fpUser.findOne({
            where: {email: email},
        });

        if (user === null) {
            console.info(email + ' not registered');
            res.status(401);
            res.set('success', false);
            res.set('message', 'email not registered');
            res.send('add html');
            return;
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
            } 
            else {
                const is_valid_token = await new Promise((resolve, reject) => {
                    bcrypt.compare(user.id.toString(), cookie, function(err, result) {
                      if (err) reject(err);
                      resolve(result);
                    });
                });
                res.set('message', 'valid cookie exists');
            }

            res.status(200);
            res.set('success', true);
            res.send('add html');
        }
    });
}