import fpUser from '../persistence/objects/fpUser';
const helperModule = require('./helper.js');

module.exports = function(app){

    app.get('/api/signup', function(req, res){
        //show signup HTML here
        res.send('HI, use the post API to signup');
    });

    app.post('/api/signup', async function(req, res){
        /*
        request headers:
            email (string): regex checked in react
            password (string): plaintext
            name (string)
        response headers:
            success (bool)
            message (string)
        response body:
            success (bool)
            message (string)
        */
        let [successFlag, [email, password, name]] = helperModule.get_req_headers(req, ['email', 'password', 'name'], res);
        if (!successFlag)
            return;

        const [newUser, created] = await fpUser.findOrCreate({
            where: {email: email},
        });

        if (created){
            newUser.password = await helperModule.custom_hash(password);
            newUser.name = name;
            await newUser.save();

            helperModule.manipulate_response_and_send(req, res, {
                'success': true, 
                'message': 'user '+email+' created',
                }, 200);
            return;
        }

        helperModule.manipulate_response_and_send(req, res, {
            'success': false, 
            'message': email+' already exists',
            }, 409);
        return;
    });

    app.get('/api/login', async function(req, res){
        /*
        request headers:
            email (string): regex checked in react
            password (string): plaintext
        response headers:
            success (bool)
            message (string)
        cookie {aip_fp}: sets login token
        response body:
            success (bool)
            message (string)
            email (string): user email
            loginToken (string): login token for above email
        */
        let [successFlag, [email, password]] = helperModule.get_req_headers(req, ['email', 'password'], res);
        if (!successFlag)
            return;

        const user = await fpUser.findOne({
           where: {email: email},
        });

        if (user === null) {
            helperModule.manipulate_response_and_send(req, res, {
                'success': false, 
                'message': email+' not registered',
                }, 404);
            return;
        }

        const isPasswordValid = await helperModule.is_secret_valid(password, user.password);
        if (!isPasswordValid) {
            helperModule.manipulate_response_and_send(req, res, {
                'success': false, 
                'message': 'incorrect email password combo',
                }, 401);
            return;
        }

        const loginToken = await helperModule.custom_hash(user.id.toString());
        res.cookie('aip_fp', JSON.stringify({
            loginToken: loginToken,
            email: email }), 
          {maxAge: 3600});
        helperModule.manipulate_response_and_send(req, res, {
            'success': true, 
            'message': 'login token generated and cookie set for '+email,
            'email': email,
            'loginToken': loginToken,
            }, 200);
        return;
    });
 
}