import Header from '../template-parts/Header';

const help = () => {

    return (
        <>
            <Header />
            <div className="container">
                <h2 className="forward-page-header">Forward Pay Users Guide</h2>
                <hr />
                <ol className="list-group">
                    <li className="list-group-item">
                        <h5>Please register and sign in to experience this "I Owe you" application and all its features.</h5>
                        <p>As an annonymous user, you have access to only the home page, where you can view and search public tasks.</p>
                    </li>
                    <li className="list-group-item">
                        <h5>Once you sign in, you can access your custom Favors and Tasks dashboards. Party and Leaderboard views are also unlocked.</h5>

                        <p>If Alice and Bobby go for coffee together, either of them can create a favor to record the transaction. Each Favor is assigned a reward.</p>
                        <h6>Currently supported rewards are:</h6>
                        <table><tr>
                            <td>Coffee</td><td></td><td></td><td></td><td></td><td></td><td></td>
                            <td>Meal</td><td></td><td></td><td></td><td></td><td></td><td></td>
                            <td>Snacks</td><td></td><td></td><td></td><td></td><td></td><td></td>
                            <td>Candy</td><td></td><td></td><td></td><td></td><td></td><td></td>
                            <td>Drink</td><td></td><td></td><td></td><td></td><td></td><td></td>
                        </tr></table>
                        <h6>However, to prevent cheating, a photo must be uploaded as proof when performing an action that would disadvantage another user. For example:</h6>

                        <ul>
                            <li>Bobby can add the favor that Bobby owes Alice, without any proof</li>
                            <li>Alice can add the favor Bobby owes Alice, only if she uploads a photo as proof</li>
                            <li>Bobby can delete the favor that Bobby owes Alice, only if he uploads a photo upload as proof</li>
                            <li>Alice can delete the favor that Bobby owes Alice, without any proof</li>
                        </ul>
                    </li>
                    <li className="list-group-item">
                        <h5>In addition to recording favors, this system allows users to post public tasks with an offer to provide reward(s) on completion.</h5>
                        <h6>For example:</h6>
                        <ul>
                            <li>Suppose that Carol would like somebody to clean the office fridge, she might post a task: "Clean the fridge" with a reward of a coffee and a chocolate.</li>
                            <li>When Greg sees the task, he might also decide that he wants to see the fridge get cleaned so Greg decides to increase the reward by adding another chocolate.</li>
                            <li>Finally, suppose that Peter logs in and decides that he is happy to clean the fridge to earn himself a coffee and two chocolates. </li>
                            <li>When he finishes the cleaning, he uploads an image as "proof" and then all the rewards on the task will turn into favors owed to Peter: Carol will owe Peter a coffee and a chocolate, and Greg will owe Peter a chocolate.</li>
                        </ul>
                    </li>
                    <li className="list-group-item">
                        <h5>The Leaderboard page shows the top users by most Active Incoming Favors.</h5>
                    </li>
                    <li className="list-group-item">
                        <h5>When you visit the party page, we will detect any and all reward loops avaiable that you can particiapte in.</h5>
                        <table>
                            <tr><h6>For example:</h6></tr>
                            <tr>Alice owes Bobby a coffee, Bobby owes Carol a coffee, Carol owes Greg a coffee and Greg owes Alice a coffee.</tr>
                            <tr>If you are one of these people, a party will appear in your party page.</tr>
                        </table>
                    </li>
                </ol>









            </div>
        </>
    );
};
export default help;