import {sequelize, Sequelize} from './sequelize';
import fpUser from './fpUser';
import fpReward from './fpReward';

const fpFavor = sequelize.define('fp_favor', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    status: {
        type: Sequelize.TEXT,
        isIn: [['Pending', 'Paid']],
        defaultValue: 'Pending'
    },
    paidAt: {
        type: Sequelize.DATE,
    },
    creationProofPath: {                  
        type: Sequelize.TEXT,   
        defaultValue: ''
    },
    completionProofPath: {                  
        type: Sequelize.TEXT,   
        defaultValue: ''
    },
    comment: {
        type: Sequelize.TEXT,   
        defaultValue: ''
    }
});

fpFavor.belongsTo(fpUser, {foreignKey: 'payerID', as: 'payer_id'});
fpFavor.belongsTo(fpUser, {foreignKey: 'payeeID', as: 'payee_id'});

fpUser.hasMany(fpFavor, {foreignKey: 'payerID', as: 'payer_id'});
fpUser.hasMany(fpFavor, {foreignKey: 'payeeID', as: 'payee_id'});


fpFavor.belongsTo(fpReward, {foreignKey: 'rewardID'});
fpReward.hasMany(fpFavor, {foreignKey: 'rewardID'});

export default fpFavor;