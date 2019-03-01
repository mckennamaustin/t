import React, { Component } from 'react';
import styled, { css } from 'styled-components';
import { connect } from 'react-redux';
import DraggablePanorama from '../DraggablePanorama';
import DraggableGhost from './DraggableGhost';

class PanoramaDropBay extends Component {
  render() {
    return (
      <Wrapper
        onMouseEnter={this.startMouseOver}
        onMouseLeave={this.stopMouseOver}
        onMouseOut={this.stopMouseOver}>
        {this.props.order.map((id, index) => {
          const top = index * 75 + 10 * (index + 1);
          return (
            <DraggablePanorama
              top={top}
              name={this.props.panoramas[id].name}
              identifier={id}
              key={id}
            />
          );
        })}
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  position: relative;
  grid-row: 1/2;
  grid-column: 2/3;
  background-color: gray;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  box-sizing: border-box;
  padding: 10px 10px;
  overflow: scroll;
  overflow-x: hidden;
`;

function mapStateToProps(state) {
  return {
    panoramas: state.panoramas.byId,
    order: state.dropBay.orderedIds,
    isDragging: state.drag.isDragging
  };
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PanoramaDropBay);
