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
