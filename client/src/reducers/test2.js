export const test2 = {
    count : 0
  };

export default function test2Reducer (state = test2, action) {
  switch (action.type) {
    case 'ADD':
      return {
        ...state,
        count: state.count + 1,
      };
    case 'SUBTRACT':
      return {
        ...state,
        count: state.count - 1,
      };
    default:
      return state;
  }
}