const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

import {
    sequelize, Sequelize, fpUser, 
    fpReward, fpRequest, fpRequestCompletion,
    fpRequestReward, fpFavor
} from './persistence/initORM.js';

const app = express();
app.use(helmet());
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('combined'));

//require('./api/initRoutes.js');
require('./api/routes.js')(app);

// ------------------------------------------------
// Initialize database and create sample data
// ------------------------------------------------
async function initialize() {
    // Create the database tables (force them to be created from scratch)
    await sequelize.sync();
}

initialize().then(() =>
    app.listen(4000, () => {
        console.log('\n Running on http://localhost:4000/ \n');
        
    })

);

