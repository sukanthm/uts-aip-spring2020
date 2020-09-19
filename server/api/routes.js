import fpUser from '../persistence/objects/fpUser';
const bcrypt = require('bcrypt');
const saltRounds = 10;
module.exports = function(app){

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
                  if (err) reject(err)
                  resolve(hash)
                });
              })
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

    //other routes..
}