import fpUser from '../persistence/objects/fpUser';

module.exports = function(app){

    app.get('/signup', function(req, res){
        /*
        req headers:
            email (string): regex checked in react
            password (string): plaintext
            name (string)
        res headers:
            success (bool)
        */
        req.header('User-Agent');
        const users = fpUser.findAll();
        res.send(users);
    });

    //other routes..
}