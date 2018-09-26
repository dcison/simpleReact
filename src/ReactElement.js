class VNode {
  constructor(type, key, props){
    this.type = type;
    this.key = key;
    this.props = props;
  }
}

/*
  &type 节点类型，
  &config 节点上的属性，如class,style，key等等
  &children 节点的内容数组
*/
export default function createElement(type, config, ...children) {

  const props = {};

  config = config || {}; // 不使用命名时赋{}是因为传递的是null，会覆盖

  for (let prop in config) {
    if (config.hasOwnProperty(prop) && prop !== 'key') {
      props[prop] = config[prop];
    }
  }

  if (children.length === 1 && Array.isArray(children[0])) {
    props.children = children[0];
  } else {
    props.children = children;
  }

  return new VNode(type, config.key || null, props);
}
