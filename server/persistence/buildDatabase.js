const express = require('express');
import {sequelize} from './initORM.js';
const fpRewardModule = require('./objects/fpReward.js');
const fpUserModule = require('./objects/fpUser.js');

// Drop and Create the database tables (force wipe all)
async function buildDatabase() {
    await sequelize.sync({force: true}).catch(function (err) {
        if(err.constructor.name == 'ConnectionRefusedError'){
            console.log('Connection refused, have you run `npm run postgres` ?')
        }
    });
    await fpRewardModule.create_rewards();
    await fpUserModule.create_users();
}

buildDatabase().then(() =>
    console.log('\n\n Database Table Built, script will end momentarily \n\n')
);