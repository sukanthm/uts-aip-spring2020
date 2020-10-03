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
        defaultValue: '',
    },
    completedAt: {
        type: Sequelize.DATE,
    },
    completionProofPath: {        
        type: Sequelize.STRING,   
        defaultValue: '',
    },
    completorComment:{
        type: Sequelize.STRING,   
        defaultValue: '',
    },
    status: {
        type: Sequelize.STRING,
        isIn: [['Open', 'Completed']],
        defaultValue: 'Open',
    },
});

fpRequest.belongsTo(fpUser, {foreignKey: 'creatorID', as: 'creator_id'});
fpRequest.belongsTo(fpUser, {foreignKey: 'completorID', as: 'completor_id', allowNull: true});

fpUser.hasMany(fpRequest, {foreignKey: 'creatorID', as: 'creator_id'});
fpUser.hasMany(fpRequest, {foreignKey: 'completorID', as: 'completor_id', allowNull: true});

export default fpRequest;