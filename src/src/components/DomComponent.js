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

    const nextProps = nextVNode.props;
    const lastProps = this._vNode.props;

    this._vNode = nextVNode;

    // console.log(this);
    this._updateDOMProperties(lastProps, nextProps);
  }


  _updateDOMProperties(last, next){
    for (let key in last) {//处理旧属性
      if (next.hasOwnProperty(key) || !last.hasOwnProperty(key)) continue;

      if (/^on[A-Za-z]*/g.test(key)) {
        const eventType = key.replace('on', '');
        // 针对当前的节点取消事件代理
        $(document).undelegate(`[data-reactid="${this._nodeId}"]`, eventType, last[key]);
        continue;
      }


      //看是否需要处理样式
    }

    for (let key in next) {
      if (propKey === 'children') continue;

      // 更新事件属性
      if (/^on[A-Za-z]*/g.test(key)) {
        const eventType = key.replace('on', '');

        // 以前如果已经有，需要先去掉
        last[key] && $(document).undelegate(`[data-reactid="${this._nodeId}"]`, eventType, last[key]);

        // 针对当前的节点添加事件代理
        $(document).delegate(`[data-reactid="${this._nodeId}"]`, `${eventType}.${this._nodeId}`, next[key]);
        continue;
      }

      // 更新普通属性
      $(`[data-reactid="${this._nodeId}"]`).prop(key, next[key]);
    }

  }


  _updateDomChildren(last, next){
    
  }

}