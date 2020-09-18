import {sequelize, Sequelize} from './sequelize';
import fpUser from './fpUser';

const fpRequest = sequelize.define('fp_request', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    creationTimestamp: { 
        type: Sequelize.DATE, 
        defaultValue: Sequelize.NOW 
    },
    expiryTimestamp: Sequelize.DATE,
    imgPath: Sequelize.TEXT,
    description: Sequelize.TEXT,
});
fpRequest.hasOne(fpUser,{as: 'Creator'});

export default fpRequest;