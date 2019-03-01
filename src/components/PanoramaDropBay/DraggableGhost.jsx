import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled, { css } from 'styled-components';

import * as sc from '../../styles';

class DraggableGhost extends Component {
  render() {
    return <Wrapper top={this.props.top} />;
  }
}

const Wrapper = styled.div`
  top: 1000px;
  position: absolute;
  transition: top 500ms ease-in-out;
  background-color: rgba(0, 0, 0, 0.75);
  border: 2px outset black;
  height: 75px;
  min-height: 75px;
  width: 275px;
  border-radius: 8px;
  box-sizing: border-box;
  padding: 10px 10px;
  cursor: none;
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.75);

  ${props =>
    css`
      top: ${props.top}px;
    `};
`;

function mapStateToProps(state, ownProps) {
  return {};
}

function mapDispatchToProps(dispatch, ownProps) {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DraggableGhost);
