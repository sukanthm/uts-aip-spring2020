import Header from '../template-parts/Header';

const help = () => {

    return(
        <>
            <Header/>
            <div className="container">
                <div className="party-container">
                    <h2>Please register and sign in to experience this "I Owe you" application and all its features.</h2>
                </div>

                <div className="party-container">
                    <h4>As an annonymous user, you have access to only the home page, where you can view and search public tasks.</h4>
                </div>

                <div className="party-container">
                    <h3>Once you sign in, you can access your custom Favors and Tasks dashboards. Party and Leaderboard views are also unlocked.</h3>
                </div>

                <div className="party-container">
                    <h4>If Alice and Bobby go for coffee together, either of them can create a favor to record the transaction. Each Favor is assigned a reward.</h4>
                    <div className="party-container">
                        <h5>Currently supported rewards are:</h5>
                        <table><tr>
                                <td>Coffee</td><td></td><td></td><td></td><td></td><td></td><td></td>
                                <td>Meal</td><td></td><td></td><td></td><td></td><td></td><td></td>
                                <td>Snacks</td><td></td><td></td><td></td><td></td><td></td><td></td>
                                <td>Candy</td><td></td><td></td><td></td><td></td><td></td><td></td>
                                <td>Drink</td><td></td><td></td><td></td><td></td><td></td><td></td>
                        </tr></table>
                    </div>
                    <div className="party-container">
                        <h5>However, to prevent cheating, a photo must be uploaded as proof when performing an action that would disadvantage another user. For example:</h5>
                        <table>
                            <div className="party-container"><tr>Bobby can add the favor that Bobby owes Alice, without any proof</tr></div>
                            <div className="party-container"><tr>Alice can add the favor Bobby owes Alice, only if she uploads a photo as proof</tr></div>
                            <div className="party-container"><tr>Bobby can delete the favor that Bobby owes Alice, only if he uploads a photo upload as proof</tr></div>
                            <div className="party-container"><tr>Alice can delete the favor that Bobby owes Alice, without any proof</tr></div>
                        </table>
                    </div>
                </div>
                
                <div className="party-container">
                    <h4>In addition to recording favors, this system allows users to post public tasks with an offer to provide reward(s) on completion.</h4>
                    <div className="party-container">
                        <h5>For example:</h5>
                        <table>
                            <tr>Suppose that Carol would like somebody to clean the office fridge, she might post a task: "Clean the fridge" with a reward of a coffee and a chocolate.</tr> 
                            <tr><br></br></tr>
                            <tr>When Greg sees the task, he might also decide that he wants to see the fridge get cleaned so Greg decides to increase the reward by adding another chocolate.</tr>
                            <tr><br></br></tr>
                            <tr>Finally, suppose that Peter logs in and decides that he is happy to clean the fridge to earn himself a coffee and two chocolates. </tr>
                            <tr><br></br></tr>
                            <tr>When he finishes the cleaning, he uploads an image as "proof" and then all the rewards on the task will turn into favors owed to Peter: Carol will owe Peter a coffee and a chocolate, and Greg will owe Peter a chocolate.</tr>
                        </table>
                    </div>
                </div>

                <div className="party-container">
                    <h4>The Leaderboard page shows the top users by most Active Incoming Favors.</h4>
                </div>

                <div className="party-container">
                    <h4>When you visit the party page, we will detect any and all reward loops avaiable that you can particiapte in.</h4>
                    <div className="party-container"><table>
                        <tr><h5>For example:</h5></tr>
                        <tr>Alice owes Bobby a coffee, Bobby owes Carol a coffee, Carol owes Greg a coffee and Greg owes Alice a coffee.</tr>
                        <tr>If you are one of these people, a party will appear in your party page.</tr>
                    </table></div>
                </div>

            </div>
        </>
    );
};
export default help;