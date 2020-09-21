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

module.exports = {
    create_rewards: async function() {
        return fpReward.bulkCreate([
            {   
                title: 'coffee',
                description: 'a cuppa',
            },
            {   
                title: 'meal',
                description: 'lunch with a homie',
            },
            {   
                title: 'snacks',
                description: 'pringles for life yo',
            },
            {   
                title: 'candy',
                description: 'bag of maltesers',
            },
            {   
                title: 'drink',
                description: 'next rounds on me',
            },
        ]);
    }
}