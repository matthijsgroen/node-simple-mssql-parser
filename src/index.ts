import { parse } from "./mssql-parser";
import { StatementNode } from "./types";

export const parseMSSQLStatement = (query: string): StatementNode =>
  parse(query);

export { traverse } from "./traverse";
export { prettyPrint } from "./pretty-print";
export * from "./types";
