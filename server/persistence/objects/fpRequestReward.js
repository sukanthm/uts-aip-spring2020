import {sequelize, Sequelize} from './sequelize';
import fpUser from './fpUser';
import fpRequest from './fpRequest';
import fpReward from './fpReward';

const fpRequestReward = sequelize.define('fp_request_reward', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    count: { 
        type: Sequelize.INTEGER, 
        defaultValue: 1 
    },
    status: {
        type: Sequelize.ENUM,
        values: ['Pending','Claimed'],
        defaultValue: 'Pending'
    },
    creationTimestamp: { 
        type: Sequelize.DATE, 
        defaultValue: Sequelize.NOW 
    },
});
fpRequestReward.hasOne(fpUser,{as: 'Sponsor'});
fpRequestReward.hasOne(fpRequest,{as: 'Request'});
fpRequestReward.hasOne(fpReward,{as: 'Reward'});

export default fpRequestReward;