export const Sequelize = require('sequelize');
export const sequelize = new Sequelize(
    'forward_pay',  // Database name
    'postgres',        // Username
    'aip-dhps',        // Password
    {dialect: 'postgres', host: 'localhost'}
);