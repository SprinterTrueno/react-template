import { createContext, Dispatch, ReactNode, useContext } from "react";
import { useImmerReducer } from "use-immer";
import { App, AppAction } from "@/types/app";

interface AppContextProps {
  children: ReactNode;
}

const initialState: App = {
  name: "React App",
  version: "1.0.0",
  description: "A simple React App",
  author: "war3_th000",
};

const AppContext = createContext<App>(null);
const AppDispatchContext = createContext<Dispatch<AppAction>>(null);

const appReducer = (draft: App, action: AppAction) => {
  switch (action.type) {
    case "editName":
      draft.name = action.payload;
      break;
    case "editVersion":
      draft.version = action.payload;
      break;
    case "editDescription":
      draft.description = action.payload;
      break;
    case "editAuthor":
      draft.author = action.payload;
      break;
    default: {
      throw Error("Unknown action type!");
    }
  }
};

export const AppProvider = (props: AppContextProps) => {
  const { children } = props;

  const [state, dispatch] = useImmerReducer(appReducer, initialState);

  return (
    <AppContext value={state}>
      <AppDispatchContext value={dispatch}>{children}</AppDispatchContext>
    </AppContext>
  );
};

export const useApp = () => {
  return useContext(AppContext);
};

export const useAppDispatch = () => {
  return useContext(AppDispatchContext);
};
