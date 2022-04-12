export const test = {
    count : 0
  };

export default function testReducer (state = test, action) {
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