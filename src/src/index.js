import createElement from './ReactElement.js';
import {initComponent} from './components/ComponentFactor';
import Component from './Component';

export default {
  nodeID: 0,
  createElement,
  Component,
  render(vNode, container) {
    let component = initComponent(vNode);
    let componentValue = component.mountComponent(this.nodeID++);
    container.innerHTML = componentValue;
  }
};