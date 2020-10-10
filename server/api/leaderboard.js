const { Op, QueryTypes } = require("sequelize");
import {sequelize, Sequelize} from '../persistence/objects/sequelize';
const helperModule = require('./helper.js');

module.exports = function(app){

    app.get('/api/leaderboard/1', async function(req, res){
        /*
        get user list by most incoming open favors 

        request cookie:
            aip_fp
        request headers:
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
            helperModule.get_req_headers(req, ['currentPage', 'itemsPerPage'], res, true);
        currentPage = currentPage ? Number(currentPage) : 0;
        itemsPerPage = itemsPerPage ? Number(itemsPerPage) : 5;

        let [validationSuccess, user] = await helperModule.validate_user_loginToken(req, res);
        if (!validationSuccess)
            return;

        let output = await sequelize.query(
            `
            SELECT "fp_users"."email", COUNT(*) as "incomingFavorCount"
            FROM "fp_users"
            LEFT JOIN "fp_favors" ON "fp_users"."id" = "fp_favors"."payeeID"
            where "fp_favors"."status" = 'Pending'
            GROUP BY "fp_users"."email"
            ORDER BY "incomingFavorCount" DESC
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

        helperModule.manipulate_response_and_send(req, res, {
            'success': true, 
            'message': 'sent requests as queried',
            'output': output,
            }, 200);
        return;
    })
}