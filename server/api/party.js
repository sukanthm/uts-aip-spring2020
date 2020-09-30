const { Op } = require("sequelize");
import fpFavor from '../persistence/objects/fpFavor';
import fpUser from '../persistence/objects/fpUser';
const helperModule = require('./helper.js');

function get_array_index(array, target){
    for(let i=0; i<array.length; i++){
        if(JSON.stringify(array[i]) === JSON.stringify(target))
            return i;
    }
}

function is_cyclic(node, traversed, stack, GRAPH){
    /* RECURSION
    */
    traversed[node] = true;
    if (node in GRAPH)
        stack.push(node);
    else return false;

    for (let i=0; i<GRAPH[node].length; i++){
        let neighbor = GRAPH[node][i];
        if (traversed[neighbor] === false){
            if (is_cyclic(neighbor, traversed, stack, GRAPH) === true)
                return true;
        }
        else if (stack.includes(neighbor))
            return true;
    }
    stack.pop();
    return false;
}

function run_dfs(favorList){
    /*
    DFS of favor trees to reveal parties

    input:
        favorList (array): 2d array of favor transactions for a single reward
    output:
        output (array): 2d array of parties for this reward
    */
    // favorList = [  //test data
    //     ['0','1'], 
    //     ['1','2'], 
    //     ['2','0'], 

    //     ['0','1'], 
    //     ['1','4'],
    //     ['4','2'], 
    //     ['2','0'],

    //     ['eh','wut'],
    // ];

    let parties = [];
    let searchPartyAgain = true;
    let stack, traversed, GRAPH;
    
    while (searchPartyAgain){
        searchPartyAgain = false;
        stack = [];

        traversed = {};
        for (var i = 0; i < favorList.length; i++){
            traversed[favorList[i][0]] = false;
            traversed[favorList[i][1]] = false;
        }

        GRAPH = {};
        for (var i = 0; i < favorList.length; i++){
            if (!(favorList[i][0] in GRAPH)){
                GRAPH[favorList[i][0]] = [];
            }
            GRAPH[favorList[i][0]].push(favorList[i][1]);
        }

        for (let node in GRAPH){
            if (traversed[node] === false){
                if (is_cyclic(node, traversed, stack, GRAPH) === true){
                    searchPartyAgain = true;
                    parties.push(stack);

                    let index;
                    for (let i=0; i<stack.length; i++){
                        if (i === stack.length-1)
                            index = get_array_index(favorList, [stack[i], stack[0]]);
                        else
                            index = get_array_index(favorList, [stack[i], stack[i+1]]);
                        favorList.splice(index, 1);
                    }
                    break;
                }
            }
        }
    }
    return parties
}

async function party_detector(){
    /*
    preps for DFS of favor trees to reveal parties for each reward type

    input:

    output:
        partyByReward (JSON): object made up of 2d array parties
    */
    let favorList = await fpFavor.findAll({
        attributes: ['rewardID'],
        where: {
            // [Op.and]: [{
            //     [Op.or]: [
            //         {payerID: userID},
            //         {payeeID: userID},
            //         ]
            //     }, {
                    status: 'Pending',
                // }]
        },
        include: [
            {
                model: fpUser,
                as: 'payee_id',
                attributes: [['email', 'payeeEmail']],
            },{
                model: fpUser,
                as: 'payer_id',
                attributes: [['email', 'payerEmail']],
            },
        ]
    });
    
    favorList = JSON.parse(JSON.stringify(favorList));
    let favorsByReward = {};

    for (var i = 0; i < favorList.length; i++){
        let favor = favorList[i];
        if (!(favor['rewardID'] in favorsByReward)){
            favorsByReward[favor['rewardID']] = [];
        }
        favorsByReward[favor['rewardID']].push([favor['payee_id']['payeeEmail'], favor['payer_id']['payerEmail']]);
    }
    
    let partyByReward = {};
    for (var rewardID in favorsByReward){
        partyByReward[rewardID] = run_dfs(favorsByReward[rewardID]);
    }
    return partyByReward;
}

module.exports = function(app){

    app.get('/party', async function(req, res){
        /*
        Detects a user's potential parties

        request headers:
            loginToken (string)
            email (string)
        response headers:
            success (bool)
            message (string)
        response body:
            success (bool)
            message (string)
            output (json)
        */
       let [successFlag, [email, loginToken]] = helperModule.get_req_headers(req, ['email', 'loginToken'], res);
       if (!successFlag)
           return;

       let [validationSuccess, user] = await helperModule.validate_user_loginToken(email, loginToken, res);
       if (!validationSuccess)
           return;

        let output = await party_detector();
        let outputForUser = {};

        for (let rewardID in output){
            outputForUser[rewardID] = [];
            for (let i=0; i<output[rewardID].length; i++){
                if (output[rewardID][i].includes(email)){
                    outputForUser[rewardID].push(output[rewardID][i]);
                }
            }
            if (outputForUser[rewardID].length === 0)
                delete outputForUser[rewardID];
        }

        helperModule.manipulate_response_and_send(res, {
            'success': true, 
            'message': 'party data sent', 
            'output': outputForUser,
            }, 200);
        return;
    })
    
}