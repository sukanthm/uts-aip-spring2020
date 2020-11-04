const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

var multer  = require('multer');
const helperModule = require('./api/helper.js');
var multerStorage = helperModule.multerStorage;
var upload = multer({ storage: multerStorage });
module.exports = {
    multerUpload: upload,
}

helperModule.set_up_rsa();

import { sequelize } from './persistence/initORM.js';

const app = express();
app.use(cookieParser());
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
//app.use(function(req,res,next){setTimeout(next,2000)});  //global api delay ms

require('./api/signupLogin.js')(app);
require('./api/favor.js')(app);
require('./api/party.js')(app);
require('./api/request.js')(app);
require('./api/leaderboard.js')(app);
require('./api/image.js')(app);

const port = process.argv[2] ? process.argv[2] : 4000;

// Alter the database tables' schema (not drop and create)
async function initialize() {
    await sequelize.sync({alter: true}).catch(function (err) {
        if(err.constructor.name == 'ConnectionRefusedError'){
            console.log('Connection refused, have you run `npm run postgres` ?')
        } 
    });
}

initialize().then(() =>
    app.listen(port, () => {
        console.log('\n Running on port: '+port+' \n');
    })
);