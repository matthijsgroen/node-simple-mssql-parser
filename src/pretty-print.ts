import { SyntaxNode } from "./types";

export const prettyPrint = (node: SyntaxNode): string => {
  switch (node.kind) {
    case "select": {
      return `SELECT ${node.select.map(prettyPrint).join(", ")} FROM ${prettyPrint(node.from)}${
        node.joins ? ` ${node.joins.map(prettyPrint).join(" ")}` : ""
      }${node.where ? ` WHERE ${prettyPrint(node.where)}` : ""}${
        node.groupBy
          ? ` GROUP BY ${node.groupBy.map(prettyPrint).join(", ")}`
          : ""
      }${node.orderBy ? ` ORDER BY ${node.orderBy.map(prettyPrint).join(", ")}` : ""}${
        node.offset ? ` ${prettyPrint(node.offset)}` : ""
      }${node.limit ? ` ${prettyPrint(node.limit)}` : ""};`;
    }
    case "insert":
      return `INSERT INTO ${prettyPrint(node.target)} (${node.columns.map(prettyPrint).join(", ")})${
        node.output ? ` OUTPUT ${node.output.map(prettyPrint).join(", ")}` : ""
      } ${prettyPrint(node.values)};`;
    case "values":
      return `VALUES (${node.values.map(prettyPrint).join(", ")})`;
    case "select-source":
      return `${prettyPrint(node.source)}${node.alias ? ` AS ${prettyPrint(node.alias)}` : ""}`;
    case "table":
      return `[${prettyPrint(node.db)}].[${prettyPrint(node.table)}]${node.alias ? ` ${prettyPrint(node.alias)}` : ""}`;
    case "column":
      return `${node.alias ? `${prettyPrint(node.alias)}.` : ""}${prettyPrint(node.name)}`;
    case "order":
      return `${prettyPrint(node.column)} ${node.direction.toUpperCase()}`;
    case "function":
      return `${node.name.toUpperCase()}(${node.args.map(prettyPrint).join(", ")})`;
    case "join":
      return `${node.type.toUpperCase()} JOIN ${prettyPrint(node.source)} ON ${prettyPrint(node.condition)}`;
    case "condition": {
      if (node.right.kind === "literal" && node.right.type === "null") {
        return `${prettyPrint(node.left)} IS ${node.type === "equality" ? "NULL" : "NOT NULL"}`;
      }
      if (node.type === "equality") {
        return `${prettyPrint(node.left)} = ${prettyPrint(node.right)}`;
      }
      if (node.type === "inequality") {
        return `${prettyPrint(node.left)} <> ${prettyPrint(node.right)}`;
      }
      if (node.type === "and") {
        return `${prettyPrint(node.left)} AND ${prettyPrint(node.right)}`;
      }
      return `${prettyPrint(node.left)} OR ${prettyPrint(node.right)}`;
    }
    case "condition-group":
      return `(${prettyPrint(node.condition)})`;
    case "literal": {
      if (node.type === "wildcard") {
        return "*";
      }
      if (node.type === "number") {
        return node.value.toString();
      }
      if (node.type === "null") {
        return "NULL";
      }
      return `'${node.value}'`;
    }
    case "identifier":
      return node.name;
    case "offset":
      return `OFFSET ${prettyPrint(node.rows)} ROWS`;
    case "limit":
      return `FETCH NEXT ${prettyPrint(node.rows)} ROWS ONLY`;
    case "input":
      return `@${node.identifier}`;
  }
};
