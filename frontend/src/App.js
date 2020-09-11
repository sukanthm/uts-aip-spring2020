import React from 'react';
import logo from './logo.svg';
import './App.css';
import Signup from './Signup';
import 'bootstrap/dist/css/bootstrap.min.css';


class App extends React.Component {
  constructor(props){
    super(props);
  }

  render(){
  return (
    <Signup></Signup>
  );
  }
}

export default App;
