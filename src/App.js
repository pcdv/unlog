import React, { Component } from 'react';
import './App.css';
import Result from './containers/Result'
import Filters from './containers/Filters'
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
          <Filters />
          <Result />
        </div>
      </Title>
    );
  }
}

const mapStateToProps = state => ({ fileName: state.fileSelection.name })

export default connect(mapStateToProps)(App)
