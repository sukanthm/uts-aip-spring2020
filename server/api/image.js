const fs = require('fs')
const helperModule = require('./helper.js');

module.exports = function(app){

    app.get('/api/image/:fileName', async function(req, res){
        let fqPath = helperModule.imagesDir + req.params.fileName;
        fs.access(fqPath, fs.F_OK, (err) => {
            if (err) {
                helperModule.manipulate_response_and_send(req, res, {
                    'success': false, 
                    'message': 'requested image not found',
                    }, 404);
            }
            res.sendFile(fqPath);
        });
    });

}