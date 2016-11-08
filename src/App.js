import React, { Component } from 'react';
import './App.css';
import FileSelection from './containers/FileSelection'
import LogView from './containers/LogView'
import Filters from './containers/Filters'
import ReplaceRules from './containers/ReplaceRules'
import {initFilters} from './actions/filterActions'
import {connect} from 'react-redux'

class App extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(initFilters())
  }

  render() {
    return (
      <div>
        <FileSelection />
        <Filters />
        <ReplaceRules />
        <LogView />
      </div>
    );
  }
}

export default connect()(App)
