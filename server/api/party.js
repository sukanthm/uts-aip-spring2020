import fpFavor from '../persistence/objects/fpFavor';
import fpUser from '../persistence/objects/fpUser';
const helperModule = require('./helper.js');
const backendModule = require('../backend.js');

function get_array_index(array, target){
    //arrays cant be hashed, thus typical 1D array search wont work on a 2D array
    for(let i=0; i<array.length; i++){
        if(JSON.stringify(array[i]) === JSON.stringify(target))
            return i;
    }
}

function is_cyclic(node, traversed, stack, GRAPH){
    /* 
    RECURSION for a given set of nodes and relationships, we do a depth first search to get the first loop
    
    DFS implementation:
    (0) start
    (1) pick next LOOP_START node and set as traversed (lowest userID on first iteration, dict sorts keys ASC)
    (2) go to LOOP_START's next NEIGHBOR node and set as traversed
    (3) does NEIGHBOR have any outgoing relationships? 
        (3.1) {NO}: break and go to step 2
        (3.2) {YES}: add NEIGHBOR to stack
    (4) for every NEIGHBOR's neighbor:
        (4.1) has this NEIGHBOR's neighbor already been traversed?
            (4.1.1) {NO}: go to step 1 (recursion depth += 1 and LOOP_START = NEIGHBOR)
            (4.1.2) {YES}: is this node in the stack?
                (4.1.2.1) {YES}: loop found, loop path present in stack
    (5) remove NEIGHBOR from stack
    (6) stop. no loop exist at this stage
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
    after a loop is found, we re-initialize the graph (remove the latest loop), and reset other variables

    input:
        favorList (array): 2d array of favor transactions for a single reward
    output:
        output (array): 2d array of parties for this reward
    */
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
        //{ID1: [ID2, ID4], ID4: [ID3], ...}
        //keys are payee_id, values are arrays of payer_id(s)
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
                        //removing the loop's transactions to recreate the GRAPH
                        if (i === stack.length-1)
                            index = get_array_index(favorList, [stack[i], stack[0]]);
                        else
                            index = get_array_index(favorList, [stack[i], stack[i+1]]);
                        favorList.splice(index, 1);
                    }
                    //break to recreate GRAPH and reset other vars 
                    //  before searching for other loops
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
            status: 'Pending',
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
    
    //deep copy & remove ORM headers
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

    app.get('/api/party', backendModule.multerUpload.none(), async function(req, res){
        /*
        Detects a user's potential parties

        request cookie:
            aip_fp
        response headers:
            success (bool)
            message (string)
        response body:
            success (bool)
            message (string)
            output (json)
        */

        let [validationSuccess, user] = await helperModule.validate_user_loginToken(req, res);
        if (!validationSuccess)
            return;

        let output = await party_detector();
        let outputForUser = {};

        //send user only parties that they is present in
        for (let rewardID in output){
            outputForUser[rewardID] = [];
            for (let i=0; i<output[rewardID].length; i++){
                if (output[rewardID][i].includes(user.email)){
                    outputForUser[rewardID].push(output[rewardID][i]);
                }
            }
            if (outputForUser[rewardID].length === 0)
                delete outputForUser[rewardID];
        }

        helperModule.manipulate_response_and_send(req, res, {
            'success': true, 
            'message': 'party data sent', 
            'output': outputForUser,
            }, 200);
        return;
    })
    
}