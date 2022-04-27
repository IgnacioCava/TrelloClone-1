import axios from 'axios';
import { setAlert } from './alert';
import {
  CLEAR_BOARD,
  GET_BOARDS,
  GET_BOARD,
  ADD_BOARD,
  BOARD_ERROR,
  RENAME_BOARD,
  GET_LIST,
  ADD_LIST,
  RENAME_LIST,
  ARCHIVE_LIST,
  GET_CARD,
  ADD_CARD,
  EDIT_CARD,
  MOVE_CARD,
  ARCHIVE_CARD,
  DELETE_CARD,
  GET_ACTIVITY,
  ADD_MEMBER,
  MOVE_LIST,
  ADD_CARD_MEMBER,
  ADD_CHECKLIST_ITEM,
  EDIT_CHECKLIST_ITEM,
  COMPLETE_CHECKLIST_ITEM,
  DELETE_CHECKLIST_ITEM
} from './types';

const config = {
  headers: {
    'Content-Type': 'application/json'
  },
};

// Get boards
export const getBoards = () => async (dispatch) => {
  try {
    dispatch({ type: CLEAR_BOARD });

    const res = await axios.get('/api/boards');

    dispatch({
      type: GET_BOARDS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: BOARD_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Get board
export const getBoard = (id) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/boards/opt/${id}`);

    if (res) {
      axios.defaults.headers.common['boardId'] = id;
    } else {
      delete axios.defaults.headers.common['boardId'];
    }

    dispatch({
      type: GET_BOARD,
      payload: { ...res.data, listObjects: res.data.lists, cardObjects: res.data.lists.map(e=>e.cards).flat() },
    });
    getActivity()
  } catch (err) {
    dispatch({
      type: BOARD_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Add board
export const addBoard = (formData, history) => async (dispatch) => {
  try {
    const body = JSON.stringify(formData);

    const res = await axios.post('/api/boards', body, config);

    dispatch({
      type: ADD_BOARD,
      payload: res.data,
    });

    dispatch(setAlert('Board Created', 'success'));

    history.push(`/board/${res.data._id}`);
  } catch (err) {
    dispatch({
      type: BOARD_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Rename board
export const renameBoard = (board, title) => async (dispatch, setAlert) => {
  const lastTitle = board.title;
  dispatch({
    type: RENAME_BOARD,
    payload: {title},
  })

  try {
    await axios.patch(`/api/boards/rename/${board._id}`, {title}, config);
    setAlert('Board renamed successfully', 'success')
    dispatch(getActivity())
  } catch (err) {
    dispatch({
      type: RENAME_BOARD,
      payload: {title: lastTitle},
    })
    setAlert('An error ocurred while updating the board title', 'error')
  }
};

// Get list
export const getList = (id) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/lists/${id}`);

    dispatch({
      type: GET_LIST,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: BOARD_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Add list
export const addList = (formData) => async (dispatch) => {
  try {
    const body = JSON.stringify(formData);

    const res = await axios.post('/api/lists', body, config);

    dispatch({
      type: ADD_LIST,
      payload: res.data,
    });

    dispatch(getActivity());
  } catch (err) {
    dispatch({
      type: BOARD_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Rename list
export const renameList = (list, title) => async (dispatch, setAlert) => {
  const lastTitle = list.title;
  dispatch({
    type: RENAME_LIST,
    payload: {...list, title},
  });

  try {
    await axios.patch(`/api/lists/rename/${list._id}`, {title}, config);
    setAlert('List renamed successfully', 'success')
  } catch (err) {
    dispatch({
      type: RENAME_LIST,
      payload: {...list, title: lastTitle},
    });
    setAlert('An error ocurred while renaming the list', 'error')
  }
};

// Archive/Unarchive list
export const archiveList = (list, archived) => async (dispatch, setAlert) => {
  dispatch({
    type: ARCHIVE_LIST,
    payload: {...list, archived},
  });

  try {
    await axios.patch(`/api/lists/archive/${archived}/${list._id}`);
    setAlert(`List ${archived?'archived':'restored'} successfully`, 'success')
    dispatch(getActivity());
  } catch (err) {
    dispatch({
      type: ARCHIVE_LIST,
      payload: {...list, archived: !archived},
    });
    setAlert(`An error ocurred while ${archived?'archiving':'restoring'} the list`, 'error')
  }
};

// Get card
export const getCard = (id) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/cards/${id}`);

    dispatch({
      type: GET_CARD,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: BOARD_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Add card
export const addCard = (formData) => async (dispatch) => {
  try {
    const body = JSON.stringify(formData);

    const res = await axios.post('/api/cards', body, config);
    dispatch({
      type: ADD_CARD,
      payload: res.data,
    });

    dispatch(getActivity());
  } catch (err) {
    dispatch({
      type: BOARD_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Edit card
export const editCard = (card, formData) => async (dispatch, setAlert) => {
  const lastData = {...formData}
  dispatch({
    type: EDIT_CARD,
    payload: {...card, ...formData},
  });
  try {
    await axios.patch(`/api/cards/edit/${card._id}`, formData, config);
    setAlert('Card edited successfully', 'success')
  } catch (err) {
    dispatch({
      type: EDIT_CARD,
      payload: {...card, ...lastData},
    });
    setAlert('An error ocurred while editing the card', 'error');
  }
};

// Move card
export const moveCard = ({listObjects, cardObjects}, cardId, formData) => async (dispatch, setAlert) => {
  let movedCard = cardObjects.find(e=>e._id===cardId)
  const fromList = {...listObjects.find(e=>e._id===formData.fromId)};
  const fromCards = [...fromList.cards]
  const toList = {...listObjects.find(e=>e._id===formData.toId)}
  const toCards = [...toList.cards]
  const addedIndex = [...toCards]
  addedIndex.splice(formData.toIndex, 0, movedCard)

  dispatch({
    type: MOVE_CARD,
    payload: {
      cardId, 
      from: {...fromList, cards: fromCards.filter(e=>e._id!==cardId)},
      to: {...toList, cards: addedIndex},
    },
  });
  try {
    const body = JSON.stringify(formData);
    const res = await axios.patch(`/api/cards/move/${cardId}`, body, config);

    dispatch({
      type: MOVE_CARD,
      payload: {
        cardId, 
        from: {...fromList, cards: res.data.from.cards.map(e=>cardObjects.find(card=>card._id===e))},
        to: {...toList, cards: res.data.to.cards.map(e=>cardObjects.find(card=>card._id===e))},
      },
    });
    dispatch(getActivity());
  } catch (err) {
    dispatch({
      type: MOVE_CARD,
      payload: {
        cardId, 
        from: {...fromList, cards: fromCards },
        to: {...toList, cards: toCards}
      },
    });
    setAlert('An error ocurred while moving the card', 'error');
  }
};
// Archive/Unarchive card
export const archiveCard = (card, archived) => async (dispatch, setAlert) => {
  dispatch({
    type: ARCHIVE_CARD,
    payload: {...card, archived},
  });
  
  try {
    await axios.patch(`/api/cards/archive/${archived}/${card._id}`);
    setAlert(`Card ${archived?'archived':'restored'} successfully`, 'success')
    dispatch(getActivity());
  } catch (err) {
    dispatch({
      type: ARCHIVE_CARD,
      payload: {...card, archived: !archived},
    });
    setAlert(`An error ocurred while ${archived?'archiving':'restoring'} the card`, 'error')
  }
};

// Delete card
export const deleteCard = (listId, card) => async (dispatch, setAlert) => {
  dispatch({
    type: DELETE_CARD,
    payload: card._id,
  });

  try {
    await axios.delete(`/api/cards/${listId}/${card._id}`);
    setAlert('Card deleted successfully', 'success')
    dispatch(getActivity());
  } catch (err) {
    dispatch({
      type: ADD_CARD,
      payload: {card, listId},
    });
    setAlert('An error ocurred while deleting the card', 'error')
  }
};

// Get activity
export const getActivity = () => async (dispatch) => {
  try {
    const boardId = axios.defaults.headers.common['boardId'];

    const res = await axios.get(`/api/boards/activity/${boardId}`);

    dispatch({
      type: GET_ACTIVITY,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: BOARD_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Add member
export const addMember = (userId) => async (dispatch, setAlert) => {
  try {
    const res = await axios.put(`/api/boards/addMember/${userId}`);

    dispatch({
      type: ADD_MEMBER,
      payload: res.data,
    });
    setAlert('Member added successfully', 'success');
    dispatch(getActivity());
  } catch (err) {
    setAlert(err.response.data, 'error')
  }
};

// Move list
export const moveList = (lists, list, toIndex) => async (dispatch, setAlert) => {
  const allLists = [...lists];
  let indexedLists = [...lists]

  indexedLists.splice(indexedLists.findIndex(e=>e._id===list), 1);
  indexedLists.splice(toIndex, 0, allLists.find(e=>e._id===list));

  dispatch({
    type: MOVE_LIST,
    payload: indexedLists,
  });
  try {
    const body = JSON.stringify({toIndex});
    const res = await axios.patch(`/api/lists/move/${list}`, body, config);
    dispatch({
      type: MOVE_LIST,
      payload: res.data.map(e=>allLists.find(list=>list._id===e)),
    });
  } catch (err) {
    dispatch({
      type: MOVE_LIST,
      payload: allLists,
    });
    setAlert('An error ocurred while moving the list', 'error')

  }
};

// Get users by query
export const getUsers = async (query) => {
    return (await axios.get(`/api/users/${query}`)).data.slice(0, 5)
};

// Add card member
export const addCardMember = (action, card, {user, name}) => async (dispatch, setAlert) => {
  const add = (add) => {  
    dispatch({
      type: ADD_CARD_MEMBER,
      payload: {...card, members: add?[...card.members, {user, name}]:card.members.filter(member => member.user !== user)},
    });
  }
  add(action)

  try {
    await axios.put(`/api/cards/addMember/${action}/${card._id}/${user}`);
    dispatch(getActivity());
  } catch (err) {
    add(!action)
    setAlert('An error ocurred while adding the user', 'error')
  }
};

// Add checklist item
export const addChecklistItem = (card, formData) => async (dispatch, setAlert) => {
  dispatch ({
    type: ADD_CHECKLIST_ITEM,
    payload: {...card, checklist: [...card.checklist, formData]},
  });
  
  try {
    const body = JSON.stringify(formData);
    const res = await axios.post(`/api/checklists/${card._id}`, body, config);
    dispatch({
      type: ADD_CHECKLIST_ITEM,
      payload: res.data,
    });
  } catch (err) {
    dispatch ({
      type: DELETE_CHECKLIST_ITEM,
      payload: card,
    })
    setAlert('An error ocurred while adding the checklist item', 'error')
  }
};

// Edit checklist item
export const editChecklistItem = (card, item, formData) => async (dispatch, setAlert) => {
  const edit = (action) => {
    dispatch({
      type: EDIT_CHECKLIST_ITEM,
      payload: {...card, checklist: card.checklist.map(thisItem => thisItem._id === item._id ? (action? {...item, ...formData} : {...item}) : item)},
    });
  }
  edit(true)

  try {
    const body = JSON.stringify(formData);
    await axios.patch(`/api/checklists/${card._id}/${item._id}`, body, config);
  } catch (err) {
    edit(false)
    setAlert('An error ocurred while editing the checklist item', 'error')
  }
};

// Complete/Uncomplete checklist item
export const completeChecklistItem = (card, item, complete) => async (dispatch, setAlert) => {
  const completeItem = (action) => {
    dispatch({
      type: COMPLETE_CHECKLIST_ITEM,
      payload: {...card, checklist: card.checklist.map(thisItem => thisItem._id === item._id ? (action? {...item, complete} : {...item, complete:!complete}) : thisItem)},
    });
  }
  completeItem(true)

  try { await axios.patch(`/api/checklists/${card._id}/${complete}/${item._id}`) } 
  catch (err) {
    completeItem(false)
    setAlert('An error ocurred while completing the checklist item', 'error')
  }
};

// Delete checklist item
export const deleteChecklistItem = (card, item) => async (dispatch, setAlert) => {
  dispatch({
    type: DELETE_CHECKLIST_ITEM,
    payload: {...card, checklist: card.checklist.filter(thisItem => thisItem._id !== item._id)},
  });

  try { await axios.delete(`/api/checklists/${card._id}/${item._id}`) } 
  catch (err) {
    dispatch({
      type: ADD_CHECKLIST_ITEM,
      payload: {...card, checklist: [...card.checklist]},
    })
    setAlert('An error ocurred while deleting the checklist item', 'error')
  }
};