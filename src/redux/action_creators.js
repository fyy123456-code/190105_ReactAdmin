import {INCREMENT, DECREMENT} from './action_types'
export const createIncrementAction = value => ({type:INCREMENT, data:value});
export const createDecrementAction = value => ({type:DECREMENT, data:value});
export const createIncrementAsyncAction = (value, delay) => {
  setTimeout(()=>{
    return {type:INCREMENT, data:value}
  },delay)
}