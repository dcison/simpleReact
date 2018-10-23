export default class {
  constructor(props) {
    this.props = props;
  }

  setState(newState) {
    this._reactInternalInstance.updateComponent(null, newState);
  }
}