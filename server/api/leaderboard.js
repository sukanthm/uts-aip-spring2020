const { Op, QueryTypes } = require("sequelize");
import {sequelize, Sequelize} from '../persistence/objects/sequelize';
const helperModule = require('./helper.js');
const backendModule = require('../backend.js');

module.exports = function(app){

    app.get('/api/leaderboard/1', backendModule.multerUpload.none(), async function(req, res){
        /*
        1st leaderboard api
        get user list by most incoming open favors 

        request cookie:
            aip_fp
        request query params:
            currentPage (int): optional. pagination page, default = 0
            itemsPerPage (int): optional. pagination items per page, default = 5
        response headers:
            success (bool)
            message (string)
        response body:
            success (bool)
            message (string)
            output (array of json)
        */
        let [successFlag, [currentPage, itemsPerPage]] = 
            helperModule.get_req_query_params(req, [
                ['currentPage', 'integer'], ['itemsPerPage', 'integer']
            ], res, true);
        currentPage = currentPage ? currentPage : 0;
        itemsPerPage = itemsPerPage ? itemsPerPage : 5;

        let [validationSuccess, user] = await helperModule.validate_user_loginToken(req, res);
        if (!validationSuccess)
            return;

        let output = await sequelize.query(
            `
            SELECT "fp_users"."email", COUNT(*) as "pendingIncomingFavorCount"
            FROM "fp_users"
            LEFT JOIN "fp_favors" ON "fp_users"."id" = "fp_favors"."payeeID"
            where "fp_favors"."status" = 'Pending'
            GROUP BY "fp_users"."email"
            ORDER BY "pendingIncomingFavorCount" DESC
            LIMIT :itemsPerPage OFFSET :offset
            ;`,
            {
                replacements: { 
                    itemsPerPage: itemsPerPage,
                    offset: currentPage * itemsPerPage,
                  },
                type: QueryTypes.SELECT
              }
        );

        //output json clean up
        let new_output = {}
        for (let i=0; i<output.length; i++)
            new_output[output[i]['email']] = Number(output[i]['pendingIncomingFavorCount']);

        helperModule.manipulate_response_and_send(req, res, {
            'success': true, 
            'message': 'sent leaderboard 1 as queried //{email: pendingIncomingFavorCount, ...}',
            'output': new_output,
            }, 200);
        return;
    })
}