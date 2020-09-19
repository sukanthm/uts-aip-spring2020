
import {sequelize, Sequelize} from './sequelize';
const DataTypes = require('sequelize');

const fpUser = sequelize.define('fp_user', {
    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
    },
    email: {
        type: Sequelize.TEXT,
        primaryKey: true,
    },
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
export default fpUser;