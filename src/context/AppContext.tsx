import { createContext, Dispatch, useContext } from "react";
import { useImmerReducer } from "use-immer";
import { ProviderProps } from "@/types";

export interface App {
  name: string;
  version: string;
  description: string;
  author: string;
}

export type AppAction =
  | { type: "editName"; payload: string }
  | { type: "editVersion"; payload: string }
  | { type: "editDescription"; payload: string }
  | { type: "editAuthor"; payload: string };

const initialState: App = {
  name: "React App",
  version: "1.0.0",
  description: "A simple React App",
  author: "war3_th000"
};

const AppContext = createContext<App | undefined>(undefined);
const AppDispatchContext = createContext<Dispatch<AppAction> | undefined>(
  undefined
);

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

export const AppProvider = (props: ProviderProps) => {
  const { children } = props;

  const [state, dispatch] = useImmerReducer(appReducer, initialState);

  return (
    <AppContext value={state}>
      <AppDispatchContext value={dispatch}>{children}</AppDispatchContext>
    </AppContext>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};

export const useAppDispatch = () => {
  const context = useContext(AppDispatchContext);
  if (context === undefined) {
    throw new Error("useAppDispatch must be used within an AppProvider");
  }
  return context;
};
