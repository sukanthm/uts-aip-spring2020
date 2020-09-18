import {sequelize, Sequelize} from './sequelize';
import fpUser from './fpUser';
import fpReward from './fpReward';

const fpFavor = sequelize.define('fp_favor', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    creationTimestamp: { 
        type: Sequelize.DATE, 
        defaultValue: Sequelize.NOW 
    },
    usedTimestamp:  Sequelize.DATE,
    status: {
        type: Sequelize.ENUM,
        values: ['Pending','Paid'],
        defaultValue: 'Pending'
    },
});
fpFavor.hasOne(fpUser,{as: 'Payer'});
fpFavor.hasOne(fpUser,{as: 'Payee'});
fpFavor.hasOne(fpReward,{as: 'Reward'});

export default fpFavor;