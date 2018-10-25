import ReactComponent from './ReactComponent';
import {initComponent, judgeUpdateReactComponent} from './ComponentFactor';
import $ from 'jquery';

export default class CompositeComponent extends ReactComponent {
  constructor(ele){
    super(ele);
    this._instance = null;
    this._renderComponent = null;
  }
  mountComponent(rootId){
    this._nodeId = rootId;
    const { type: Component, props } = this._vNode;
    const inst =  new Component(props);

    this._instance = inst;

    inst._reactInternalInstance = this;

    //调用willmount方法
    inst.componentWillMount && inst.componentWillMount();

    // 调用自定义组件的render方法，返回一个Vdom
    const renderedVdom = inst.render();

    const renderedComponent = initComponent(renderedVdom);
    // this._renderedComponent = renderedComponent
    //调用didmount
    // $(document).on('mountReady', () => {
    //   inst.componentDidMount && inst.componentDidMount()
    // })

    this._renderComponent = renderedComponent;

    inst.componentDidMount && inst.componentDidMount();

    return renderedComponent.mountComponent(this._nodeId);

  }

  updateComponent(nextVNode, newState){
    const inst = this._instance;
    const nextState = {...inst.state, ...newState};
    const nextProps = this._vNode.props;

    if (inst.shouldComponentUpdate && !inst.shouldComponentUpdate(nextProps, nextState)) return;
    
    inst.componentWillUpdate && inst.componentWillUpdate(nextProps, nextState);

    inst.state = nextState;
    inst.props = nextProps;

    const prevComponent = this._renderComponent;
    // 获取render新旧的vDom
    const prevRenderVDom = prevComponent._vNode;
    const nextRenderVDom = inst.render();

    if (judgeUpdateReactComponent(prevRenderVDom, nextRenderVDom)){
      //更新哦
      // console.log(prevComponent);
      prevComponent.updateComponent(nextRenderVDom);
      // inst.componentDidUpdate && inst.componentDidUpdate()
    }else{
      // 重新渲染
      this._renderedComponent = initComponent(nextRenderVDom);
      // 重新生成对应的元素内容
      const nextMarkUp = this._renderedComponent.mountComponent(this._rootNodeId);
      // 替换整个节点
      $(`[data-reactid="${this._rootNodeId}"]`).replaceWith(nextMarkUp);
    }
  }
}