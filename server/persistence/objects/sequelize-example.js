export const Sequelize = require('sequelize');
export const sequelize = new Sequelize(
    'forward_pay',  // Database name
    null,        // Username
    null,        // Password
    {dialect: 'postgres', host: 'localhost'}
);

/**
 * Deployment should require the addition of a proper username and password 
 * rename this file to take the place of sequelize.js
 * 
 * 
 */