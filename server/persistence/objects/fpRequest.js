import {sequelize, Sequelize} from './sequelize';
import fpUser from './fpUser';

const fpRequest = sequelize.define('fp_request', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    title: Sequelize.TEXT,
    description: Sequelize.TEXT,
    taskImagePath: {
        type: Sequelize.STRING,
        defaultValue: ''
    },
    completedAt: {
        type: Sequelize.DATE,
    },
    completionProofPath: {                  //if we want to store image history. nah for now.
        type: Sequelize.STRING,   //const DataTypes = require('sequelize'); DataTypes.ARRAY(DataTypes.STRING);
        defaultValue: ''
    },
    status: {
        type: Sequelize.ENUM,
        values: ['Open','Completed'],
        defaultValue: 'Open',
    },
});

fpRequest.belongsTo(fpUser, {foreignKey: 'creatorID', as: 'creator_id'});
fpRequest.belongsTo(fpUser, {foreignKey: 'completorID', as: 'completor_id', allowNull: true});

fpUser.hasMany(fpRequest, {foreignKey: 'creatorID', as: 'creator_id'});
fpUser.hasMany(fpRequest, {foreignKey: 'completorID', as: 'completor_id', allowNull: true});

export default fpRequest;