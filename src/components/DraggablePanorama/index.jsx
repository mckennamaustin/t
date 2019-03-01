import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled, { css } from 'styled-components';

import * as sc from '../../styles';
import Mouse from '../../services/globalMouse';
import {
  END_PANORAMA_DRAG,
  BEGIN_PANORAMA_DRAG
} from '../../constants/actionTypes';

class DraggablePanorama extends Component {
  state = {
    mousePosition: [0, 0],
    isDragging: true
  };

  componentDidMount = () => {};

  startDrag = evt => {
    this.props.beginDrag();
  };

  handleMove = evt => {
    const { clientX, clientY } = evt;

    this.setState({ mousePosition: [clientX, clientY] });
  };

  render() {
    return (
      <Wrapper
        ref={self => {
          this.self = self;
        }}
        onMouseDown={this.startDrag}
        isDragging={this.props.isDragging}
        top={this.props.top}>
        <sc.Span>{this.props.name}</sc.Span>
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  position: absolute;
  transition: top 500ms ease-in-out;
  background-color: gainsboro;
  height: 75px;
  min-height: 75px;
  width: 275px;
  border-radius: 8px;
  box-sizing: border-box;
  padding: 10px 10px;
  cursor: grab;
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.75);

  span {
    user-select: none;
  }

  ${props =>
    !props.isDragging &&
    css`
      top: ${props.top}px;
    `};
  ${props =>
    props.isDragging &&
    css`
      z-index: 100000;

      position: fixed;
      margin-bottom: 0px;
      transition: all 25ms ease-in-out;
    `}
`;

function mapStateToProps(state, ownProps) {
  return {
    isDragging: state.drag.draggedId === ownProps.identifier
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    beginDrag: () => {
      dispatch({
        type: BEGIN_PANORAMA_DRAG,
        payload: { id: ownProps.identifier }
      });
    },
    endDrag: () => {
      dispatch({
        type: END_PANORAMA_DRAG,
        payload: { id: ownProps.identifier }
      });
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DraggablePanorama);
