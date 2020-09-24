import fpUser from '../persistence/objects/fpUser';
const helperModule = require('./helper.js');

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

            helperModule.manipulate_response_and_send(res, true, 'user '+email+' created', 200);
            return;
        }

        helperModule.manipulate_response_and_send(res, false, email+' already exists', 409);
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
        */
        let [successFlag, [email, password]] = helperModule.get_req_headers(req, ['email', 'password'], res);
        if (!successFlag)
            return;

        const user = await fpUser.findOne({
           where: {email: email},
        });

        if (user === null) {
            helperModule.manipulate_response_and_send(res, false, email+' not registered', 406);
            return;
        }

        const isPasswordValid = await helperModule.is_secret_valid(password, user.password);
        if (!isPasswordValid) {
            helperModule.manipulate_response_and_send(res, false, 'incorrect email password combo', 401);
            return;
        }

        const loginToken = await helperModule.custom_hash(user.id.toString());
        res.cookie('aip_fp', JSON.stringify({
            loginToken: loginToken,
            email: email }), 
          {maxAge: 3600});
        helperModule.manipulate_response_and_send(res, true, 'login token generated and cookie set for '+email, 200);
        return;
    });
 
}