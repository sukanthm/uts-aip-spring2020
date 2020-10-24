const fs = require('fs')
const helperModule = require('./helper.js');

module.exports = function(app){

    app.get('/api/image/:fileName', async function(req, res){
        /*
        Gets an image if present in imagesDir (no auth)

        url resource:
            fileName (string)
        response body:
            image
        */
        let fileName = helperModule.test_data_type(req.params.fileName, 'string')[1];
        let fqPath = helperModule.imagesDir + fileName;
        fs.access(fqPath, fs.F_OK, (err) => {
            if (err) res.status(404).end();
            res.sendFile(fqPath);
        });
    });

}