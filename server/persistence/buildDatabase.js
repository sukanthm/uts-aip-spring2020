const express = require('express');
import {sequelize} from './initORM.js';
const fpRewardModule = require('./objects/fpReward.js');


// ------------------------------------------------
// Initialize database and create sample data
// ------------------------------------------------
async function buildDatabase() {
    // Create the database tables (force them to be created from scratch)
    await sequelize.sync({force: true}).catch(function (err) {
        if(err.constructor.name == 'ConnectionRefusedError'){
            console.log('Connection refused, have you run `npm run postgres` ?')
        }
    });
    await fpRewardModule.create_rewards();
}

buildDatabase().then(() =>
console.log('\n\n Database Table Built, script will end momentarily \n\n')
);