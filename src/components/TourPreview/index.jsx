import React, { Component } from 'react';
import styled, { css } from 'styled-components';
import { connect } from 'react-redux';
import SageTour from '../../../packages/sage-tour';

const panoramaGraph = [
  {
    id: 0,
    position: [1427, 188, 525],
    edges: [],
    name: 'Great Room',
    floor: 1
  }
];

const onLoad = () => {};
const opts = {
  imagePathRoot: 'https://s3.amazonaws.com/staging.sageadmin.s3',
  disableControls: true
};

class TourPreview extends Component {
  componentDidMount() {
    const tour = new SageTour(this.container, panoramaGraph, onLoad, opts);
    tour.setEnableControls(true);
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
  grid-row: 1/2;
  grid-column: 3/4;
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
)(TourPreview);
