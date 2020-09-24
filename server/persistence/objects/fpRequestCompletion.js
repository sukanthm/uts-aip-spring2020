/* 
import {sequelize, Sequelize} from './sequelize';
import fpRequest from './fpRequest';
import fpUser from './fpUser';

const fpRequestCompletion = sequelize.define('fp_request_completion', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    completionTimestamp: { 
        type: Sequelize.DATE, 
        defaultValue: Sequelize.NOW 
    },
    imgPath: Sequelize.TEXT,
    description: Sequelize.TEXT,
});
fpRequestCompletion.belongsTo(fpRequest,{as: 'Request'});
fpRequestCompletion.belongsTo(fpUser,{as: 'Completer'});

export default fpRequestCompletion;
 */