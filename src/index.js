import createElement from './ReactElement.js';
import {initComponent} from './components/ComponentFactor';


export default {
  nodeID: 0,
  createElement,
  render(vNode, container) {
    let component = initComponent(vNode);
    let componentValue = component.mountComponent(this.nodeID++);
    container.innerHTML = componentValue;
  }
};