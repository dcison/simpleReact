import ReactComponent from './ReactComponent';


export default class TextComponent extends ReactComponent {
  mountComponent(rootId){
    this._nodeId = rootId;
    return `<span data-reactid="${rootId}">${this._vNode}</span>`;
  }

  updateComponent(nextVNode){
    if (nextVNode != this._vNode){
      this._vNode = nextVNode;
      document.querySelector(`[data-reactid="${this._rootNodeId}"`).innerHTML = this._vNode;
    }
  }
}