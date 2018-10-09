import ReactComponent from './ReactComponent';
import {initComponent} from './ComponentFactor';


export default class DomComponent extends ReactComponent {

  // constructor(props){
  //   super(props);
  //   console.log(props);
  // }

  mountComponent(rootId){
    this._nodeId = rootId;
    let {key, props, type, props: {children = []}} = this._vNode;
    let content = '', 
      tagLeft = `<${type}`,
      tagRight = `</${type}>`; //左闭合与右闭合
    for(let key in props){
      if (props[key] && key !== 'children'){
        tagLeft += ` ${key=== 'className'?'class':key}=${props[key]}`;
      }
    }

    children.map((value, index) => {
      let cNode = initComponent(value);
      cNode._nodeId = `${rootId}.${index}`;
      let render = cNode.mountComponent(cNode._nodeId);
      console.log(render);
      content += render;
    });
    return `${tagLeft}>${content}${tagRight}`;
    // return 'hello';
  }

  // updateComponent(nextVNode){
    
  // }
}