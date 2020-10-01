import Header from '../template-parts/Header';
import UserCard from '../elements/UserCard';
import RewardsContainer from '../elements/RewardsContainer';

export default class Favors extends React.Component {
    constructor(props) {    
        super(props);    
        this.state = {      
            activeTab: 'Owed',
            activeItem: null    
        };  
    }
    getCurrentUser(){
        return {
            id: 99,
            name: 'User Self'
        };
    }
    getFavorsOwed(){
        return [
            {
                user:{
                    id: 1,
                    name: 'Pseudonym 1'
                },
                rewardsData:{
                    candy:1,
                    cheers: 2
                }
            },
            {
                user:{
                    id: 3,
                    name: 'Pseudonym 3'
                },
                rewardsData:{
                    coffee:1,
                    drink: 1
                }
            },
            {
                user:{
                    id: 5,
                    name: 'Pseudonym 5'
                },
                rewardsData:{
                    meal:4,
                    snacks: 1
                }
            }
        ]
    }
    getFavorsOwing(){
        return [
            {
                user:{
                    id: 2,
                    name: 'Pseudonym 2'
                },
                rewardsData:{
                    coffee:1,
                    cheers: 2
                }
            },
            {
                user:{
                    id: 4,
                    name: 'Pseudonym 4'
                },
                rewardsData:{
                    coffee:1,
                    candy: 1
                }
            },
            {
                user:{
                    id: 5,
                    name: 'Pseudonym 5'
                },
                rewardsData:{
                    meal:4,
                    snacks: 1
                }
            }
        ]  
    }
    getFavorList(){
        let favorList = [];
        switch(this.state.activeTab){
            case 'Owed':
                favorList = this.getFavorsOwed();
                break;
            case 'Owing':
                favorList = this.getFavorsOwing();
                break;
        }
        return(
            <div className="favors-list">
                {favorList.map((favorItem) => {
                    return (
                    <UserCard user={favorItem.user} useBorder={true}>
                        <RewardsContainer rewardsData={favorItem.rewardsData} />
                        <a href="javascript:void(0);" className="stretched-link" onClick={() => this.setState({      
                            activeItem: favorItem    
                        })}></a>
                    </UserCard>
                    );
                })}
            </div>
        );
    }
    render(){
        return(
            <>
                <Header />
                <div className="favors">
                    <div className="tabbed-nav">
                        <a href="javascript:void(0);" className={'nav-elements'+((this.state.activeTab == 'Owed')?' nav-selected':'')} onClick={() => this.setState({      
            activeTab: 'Owed'    
        })}>
                            <div className="tab-title">Owed</div>
                        </a>
                        <a href="javascript:void(0);" className={'nav-elements'+((this.state.activeTab == 'Owing')?' nav-selected':'')} onClick={() => this.setState({      
            activeTab: 'Owing'    
        })}>
                            <div className="tab-title">Owing</div>
                        </a>
                    </div>
                    { this.getFavorList() }
                    
                </div>
          </>
        )
    }
}