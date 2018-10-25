import ReactComponent from './ReactComponent';
import { initComponent, judgeUpdateReactComponent } from './ComponentFactor';
// import {addEvent} from '../SyntheticEvent';
import $ from 'jquery';

// 全局的更新深度标识，用来判定触发patch的时机
let updateDepth = 0;
// 全局的更新队列
let diffQueue = [];
// 差异更新的几种类型
const UPDATE_TYPES = {
  MOVE_EXISTING: 1,
  REMOVE_NODE: 2,
  INSERT_MARKUP: 3
};

export default class DomComponent extends ReactComponent {

  constructor(vNode){
    super(vNode);
    this._renderedChildComponents = null;
  }

  mountComponent(rootId) {
    this._nodeId = rootId;
    let { key, props, type, props: { children = [] } } = this._vNode;
    let content = '',
      tagLeft = `<${type} data-reactId="${this._nodeId}"`,
      tagRight = `</${type}>`; //左闭合与右闭合
    for (let key in props) {

      if (key === 'style') {//处理驼峰式样式
        let style = '';
        Object.keys(props[key]).map(item => {
          if (/[A-Z]/g.test(item)) {
            let _style = item.split('').map(letter => {
              if (/[A-Z]/.test(letter)) {
                return `-${letter.toLocaleLowerCase()}`;
              } else {
                return letter;
              }
            }).join('');
            style += `${_style}:${props[key][item]};`;
          } else {
            style += `${item}:${props[key][item]};`;
          }
        });
        tagLeft += ` style="${style}"`;
      }

      if (/^on[A-Za-z]*/g.test(key)) {
        const eventType = key.replace('on', '').toLocaleLowerCase();
        $(document).delegate(`[data-reactId='${this._nodeId}']`, `${eventType}`, props[key]);
      }
      if (props[key] && key !== 'children' && key !== 'style') {
        tagLeft += ` ${key === 'className' ? 'class' : key}=${props[key]}`;
      }
    }
    let cComponent = null, components = [];
    children.map((value, index) => {
      cComponent = initComponent(value);
      cComponent._mountIndex = index;

      components.push(cComponent);

      let render = cComponent.mountComponent(cComponent._nodeId);
      content += render;
    });

    this._renderedChildComponents = components;
    return `${tagLeft}>${content}${tagRight}`;
  }

  updateComponent(nextVNode) {
    //待写

    const nextProps = nextVNode.props;
    const lastProps = this._vNode.props;

    this._vNode = nextVNode;

    this._updateDOMProperties(lastProps, nextProps);

    this._updateDomChildren(nextVNode.props.children);

  }


  _updateDOMProperties(last, next) {
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
      if (key === 'children') continue;//如果是children，忽略

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


  _updateDomChildren(children) {
    updateDepth++;
    this._diff(diffQueue, children);
    updateDepth--;
    updateDepth === 0 && console.log(diffQueue);
    if (updateDepth === 0) {
      // 具体的dom渲染
      this._patch(diffQueue);
      diffQueue = [];
    }
  }

  _patch(updates) {
    // 处理移动和删除的
    updates.forEach(({ type, fromIndex, toIndex, parentNode, parentId, markup }) => {
      const updatedChild = $(parentNode.children().get(fromIndex));

      switch (type) {
        case UPDATE_TYPES.INSERT_MARKUP:
          insertChildAt(parentNode, $(markup), toIndex); // 插入
          break;
        case UPDATE_TYPES.MOVE_EXISTING:
          deleteChild(updatedChild); // 删除
          insertChildAt(parentNode, updatedChild, toIndex);
          break;
        case UPDATE_TYPES.REMOVE_NODE:
          deleteChild(updatedChild);
          break;
        default:
          break;
      }
    });
  }

  _diff(diffQueue, children) {
    let prevChildComponents = array2Map(this._renderedChildComponents);
    let nextChildComponents = generateComponentsMap(prevChildComponents, children);
    
    for(let name of nextChildComponents.keys()){
      nextChildComponents.has(name) && this._renderedChildComponents.push(nextChildComponents.get(name));
    }

    let lastIndex  = 0, nextIndex = 0;

    for(let name of nextChildComponents.keys()){
      if(!nextChildComponents.has(name)) continue;

      const prevChildComponent = prevChildComponents.get(name);
      const nextChildComponent = nextChildComponents.get(name);
      
      if(prevChildComponent ===  nextChildComponent){
        prevChildComponent._mountIndex < lastIndex && diffQueue.push({
          parentId: this._nodeId,
          parentNode: $(`[data-reactid="${this._nodeId}"]`),
          type: UPDATE_TYPES.MOVE_EXISTING,
          fromIndex: prevChildComponent._mountIndex,
          toIndex: nextIndex
        });
        lastIndex = Math.max(prevChildComponent._mountIndex, lastIndex);

      }else{
        // 如果不相同，说明是新增的节点
        if (prevChildComponent) {
          // 如果老的component在，需要把老的component删除
          diffQueue.push({
            parentId: this._nodeId,
            parentNode: $(`[data-reactid="${this._nodeId}"]`),
            type: UPDATE_TYPES.REMOVE_NODE,
            fromIndex: prevChildComponent._mountIndex,
            toIndex: null
          });

          // 去掉事件监听
          if (prevChildComponent._nodeId) {
            $(document).undelegate(`.${prevChildComponent._nodeId}`);
          }

          lastIndex = Math.max(prevChildComponent._mountIndex, lastIndex);
        }

        diffQueue.push({
          parentId: this._nodeId,
          parentNode: $(`[data-reactid="${this._nodeId}"]`),
          type: UPDATE_TYPES.INSERT_MARKUP,
          fromIndex: null,
          toIndex: nextIndex,
          markup: nextChildComponent.mountComponent(`${this._nodeId}.${name}`)
        });


        nextChildComponent._mountIndex = nextIndex;
        nextIndex++;
      }

    }

    // 对于老的节点里有，新的节点里没有的，全部删除
    for (let name of prevChildComponents.keys() ) {
      const prevChildComponent = prevChildComponents.get(name);

      if (prevChildComponents.has(name) && !(nextChildComponents && nextChildComponents.has(name))) {
        diffQueue.push({
          parentId: this._nodeId,
          parentNode: $(`[data-reactid="${this._nodeId}"]`),
          type: UPDATE_TYPES.REMOVE_NODE,
          fromIndex: prevChildComponent._mountIndex,
          toIndex: null
        });

        // 如果渲染过，去掉事件监听
        if (prevChildComponent._nodeId) {
          $(document).undelegate(`.${prevChildComponent._nodeId}`);
        }
      }
    }
    

  }

}
function deleteChild(child){
  child && child.remove();
}
/**
 * 用来生成子节点的component
 * 如果是更新，就会继续使用以前的component，调用对应的updateComponent
 * 如果是新的节点，就会重新生成一个新的componentInstance
 * 返回map
 */
function generateComponentsMap(prev, next = []){
  const nextComponents = new Map();

  next.map((item, index) => {
    let name = item.key ? item.key : 'stringName:' + index;
    let prevChildComponent = prev && prev.get(name);
    let prevVdom = prevChildComponent && prevChildComponent._vNode;
    let nextVdom = item;

    if (judgeUpdateReactComponent(prevVdom, nextVdom)){
      //递归更新子节点
      prevChildComponent.updateComponent(nextVdom);
      nextComponents.set(name, prevChildComponent);

    }else{
      // 重新渲染生存component
      const nextComponent = initComponent(nextVdom);
      nextComponents[name] = nextComponent;
      nextComponents.set(name, nextComponent);

    }
  });
  return nextComponents;

}

// param: array 
// ruturn: map
function array2Map(arr){
  let childMap = new Map();
  let array = arr || [];
  array.map((item, index) => {
    let name = item && item._vNode && item._vNode.key ? item._vNode.key : 'stringName:' + index;
    childMap.set(name, item);
  });

  return childMap;
}