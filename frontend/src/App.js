import React from 'react';
import logo from './logo.svg';
import './App.css';
import Signup from './Signup';
import 'bootstrap/dist/css/bootstrap.min.css';


class App extends React.Component {
  constructor(props){
    super(props);
  }
    // this.state = {
    //   count: 0
    // }
    // this.getInit();
  // }

  // componentDidMount = () => {
  //   this.getInit();
  // }

  //  getInit = async () => {
  //   let result = await fetch("/api/count");
  //   let json = await result.json();
  //   this.setState({count: json.count});
  //   // this.setState({count: this.state.count + 1})
  // }

  // increment = async() => {
  //   let result = await fetch("/api/inc", {method: "POST", body:{"count": this.state.count}});
  //   let json = await result.json();
  //   this.setState({count: json.count});
  // }
  
  render(){
  return (
    <Signup></Signup>
  );
  }
}

export default App;
