
import {sequelize, Sequelize} from './sequelize';
const DataTypes = require('sequelize');
const helperModule = require('../../api/helper.js');

const fpUser = sequelize.define('fp_user', {
    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
    email: {
        type: Sequelize.TEXT,
        unique: true,
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

module.exports = {
    create_users: async function() {
        return fpUser.bulkCreate([
            {   
                //no real admin rights :P
                email: 'admin',
                name: 'admin',
                password: await helperModule.custom_hash(`R"A7x&^~s42:UMaF`),
            },
        ]);
    }
}