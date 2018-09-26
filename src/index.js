import createElement from './ReactElement.js';

export default {
  // crearte
  createElement,
  render: (vNode, container) => {
    console.log(vNode, container);
  }
};