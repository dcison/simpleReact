import React from './src';
// import ReactDOM from "./bl";
// import "./test.css";

let i = 0;
class Item extends React.Component {
  render() {
    // console.log(this.context,"Item render")
    return (
      <div>
        This is context text hello---
        {/* {this.context.contextText}$$$$${
          this.context.data
        } */}
      </div>
    );
  }
}

class TestApp extends React.Component {
  // shouldComponentUpdate(nextProps,nextState){
  //   return false;
  // }
  // componentWillUpdate(nextProps,nextState){
  //   console.log("I am from update",nextState)
  // }
  // componentDidUpdate(nextProps,preState){
  //   console.log("updated",preState)
  // }
  componentWillMount(){
    console.log('I will mount');
  }
  // getChildContext() {
  //   return {
  //     contextText: "context!!!!",
  //     data: this.state.text
  //   };
  // }
  componentDidMount() {
    console.log('mounted');
    //this.setState({ text: "world666" });
  }
  constructor(props) {
    super(props);
    this.state = {
      color: 'red',
      clas: 'hello',
      text: 'hello'
    };
    // setInterval(
    //   function() {
    //     const color = [
    //       "#eee",
    //       "black",
    //       "red",
    //       "green",
    //       "blue",
    //       "grey",
    //       "#133234",
    //       "#123213",
    //       "222345",
    //       "998232"
    //     ];
    //     const rand = parseInt(Math.min(10, Math.random() * 10));
    //     this.setState({
    //       color: color[rand]
    //     });
    //   }.bind(this),
    //   1000
    // );
  }

  handleClick() {
    this.setState({
      color: 'green'
    });
  }

  render() {
    // console.log("render!!!",this.state)
    return (
      // <div
      //   className={this.state.clas}
      //   ref = {(dom)=>{console.log(dom)}}
      //   onClick={e => {
      //     console.log(i, "iiiiiiii");
      //     this.setState({ text: ++i });
      //     console.log(this.refs)
      //   }}
      // >
      //   <div
      //    ref="hello"
      //     style={{
      //       height: "100px",
      //       width: "100px",
      //       background: this.state.color
      //     }}
      //     className="I am FuckApp component"
      //   >
      //     {this.state.text}
      //   </div>
      <div>
        {/* <Item />   */}
        {/* <span style={{color: this.state.color,fontSize: '32px'}} >test</span> */}
        <button onclick={()=>this.handleClick()} style={{color: this.state.color}}>hello</button>
        {this.state.color}
      </div>
      // </div>
    );
  }
}

TestApp.defaultProps = {
  hello: 'hello'
};

let root = document.createElement('div');
root.setAttribute('id', 'root');
document.body.appendChild(root);

React.render(<TestApp />, document.getElementById('root'));
