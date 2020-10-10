const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

import {
    sequelize, Sequelize, fpUser, 
    fpReward, fpRequest, //fpRequestCompletion,
    fpRequestReward, fpFavor
} from './persistence/initORM.js';

const app = express();
app.use(cookieParser());
app.use(helmet());
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('combined'));

require('./api/signupLogin.js')(app);
require('./api/favor.js')(app);
require('./api/party.js')(app);
require('./api/request.js')(app);
require('./api/leaderboard.js')(app);

const port = process.argv[2] ? process.argv[2] : 4000;

// ------------------------------------------------
// Initialize database and create sample data
// ------------------------------------------------
async function initialize() {
    // Create the database tables (force them to be created from scratch)
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