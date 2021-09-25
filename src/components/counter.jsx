import React, { Component } from 'react';

export default class Counter extends Component {
  increment = ()=>{
    let {value} = this.refs.selectNumber;
    // this.props.store.dispatch(createIncrementAction(value*1))
    this.props.increment(value*1);
  }

  decrement = ()=>{
    let {value} = this.refs.selectNumber;
    // this.props.store.dispatch(createDecrementAction(value*1))
    this.props.decrement(value*1)
  }

  incrementIfOdd=()=>{
    let {value} = this.refs.selectNumber;
    if(this.props.count%2 === 1){
      this.props.increment(value*1);
    }
  }

  incrementAsync = ()=>{
    let {value} = this.refs.selectNumber;
    // setTimeout(()=>{
    //   this.props.increment(value*1);
    // },1000)
    this.props.incrementAsync(value*1, 1000);
    
  }
  render() {
    // let count = this.props.store.getState()
    return (
      <div>
        <h3>当前求和为：{this.props.count}</h3>
        <select ref='selectNumber'>
          <option value='1'>1</option>
          <option value='2'>2</option>
          <option value='3'>3</option>
        </select>&nbsp;
        <button onClick={this.increment}>+</button>&nbsp;
        <button onClick={this.decrement}>-</button>&nbsp;
        <button onClick={this.incrementIfOdd}>incrementIfOdd</button>&nbsp;
        <button onClick={this.incrementAsync}>incrementAsync</button>
      </div>
    )
  }
}
