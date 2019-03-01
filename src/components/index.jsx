import React, { Component } from 'react';
import styled, { css } from 'styled-components';
import { connect } from 'react-redux';
import FloorplanViewer from './FloorplanViewer';
import TourPreview from './TourPreview';
import PanoramaDropBay from './PanoramaDropBay';
import { UPDATE_MOUSE_POSITION } from '../constants/actionTypes';
import DesignStudioApp from '../app';

class DesignStudio extends Component {
  componentDidMount() {
    this.app = new DesignStudioApp(this.container);
  }

  render() {
    return (
      <Wrapper
        ref={container => {
          this.container = container;
        }}
      />
    );
  }
}

const Wrapper = styled.div`
  width: 1536px;
`;

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DesignStudio);
