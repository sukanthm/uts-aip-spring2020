
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
    },

    rewardTitle : (id) => {  // return Title corresponding to Reward ID
        let name = null;
        id = parseInt(id);
        switch(id) {
            case 1 : {
                name = "coffee";
                break;
            }
            case 2 : {
                name = "meal";
                break;
            }
            case 3 : {
                name = "snacks";
                break;
            }
            case 4 : {
                name = "candy";
                break;
            }
            case 5 : {
                name = "drink";
                break;
            }
        }

    return name;
},

readableDate : (s) => {
        let b = s.split(/\D+/);
        let newDate = new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));    
        return newDate.toString(); 
    }
}

export default helpers;