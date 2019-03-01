import React, { Component } from 'react';
import styled, { css } from 'styled-components';
import { connect } from 'react-redux';

import {
  ZOOM_SPEED,
  MIN_ZOOM,
  MAX_ZOOM,
  PAN_SPEED,
  DAMPING_FACTOR,
  WHEEL_MULTIPLIER,
  PANORAMA_SPRITE_RADIUS
} from '../../constants/studioVariables';
import clamp from '../../utils/clamp';
import globalMouse from '../../services/globalMouse';
import {
  DRAG_ENTER_FLOORPLAN,
  DRAG_LEAVE_FLOORPLAN,
  UPDATE_PANORAMA_POSITION,
  MOUSE_ENTER_FLOORPLAN,
  MOUSE_LEAVE_FLOORPLAN,
  BEGIN_PANORAMA_DRAG,
  END_PANORAMA_DRAG
} from '../../constants/actionTypes';

/*
Props:
width
height
floorplanSrc

*/

class FloorplanViewer extends Component {
  state = {
    isLoading: true,
    mousePosition: [0, 0],
    panStart: [0, 0],
    panOffset: [0, 0],
    panDelta: [0, 0],
    zoomDelta: 0,
    zoom: 1,
    center: [0, 0],
    isDragging: false,
    viewboxDimensions: { w: 0, h: 0 }
  };

  componentDidMount = () => {
    this.animate();
    this.fetchSettings();

    globalMouse.addIntersectionListener(
      'floorplan-viewer',
      this.canvas,
      () => {
        this.props.mouseEnter(this.props.isDragging, this.props.draggedId);
      },
      () => {
        this.props.mouseLeave(this.props.isDragging, this.props.draggedId);
      }
    );
  };

  fetchSettings = () => {
    const image = new Image();
    image.onload = () => {
      const { naturalWidth, naturalHeight } = image;
      const basis = Math.min(naturalWidth, naturalHeight);
      const aspectRatio = basis / this.props.size;

      const viewboxDimensions = {
        w: naturalWidth / aspectRatio,
        h: naturalHeight / aspectRatio
      };

      const center = [this.props.size / 2, this.props.size / 2];

      this.setState({ isLoading: false, viewboxDimensions, center });
    };
    image.src = this.props.floorplanSrc;
  };

  handleWheel = evt => {
    let delta = -evt.deltaY * WHEEL_MULTIPLIER;

    this.setState({ zoomDelta: this.state.zoomDelta + delta * ZOOM_SPEED });
  };

  transformRelativeToFloorplan = relative => {
    const svgImage = document.getElementById('sage-fp-image');
    let ox = 0;
    let oy = 0;
    if (svgImage) {
      const rect = svgImage.getBoundingClientRect();
      oy = rect.top;
      ox = rect.left;
    }

    const [rx, ry] = relative;

    return [rx - ox / this.state.zoom, ry - oy / this.state.zoom];
  };

  handleMove = evt => {
    const { clientX, clientY } = evt;
    const rx = clientX / this.state.zoom;
    const ry = clientY / this.state.zoom;

    if (this.state.isDragging) {
      const pdx = rx - this.state.panStart[0];
      const pdy = ry - this.state.panStart[1];

      this.setState({
        panDelta: [
          (pdx * PAN_SPEED) / this.state.zoom,
          (pdy * PAN_SPEED) / this.state.zoom
        ],
        panStart: [rx, ry]
      });
    }

    if (this.props.isDraggingOverFloorplan) {
      const [fpx, fpy] = this.transformRelativeToFloorplan([rx, ry]);
      this.props.updatePanoramaPosition(this.props.draggedId, [fpx, fpy]);
    }

    this.setState({ mousePosition: [rx, ry] });
  };

  animate = () => {
    const boundX = this.state.viewboxDimensions.w / 2;
    const boundY = this.state.viewboxDimensions.h / 2;
    const [cx, cy] = this.state.center;

    const pox = clamp(this.state.panOffset[0], -boundX, boundX);
    const poy = clamp(this.state.panOffset[1], -boundY, boundY);
    const tx = cx + pox;
    const ty = cy + poy;

    this.setState({
      zoom: clamp(this.state.zoom + this.state.zoomDelta, MIN_ZOOM, MAX_ZOOM),
      zoomDelta: this.state.zoomDelta * DAMPING_FACTOR,
      transform: `translate(${tx}, ${ty}) scale(${
        this.state.zoom
      }) translate(${-tx}, ${-ty}) translate(${cx - tx}, ${cy - ty})`,
      panOffset: [pox - this.state.panDelta[0], poy - this.state.panDelta[1]],
      panDelta: [0, 0]
    });

    requestAnimationFrame(this.animate);
  };

  startDrag = evt => {
    evt.preventDefault();

    const [mx, my] = this.state.mousePosition;
    this.setState({ isDragging: true, panStart: [mx, my] });
  };

  cancelDrag = () => {
    this.setState({ isDragging: false });
  };

  render() {
    return (
      <Wrapper>
        <Container
          size={this.props.size}
          draggable="false"
          ref={canvas => {
            this.canvas = canvas;
          }}>
          {!this.state.isLoading && (
            <svg
              draggable="false"
              onMouseMove={this.handleMove}
              onWheel={this.handleWheel}
              onMouseDown={this.startDrag}
              onMouseUp={this.cancelDrag}
              onMouseOut={this.cancelDrag}
              onMouseLeave={this.cancelDrag}
              x="0"
              y="0"
              width={this.props.size}
              height={this.props.size}
              viewBox={`0 0 ${this.state.viewboxDimensions.w} ${
                this.state.viewboxDimensions.h
              }`}
              preserveAspectRatio="xMidYMid slice">
              <g transform={this.state.transform}>
                <image
                  draggable="false"
                  id="sage-fp-image"
                  xlinkHref={this.props.floorplanSrc}
                  width={`${this.state.viewboxDimensions.w}px`}
                  height={`${this.state.viewboxDimensions.h}px`}
                />
                {this.props.capturedPanoramas.map(capturedId => {
                  const [cx, cy] = this.props.panoramas[
                    capturedId
                  ].floorplanLocation;

                  const r = PANORAMA_SPRITE_RADIUS / this.state.zoom;

                  return (
                    <PanoramaSprite
                      cx={cx}
                      cy={cy}
                      r={r}
                      onMouseDown={evt => {
                        evt.preventDefault();
                        evt.stopPropagation();
                        this.props.beginDrag(capturedId);
                      }}
                      onMouseUp={evt => {
                        evt.preventDefault();
                        evt.stopPropagation();
                        this.props.endDrag(capturedId);
                      }}
                    />
                  );
                })}
              </g>
            </svg>
          )}
        </Container>
      </Wrapper>
    );
  }
}

//220 151

const Wrapper = styled.div`
  grid-row: 1/2;
  grid-column: 1/2;
`;

const PanoramaSprite = styled.circle.attrs({ fill: '#11ef12' })``;

const Container = styled.div`
  ${props => css`
    width: ${props.size}px;
    height: ${props.size}px;
    max-width: ${props.size}px;
    max-height: ${props.size}px;
  `}
  user-select: none;
  background-color: white;
  -webkit-user-drag: none;
  -khtml-user-drag: none;
  -moz-user-drag: none;
  -o-user-drag: none;
  * {
    user-select: none;
    -moz-user-select: none;
    -webkit-user-drag: none;
    -khtml-user-drag: none;
    -moz-user-drag: none;
    -o-user-drag: none;
  }
`;

function mapStateToProps(state) {
  return {
    isDragging: state.drag.isDragging,
    isDraggingOverFloorplan:
      state.drag.isDragging && state.drag.isMouseOverFloorplan,
    draggedId: state.drag.draggedId,
    panoramas: state.panoramas.byId,
    capturedPanoramas: state.floorplan.capturedPanoramas
  };
}

function mapDispatchToProps(dispatch) {
  return {
    beginDrag: id => {
      dispatch({
        type: BEGIN_PANORAMA_DRAG,
        payload: { id }
      });
    },
    endDrag: id => {
      dispatch({
        type: END_PANORAMA_DRAG,
        payload: { id }
      });
    },
    mouseEnter: (isDragging, draggedId) => {
      dispatch({
        type: MOUSE_ENTER_FLOORPLAN,
        payload: { isDragging, draggedId }
      });
    },
    mouseLeave: (isDragging, draggedId) => {
      dispatch({
        type: MOUSE_LEAVE_FLOORPLAN,
        payload: { isDragging, draggedId }
      });
    },
    updatePanoramaPosition: (id, position) => {
      dispatch({
        type: UPDATE_PANORAMA_POSITION,
        payload: {
          id,
          position
        }
      });
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FloorplanViewer);
