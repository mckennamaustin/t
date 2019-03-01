import Panorama from '../components/panorama';
import FloorplanViewer from '../components/floorplan-viewer';
import TourPreview from '../components/tour-preview';
import DropBay from '../components/drop-bay';
import DesignStudio from '..';
declare class Reactor {
    private _panoramas;
    private _floorplanViewer;
    private _tourPreview;
    private _dropBay;
    private _root;
    private _dragged;
    constructor();
    initialize: (root: DesignStudio) => void;
    startDrag: (dragged: Panorama) => void;
    private handleMouseMove;
    isDragging: () => boolean;
    addPanoramas: (...panoramas: Panorama[]) => void;
    setDropBay: (dropBay: DropBay) => void;
    setTourPreview: (tourPreview: TourPreview) => void;
    setFloorplanviewer: (floorplanViewer: FloorplanViewer) => void;
}
declare const _default: Reactor;
export default _default;
