import axios from "axios";
import { createContext, FC, ReactNode, useReducer } from "react";
import AppReducer from "./AppReducer";
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
import history from "../utils/history";

// Item type
export type Item = {
  _id?: string;
  task: string;
  completed: boolean;
};
// List type
export type List = {
  _id?: string;
  name: string;
  items: Item[];
};
// State type
export type State = {
  listTitle?: string;
  lists?: List[];
  items?: Item[];
  isLoading?: boolean;
  error?: string | null;
  getLists?: () => Promise<void>;
  getListItems?: (customListName: string) => Promise<void>;
  addList?: (name: string) => Promise<void>;
  addListItem?: (customListName: string, name: string) => Promise<void>;
  deleteList?: (id: string) => Promise<void>;
  deleteListItem?: (customListName: string, id: string) => Promise<void>;
  toggleItemCompleted?: (
    customListName: string,
    id: string,
    checked: boolean
  ) => Promise<void>;
  setIsLoading?: (value: boolean) => void;
};
// Initial state
const initialState: State = {
  listTitle: "",
  lists: [],
  items: [],
  isLoading: true,
  error: null,
};

// Create context
export const GlobalContext = createContext(initialState);

// Provider component
export const Provider: FC<ReactNode> = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);

  // Actions
  const getLists = async () => {
    try {
      const res = await axios.get("/api");
      dispatch({
        type: GET_LISTS,
        payload: res.data,
      });
    } catch (err) {
      dispatch({
        type: ERROR,
        payload: err.response.data.error,
      });
    }
  };

  const getListItems = async (customListName: string) => {
    try {
      const res = await axios.get(`/api/${customListName}`);
      dispatch({
        type: GET_LIST_ITEMS,
        payload: res.data,
      });
    } catch (err) {
      dispatch({
        type: ERROR,
        payload: err.response.data.error,
      });
    }
  };

  const addList = async (name: string) => {
    try {
      history.push(`/api/${name}`);
    } catch (err) {
      dispatch({
        type: ERROR,
        payload: err.response.data.error,
      });
    }
  };

  const addListItem = async (customListName: string, name: string) => {
    try {
      const res = await axios.post(
        `/api/${customListName}`,
        { text: name },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      dispatch({ type: ADD_LIST_ITEM, payload: res.data });
    } catch (err) {
      dispatch({
        type: ERROR,
        payload: err.response.data.error,
      });
    }
  };

  const deleteList = async (id: string) => {
    try {
      dispatch({ type: DELETE_LIST, payload: id });
      await axios.delete(`/api/${id}`);
    } catch (err) {
      dispatch({
        type: ERROR,
        payload: err.response.data.error,
      });
    }
  };

  const deleteListItem = async (customListName: string, id: string) => {
    try {
      dispatch({ type: DELETE_LIST_ITEM, payload: id });
      await axios.delete(`/api/${customListName}/${id}`);
    } catch (err) {
      dispatch({
        type: ERROR,
        payload: err.response.data.error,
      });
    }
  };

  const toggleItemCompleted = async (
    customListName: string,
    id: string,
    checked: boolean
  ) => {
    const res = await axios.patch(`/api/${customListName}/${id}`, {
      completed: checked,
    });
    dispatch({ type: TOGGLE_ITEM_COMPLETED, payload: res.data });
  };

  const setIsLoading = (value: boolean) =>
    dispatch({ type: SET_ISLOADING, payload: value });

  return (
    <GlobalContext.Provider
      value={{
        listTitle: state.listTitle,
        lists: state.lists,
        items: state.items,
        isLoading: state.isLoading,
        getLists,
        getListItems,
        addList,
        addListItem,
        deleteList,
        deleteListItem,
        toggleItemCompleted,
        setIsLoading,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
