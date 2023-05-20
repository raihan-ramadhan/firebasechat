import { createContext, useContext, useEffect, useReducer } from "react";
import { AuthContext } from "./authContext";

export const ChatContext = createContext(null);

export const ChatContextProvider = ({ children }) => {
  const { currUser } = useContext(AuthContext);

  const INITIAL_STATE = {
    chatId: null,
    user: {},
  };

  const chatReducer = (state, action) => {
    switch (action.type) {
      case "CHANGE_USER":
        return {
          user: action.payload,
          chatId:
            currUser.uid > action.payload.uid
              ? currUser.uid + action.payload.uid
              : action.payload.uid + currUser.uid,
        };
      case "RESET_CHATS":
        return INITIAL_STATE;
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

  useEffect(() => {
    if (Object.entries(currUser).length == 0) {
      dispatch({ type: "RESET_CHATS" });
    }
  }, [Object.entries(currUser).length]);

  return (
    <ChatContext.Provider value={{ data: state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
};
