const express = require('express');
const app = express();
import {
    sequelize, Sequelize, fpUser, 
    fpReward, fpRequest, fpRequestCompletion,
    fpRequestReward, fpFavor
} from './initORM.js';









// ------------------------------------------------
// Initialize database and create sample data
// ------------------------------------------------
async function buildDatabase() {
    // Create the database tables (force them to be created from scratch)
    await sequelize.sync({force: true});
}

buildDatabase().then(() =>
console.log('Database Table Built, script will end momentarily')

);