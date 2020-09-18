
const express = require('express');
const app = express();
import {
    sequelize, Sequelize, fpUser, 
    fpReward, fpRequest, fpRequestCompletion,
    fpRequestReward, fpFavor
} from './persistence/initORM.js';










// ------------------------------------------------
// Initialize database and create sample data
// ------------------------------------------------
async function initialize() {
    // Create the database tables (force them to be created from scratch)
    await sequelize.sync({force: true});
}

initialize().then(() =>
    app.listen(4000, () => {
        console.log('Running on http://localhost:4000/');
        
    })

);
