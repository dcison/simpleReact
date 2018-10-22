import ReactComponent from './ReactComponent';
import {initComponent} from './ComponentFactor';
// import {addEvent} from '../SyntheticEvent';
import $ from 'jquery';



export default class DomComponent extends ReactComponent {

  mountComponent(rootId){
    this._nodeId = rootId;
    let {key, props, type, props: {children = []}} = this._vNode;
    let content = '', 
      tagLeft = `<${type} data-reactId="${this._nodeId}"`,
      tagRight = `</${type}>`; //左闭合与右闭合
    for(let key in props){

      if(key === 'style'){//处理驼峰式样式
        let style = '';
        Object.keys(props[key]).map(item => {
          if (/[A-Z]/g.test(item)){
            let _style = item.split('').map(letter => {
              if (/[A-Z]/.test(letter)){
                return `-${letter.toLocaleLowerCase()}`;
              }else{
                return letter;
              }
            }).join('');
            style += `${_style}:${props[key][item]};`;
          }else{
            style += `${item}:${props[key][item]};`;
          }
        });
        tagLeft += ` style="${style}"`;
      }

      if (/^on[A-Za-z]*/g.test(key)){
        const eventType = key.replace('on', '').toLocaleLowerCase();
        $(document).delegate(`[data-reactId='${this._nodeId}']`, `${eventType}`, props[key]);
      }
      if (props[key] && key !== 'children' && key !== 'style'){
        tagLeft += ` ${key=== 'className'?'class':key}=${props[key]}`;
      }
    }

    children.map((value, index) => {
      let cNode = initComponent(value);
      cNode._nodeId = `${rootId}.${index}`;
      let render = cNode.mountComponent(cNode._nodeId);
      content += render;
    });
    return `${tagLeft}>${content}${tagRight}`;
  }

  updateComponent(nextVNode){
    //待写
  }
}