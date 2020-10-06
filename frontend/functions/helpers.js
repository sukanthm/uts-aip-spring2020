
const helpers = {
    //Helper functions to be used in multiple modules
    rewardID : (name) => {  // return ID corresponding to Reward Name
        let id = null;
        name = name.toLowerCase();
        switch(name) {
            case "coffee" : {
                id = 1;
                break;
            }
            case "meal" : {
                id = 2;
                break;
            }
            case "snacks" : {
                id = 3;
                break;
            }
            case "candy" : {
                id = 4;
                break;
            }
            case "drink" : {
                id = 5;
                break;
            }
        }

        return id;
    }
    
}

export default helpers;