const express = require('express');
const app = express();
import {sequelize} from './initORM.js';









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
}

buildDatabase().then(() =>
console.log('Database Table Built, script will end momentarily')

);