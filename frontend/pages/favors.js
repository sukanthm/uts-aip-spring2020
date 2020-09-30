import Header from '../template-parts/Header';
import IconElement from '../elements/IconElement';


export default class Favors extends React.Component {
    render(){
        return(
            <>
                <Header />
                <IconElement className="ico-testing" title="Testing" count="99" />
          </>
        )
    }
}