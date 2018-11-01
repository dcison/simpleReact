import ReactComponent from './ReactComponent';
import $ from 'jquery';

export default class TextComponent extends ReactComponent {
  mountComponent(rootId){
    this._nodeId = rootId;
    return `<span data-reactid="${rootId}">${this._vNode}</span>`;
  }

  updateComponent(nextVNode){

    if (nextVNode != this._vNode){
      this._vNode = nextVNode;
      $(`[data-reactid="${this._nodeId}"]`).html(this._vNode);
    }
  }
}