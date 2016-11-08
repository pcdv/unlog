import React, { Component } from 'react';
import './App.css';
import FileSelection from './containers/FileSelection'
import LogView from './containers/LogView'
import Filters from './containers/Filters'
import ReplaceRules from './containers/ReplaceRules'
import { initFilters } from './actions/filterActions'
import { connect } from 'react-redux'
import Title from 'react-document-title'

class App extends Component {
  componentDidMount() {
    this.props.dispatch(initFilters())
  }

  render() {
    const {fileName} = this.props
    let title = "UnLog"
    if (fileName)
      title += ` :: ${fileName}`
    return (
      <Title title={title}>
        <div>
          <FileSelection />
          <Filters />
          <ReplaceRules />
          <LogView />
        </div>
      </Title>
    );
  }
}

const mapStateToProps = state => ({ fileName: state.fileSelection.name })

export default connect(mapStateToProps)(App)
