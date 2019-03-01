import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';

import DesignStudio from './components';

class App extends Component {
  render() {
    return [<GlobalStyle key={0} />, <DesignStudio />];
  }
}

const GlobalStyle = createGlobalStyle`
@import url('https://fonts.googleapis.com/css?family=Cinzel|Poiret+One|Varela+Round');
* {
  font-family: 'Varela Round', sans-serif;

}
html, body {
  margin: 0;
  padding: 0;
  background: #f7f8fc;
  background-size: cover;

}
`;

export default withRouter(App);
