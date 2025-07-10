import { SyntaxNode } from "./types";

export type Visitor<T = void> = {
  enter?: (node: SyntaxNode, parent: SyntaxNode | null) => T | void;
  leave?: (node: SyntaxNode, parent: SyntaxNode | null) => void;
};

export function traverse<T = void>(
  node: SyntaxNode,
  visitor: Visitor<T>,
  parent: SyntaxNode | null = null,
): void {
  if (!node) return;
  if (visitor.enter) visitor.enter(node, parent);

  switch (node.kind) {
    case "select": {
      // SelectStatementNode
      node.select.forEach((child) => traverse(child, visitor, node));
      traverse(node.from, visitor, node);
      if (node.joins) node.joins.forEach((j) => traverse(j, visitor, node));
      if (node.where) traverse(node.where, visitor, node);
      if (node.groupBy) node.groupBy.forEach((g) => traverse(g, visitor, node));
      if (node.orderBy) node.orderBy.forEach((o) => traverse(o, visitor, node));
      if (node.offset) traverse(node.offset, visitor, node);
      if (node.limit) traverse(node.limit, visitor, node);
      break;
    }
    case "insert": {
      traverse(node.target, visitor, node);
      node.columns.forEach((col) => traverse(col, visitor, node));
      traverse(node.values, visitor, node);
      if (node.output)
        node.output.forEach((col) => traverse(col, visitor, node));
      break;
    }
    case "update": {
      traverse(node.target, visitor, node);
      node.set.forEach((col) => traverse(col, visitor, node));
      if (node.output)
        node.output.forEach((col) => traverse(col, visitor, node));
      break;
    }
    case "assignment": {
      traverse(node.column, visitor, node);
      traverse(node.value, visitor, node);
      break;
    }
    case "values": {
      node.values.forEach((val) => traverse(val, visitor, node));
      break;
    }
    case "select-source": {
      traverse(node.source, visitor, node);
      if (node.alias) traverse(node.alias, visitor, node);
      break;
    }
    case "table": {
      traverse(node.db, visitor, node);
      traverse(node.table, visitor, node);
      if (node.alias) traverse(node.alias, visitor, node);
      break;
    }
    case "column": {
      traverse(node.name, visitor, node);
      if (node.alias) traverse(node.alias, visitor, node);
      break;
    }
    case "order": {
      traverse(node.column, visitor, node);
      break;
    }
    case "function": {
      node.args.forEach((arg: any) => traverse(arg, visitor, node));
      break;
    }
    case "join": {
      traverse(node.source, visitor, node);
      traverse(node.condition, visitor, node);
      break;
    }
    case "condition": {
      traverse(node.left, visitor, node);
      traverse(node.right, visitor, node);
      break;
    }
    case "condition-group": {
      traverse(node.condition, visitor, node);
      break;
    }
    case "literal": {
      // WildcardNode | NullLiteralNode | StringLiteralNode | NumberLiteralNode
      // leaf node
      break;
    }
    case "identifier": {
      // IdentifierNode
      // leaf node
      break;
    }
    case "input": {
      // InputNode
      // leaf node
      break;
    }
    case "offset": {
      // OffsetNode
      traverse(node.rows, visitor, node);
      break;
    }
    case "limit": {
      // LimitNode
      traverse(node.rows, visitor, node);
      break;
    }
    default:
      break;
  }

  if (visitor.leave) visitor.leave(node, parent);
}
