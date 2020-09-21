import {sequelize, Sequelize} from './sequelize';

const fpReward = sequelize.define('fp_reward', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    title: Sequelize.TEXT,
    description: Sequelize.TEXT,
    imgPath: Sequelize.TEXT,
});

export default fpReward;