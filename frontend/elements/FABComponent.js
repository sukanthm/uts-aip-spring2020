
import { Fab, Action } from 'react-tiny-fab';
import 'react-tiny-fab/dist/styles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTasks, faHeart } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';

const FABComponent = (props) => {

    const Router = useRouter();
    // Style for FAB 
    const mainStyle = {
        color: "#fff",
        backgroundColor: "#3c0694",
        borderColor: "#3c0694"
    }

    // Dynamic floating buttons based on page they are rendered on
    // Action button used from library : https://github.com/dericgw/react-tiny-fab
    const actionBtns = () => {
        // Homepage
        if(props.type == "All"){ 
            return (
                    <Fab
                    mainButtonStyles={mainStyle}
                    icon={<FontAwesomeIcon icon={faPlus} />}
                    alwaysShowTitle={true}
                    >
                        <Action
                        text="Add Task"
                        onClick={()=>{Router.push("/task/new")}}
                        >
                            <FontAwesomeIcon icon={faTasks} />
                        </Action>
                        <Action
                            text="Add Favor"
                            onClick={()=>{Router.push("/favor/new")}}
                        >
                            <FontAwesomeIcon icon={faHeart} />
                        </Action>
                    </Fab>
                    )
        }
        // Task Page
        else if(props.type == "Task"){
            return(
                    <Fab
                    mainButtonStyles={mainStyle}
                    icon={<FontAwesomeIcon icon={faPlus} />}
                    alwaysShowTitle={true}
                    onClick={()=>console.log("yeeeehaaa")}
                    >
                        <Action
                        text="Add Task"
                        onClick={()=>{Router.push("/task/new")}}
                        >
                            <FontAwesomeIcon icon={faTasks} />
                        </Action>
                    </Fab>
                )
        }
        // Favor Page
        else if(props.type == "Favor"){
            return(
                    <Fab
                    mainButtonStyles={mainStyle}
                    icon={<FontAwesomeIcon icon={faPlus} />}
                    alwaysShowTitle={true}
                    onClick={()=>console.log("yeeeehaaa")}
                    >
                        <Action
                            text="Add Favor"
                            onClick={()=>{Router.push("/favor/new")}}
                        >
                            <FontAwesomeIcon icon={faHeart} />
                        </Action>
                    </Fab>
            )
        }
    }

    return (
        <div>
            {
                // precreated action button based on condition
                actionBtns()
            }
        </div>
        
    )
}

export default FABComponent;