//Helper functions to be used in multiple modules

const helpers = {
    // to help populate /favors on no favors
    emptyRewardsDict: {1:0 ,2:0, 3:0, 4:0, 5:0},
   
    // return ID corresponding to Reward Name
    rewardID : (name) => {  
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
    
    // return Title corresponding to Reward ID
    rewardTitle : (id) => {  
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
                name = "snack";
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

    // Convert ISO date string to human readable format
    readableDate : (s) => {
                // ISO date pattern regex 
               let datePattern = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/;
               let flag = datePattern.test(s);
               // Convert only if in ISO pattern
               if(flag){
               let b = s.split(/\D+/);
               let newDate = new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));    
               return newDate.toString(); 
               }
               else return s;
    },

    // Check if json is empty
    isEmpty : (obj) => {
        for (var key in obj) {
            if (obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }
}

export default helpers;