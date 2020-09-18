export const Sequelize = require('sequelize');
export const sequelize = new Sequelize(
    'forward_pay',  // Database name
    null,        // Username
    null,        // Password
    {dialect: 'postgres', host: 'localhost'}
);


