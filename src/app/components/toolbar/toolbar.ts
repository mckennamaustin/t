import Component from '../../reactor/component';
import FloorSwitch from './FloorSwitch';
import Tool from './Tool';
import { MOUSE_CURSOR, LINK, ERASER, TUNE } from '../../constants/base64';
import {
  MOUSE_TOOL,
  LINK_TOOL,
  ERASER_TOOL,
  TUNE_TOOL
} from '../../constants/tools';
import reactor from '../../reactor';

export default class Toolbar extends Component {
  private _floorSwitch: FloorSwitch;
  private _mouseTool: Tool;
  private _linkTool: Tool;
  private _eraserTool: Tool;
  private _tuneTool: Tool;

  constructor(root: HTMLDivElement) {
    super(root, 'ev-toolbar');

    this._floorSwitch = new FloorSwitch(this._parent);
    this._mouseTool = new Tool(this._parent, MOUSE_TOOL, MOUSE_CURSOR);
    this._linkTool = new Tool(this._parent, LINK_TOOL, LINK);
    this._eraserTool = new Tool(this._parent, ERASER_TOOL, ERASER);
    this._tuneTool = new Tool(this._parent, TUNE_TOOL, TUNE);
    this._mouseTool.select();

    reactor.setToolbar(this);
  }

  public react = (stimulus: any): void => {
    const { selected } = stimulus;

    this._mouseTool.deselect();
    this._linkTool.deselect();
    this._eraserTool.deselect();
    this._tuneTool.deselect();

    switch (selected) {
      case MOUSE_TOOL: {
        this._mouseTool.select();
        break;
      }
      case LINK_TOOL: {
        this._linkTool.select();
        break;
      }
      case ERASER_TOOL: {
        this._eraserTool.select();
        break;
      }
      case TUNE_TOOL: {
        this._tuneTool.select();
        break;
      }
    }
  };
}
