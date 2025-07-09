import {
  SelectSourceNode,
  ColumnNode,
  ColumnOrderNode,
  JoinNode,
  WildcardNode,
  SyntaxNode,
} from "./types";

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
      (node.select as SelectSourceNode[]).forEach((child) =>
        traverse(child, visitor, node),
      );
      traverse(node.from, visitor, node);
      if (node.joins)
        (node.joins as JoinNode[]).forEach((j) => traverse(j, visitor, node));
      if (node.where) traverse(node.where, visitor, node);
      if (node.groupBy)
        (node.groupBy as ColumnNode[]).forEach((g) =>
          traverse(g, visitor, node),
        );
      if (node.orderBy)
        (node.orderBy as ColumnOrderNode[]).forEach((o) =>
          traverse(o, visitor, node),
        );
      if (node.offset) traverse(node.offset, visitor, node);
      if (node.limit) traverse(node.limit, visitor, node);
      break;
    }
    case "select-source": {
      // SelectSourceNode
      traverse(node.source, visitor, node);
      if (node.alias) traverse(node.alias, visitor, node);
      break;
    }
    case "table-source": {
      // TableSourceNode
      traverse(node.db, visitor, node);
      traverse(node.table, visitor, node);
      if (node.alias) traverse(node.alias, visitor, node);
      break;
    }
    case "column": {
      // ColumnNode
      traverse(node.name, visitor, node);
      if (node.alias) traverse(node.alias, visitor, node);
      break;
    }
    case "order": {
      // ColumnOrderNode
      traverse(node.column, visitor, node);
      break;
    }
    case "function": {
      // FunctionNode
      (node.args as (ColumnNode | WildcardNode)[]).forEach((arg: any) =>
        traverse(arg, visitor, node),
      );
      break;
    }
    case "join": {
      // JoinNode
      traverse(node.table, visitor, node);
      traverse(node.condition, visitor, node);
      break;
    }
    case "condition": {
      // EqualityConditionNode | LogicalConditionNode
      if (node.type === "equality") {
        traverse(node.left, visitor, node);
        traverse(node.right, visitor, node);
      } else if (node.type === "and" || node.type === "or") {
        traverse(node.left, visitor, node);
        traverse(node.right, visitor, node);
      }
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
