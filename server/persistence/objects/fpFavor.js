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
        type: Sequelize.ENUM,
        values: ['Pending','Paid'],
        defaultValue: 'Pending'
    },
    /*  
    rewardCount: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
    }, 
    */
    proofPath: {                  //if we want to store image history. nah for now.
        type: Sequelize.STRING,   //const DataTypes = require('sequelize'); DataTypes.ARRAY(DataTypes.STRING);
        defaultValue: ''
    },
});
fpFavor.belongsTo(fpUser, {foreignKey: 'payerID', as: 'payer_id'});
fpFavor.belongsTo(fpUser, {foreignKey: 'payeeID', as: 'payee_id'});

fpUser.hasMany(fpFavor, {foreignKey: 'payerID', as: 'payer_id'});
fpUser.hasMany(fpFavor, {foreignKey: 'payeeID', as: 'payee_id'});


fpFavor.belongsTo(fpReward, {foreignKey: 'rewardID'});
fpReward.hasMany(fpFavor, {foreignKey: 'rewardID'});

export default fpFavor;