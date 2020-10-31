

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
               // console.log("drool", s);

               let datePattern = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/;
               let flag = datePattern.test(s);
               // console.log(flag);
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
    },

    // Check cookie
    checkCookie : () => {
            const cookie = decodeURIComponent(document.cookie).substring(7);
            if(cookie.trim() == ""){
                return 0;
            }
            else{
                return 1;
            }
    }
}

export default helpers;