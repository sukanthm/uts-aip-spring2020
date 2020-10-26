import {sequelize, Sequelize} from './sequelize';
import fpUser from './fpUser';

const fpRequest = sequelize.define('fp_request', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    title: Sequelize.TEXT,
    description: {
        type: Sequelize.TEXT,
        defaultValue: '',
    },
    taskImagePath: {
        type: Sequelize.TEXT,
        defaultValue: '',
    },
    completedAt: {
        type: Sequelize.DATE,
    },
    completionProofPath: {        
        type: Sequelize.TEXT,   
        defaultValue: '',
    },
    completorComment: {
        type: Sequelize.TEXT,
        defaultValue: '',
    },
    status: {
        type: Sequelize.TEXT,
        isIn: [['Open', 'Completed']],
        defaultValue: 'Open',
    },
});

fpRequest.belongsTo(fpUser, {foreignKey: 'creatorID', as: 'creator_id'});
fpRequest.belongsTo(fpUser, {foreignKey: 'completorID', as: 'completor_id', allowNull: true});

fpUser.hasMany(fpRequest, {foreignKey: 'creatorID', as: 'creator_id'});
fpUser.hasMany(fpRequest, {foreignKey: 'completorID', as: 'completor_id', allowNull: true});

export default fpRequest;