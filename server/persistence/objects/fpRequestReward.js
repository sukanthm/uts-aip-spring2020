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
    rewardCount: { 
        type: Sequelize.INTEGER, 
        defaultValue: 1 
    },
});
fpRequestReward.belongsToMany(fpUser, {through: 'fpRequest', foreignKey: 'sponsorID', as: 'sponsor_id'});
fpRequestReward.belongsTo(fpRequest, {foreignKey: 'requestID', as: 'request_id'});
fpRequestReward.belongsToMany(fpReward, {through: 'fpRequest', foreignKey: 'rewardID', as: 'reward_id'});

fpUser.hasMany(fpRequestReward, {foreignKey: 'sponsorID', as: 'sponsor_id'});
fpRequest.hasMany(fpRequestReward, {foreignKey: 'requestID', as: 'request_id', onDelete: 'cascade'});
fpReward.hasMany(fpRequestReward, {foreignKey: 'rewardID', as: 'reward_id'});

export default fpRequestReward;