import Counter from "../components/counter";
import { connect } from 'react-redux';
import { createIncrementAction, createDecrementAction } from '../redux/action_creators'

// function mapStateToProps(state){
//   return {count:state}
// }
//简写方式
// let mapStateToProps = state => ({ count: state })

// function mapDispatchToProps(dispatch){
//   return {
//     increment: (value)=>{
//       dispatch(createIncrementAction(value))
//     },
//     decrement: (value)=>{
//       dispatch(createDecrementAction(value))
//     }
//   }
// }
//简写方式
// let mapDispatchToProps = dispatch => (
//   {
//     increment: (value) => {
//       dispatch(createIncrementAction(value))
//     }
//   },
//   {
//     decrement: (value) => {
//       dispatch(createDecrementAction(value))
//     }
//   }
// )

export default connect(
  state => ({ count: state }), 
  {
    increment:createIncrementAction,
    decrement:createDecrementAction
  }
  )(Counter)