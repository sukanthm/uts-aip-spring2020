
const express = require('express');
const app = express();
import {sequelize} from './persistence/initORM.js';

require('./api/initRoutes.js');









// ------------------------------------------------
// Initialize database and create sample data
// ------------------------------------------------
async function initialize() {
    // Create the database tables (force them to be created from scratch)
    await sequelize.sync().catch(function (err) {
        if(err.constructor.name == 'ConnectionRefusedError'){
            console.log('Connection refused, have you run `npm run postgres` ?')
        }
        
        
      });
}

initialize().then(() =>
    app.listen(4000, () => {
        console.log('Running on http://localhost:4000/');
        
    })

);

