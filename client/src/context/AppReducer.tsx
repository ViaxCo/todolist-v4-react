import {
  ERROR,
  GET_LISTS,
  GET_LIST_ITEMS,
  DELETE_LIST,
  DELETE_LIST_ITEM,
  SET_ISLOADING,
  ADD_LIST_ITEM,
  TOGGLE_ITEM_COMPLETED,
} from "./actionTypes";
import { State } from "./GlobalState";
import { getDay } from "../utils/date";
const day = getDay();

type ItemAction = {
  type: string;
  payload: State | string | boolean;
};

const reducer = (state: State, action: ItemAction) => {
  switch (action.type) {
    case GET_LISTS:
      return {
        ...state,
        isLoading: false,
        listTitle: day,
        lists: (action.payload as State).lists,
      };
    case GET_LIST_ITEMS:
      return {
        ...state,
        isLoading: false,
        listTitle: (action.payload as State).listTitle,
        items: (action.payload as State).items,
      };
    case ADD_LIST_ITEM:
      return {
        ...state,
        items: (action.payload as State).items,
      };
    case DELETE_LIST:
      return {
        ...state,
        lists: state.lists?.filter(
          list => list._id !== (action.payload as string)
        ),
      };
    case DELETE_LIST_ITEM:
      return {
        ...state,
        items: state.items?.filter(
          item => item._id !== (action.payload as string)
        ),
      };
    case TOGGLE_ITEM_COMPLETED:
      return {
        ...state,
        items: (action.payload as State).items,
      };
    case SET_ISLOADING:
      return {
        ...state,
        isLoading: action.payload as boolean,
      };
    case ERROR:
      return {
        ...state,
        error: action.payload as string,
      };
    default:
      return state;
  }
};

export default reducer;
