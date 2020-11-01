
import { Fab, Action } from 'react-tiny-fab';
import 'react-tiny-fab/dist/styles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTasks, faHandHoldingHeart } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';

const FABComponent = (props) => {

    console.log("ghusede", props.type);

    const Router = useRouter();
    const secondaryStyle = {
        color: "#fff",
        backgroundColor: "#764ABC",
        borderColor: "#764ABC"
    }
    const mainStyle = {
        color: "#fff",
        backgroundColor: "#3c0694",
        borderColor: "#3c0694"
    }

    const actionBtns = () => {
        console.log("ghuse", props.type);
        if(props.type == "All"){
            console.log("Jee");
            return (
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
                        <Action
                            text="Add Favor"
                            onClick={()=>{Router.push("/favor/new")}}
                        >
                            <FontAwesomeIcon icon={faHandHoldingHeart} />
                        </Action>
                    </Fab>
                    )
        }
        else if(props.type == "Task"){
            console.log("Haan");
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
        else if(props.type == "Favor"){
            console.log("Kyaa");
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
                            <FontAwesomeIcon icon={faHandHoldingHeart} />
                        </Action>
                    </Fab>
            )
        }
    }

    return (
        <div>
            {actionBtns()}
        </div>
        
    )
}

export default FABComponent;