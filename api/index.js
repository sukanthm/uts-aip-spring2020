const express = require('express');
const app = express();


const Sequelize = require('sequelize');
const sequelize = new Sequelize(
    'forward_pay',  // Database name
    null,        // Username
    null,        // Password
    {dialect: 'postgres', host: 'localhost'}
);

const User = sequelize.define('fp_user', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    email: Sequelize.TEXT,
    name: Sequelize.TEXT,
    password: Sequelize.TEXT,
    isAdmin: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
    isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
});
const Reward = sequelize.define('fp_reward', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    title: Sequelize.TEXT,
    description: Sequelize.TEXT,
    imgPath: Sequelize.TEXT,
});
const Request = sequelize.define('fp_request', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    creationTimestamp: { 
        type: Sequelize.DATE, 
        defaultValue: Sequelize.NOW 
    },
    expiryTimestamp: Sequelize.DATE,
    imgPath: Sequelize.TEXT,
    description: Sequelize.TEXT,
});
Requests.hasOne(User,{as: 'Creator'});
const RequestCompletion = sequelize.define('fp_request_completion', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    completionTimestamp: { 
        type: Sequelize.DATE, 
        defaultValue: Sequelize.NOW 
    },
    imgPath: Sequelize.TEXT,
    description: Sequelize.TEXT,
});
RequestCompletion.hasOne(Request,{as: 'Request'});
RequestCompletion.hasOne(User,{as: 'Completer'});
const RequestReward = sequelize.define('fp_request_reward', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    count: { 
        type: Sequelize.INTEGER, 
        defaultValue: 1 
    },
    status: {
        type: Sequelize.ENUM,
        value: ['Pending','Claimed']
    },
    creationTimestamp: { 
        type: Sequelize.DATE, 
        defaultValue: Sequelize.NOW 
    },
});
RequestReward.hasOne(User,{as: 'Sponsor'});
RequestReward.hasOne(Request,{as: 'Request'});
RequestReward.hasOne(Reward,{as: 'Reward'});
const Favor = sequelize.define('fp_favor', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    creationTimestamp: { 
        type: Sequelize.DATE, 
        defaultValue: Sequelize.NOW 
    },
    usedTimestamp:  Sequelize.DATE,
    status: {
        type: Sequelize.ENUM,
        value: ['Pending','Paid']
    },
});
Favor.hasOne(User,{as: 'Payer'});
Favor.hasOne(User,{as: 'Payee'});
Favor.hasOne(Reward,{as: 'Reward'});
// ------------------------------------------------
// Initialize database and create sample data
// ------------------------------------------------
async function initialize() {
    // Create the database tables (force them to be created from scratch)
    await sequelize.sync({force: true});
}

initialize().then(() =>
    app.listen(3000, () => console.log('Running on http://localhost:3000/'))
);
