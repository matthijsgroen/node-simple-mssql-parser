export type SyntaxNode =
  | StatementNode
  | SelectSourceNode
  | TableNode
  | ColumnNode
  | ColumnOrderNode
  | FunctionNode
  | JoinNode
  | ConditionNode
  | WildcardNode
  | IdentifierNode
  | LiteralNode
  | InputNode
  | OffsetNode
  | LimitNode
  | InsertStatementNode
  | ValuesNode
  | NewIdNode;

export type StatementNode = SelectStatementNode | InsertStatementNode;

export type SelectStatementNode = {
  kind: "select";
  select: SelectSourceNode[];
  from: TableNode;
  joins: JoinNode[] | null;
  where: ConditionNode | null;
  groupBy: ColumnNode[] | null;
  orderBy: ColumnOrderNode[] | null;
  offset: OffsetNode | null;
  limit: LimitNode | null;
};

export type SelectSourceNode = {
  kind: "select-source";
  source: ColumnNode | WildcardNode | FunctionNode;
  alias: IdentifierNode | null;
};

export type TableNode = {
  kind: "table";
  db: IdentifierNode;
  table: IdentifierNode;
  alias: IdentifierNode | null;
};

export type ColumnNode = {
  kind: "column";
  name: IdentifierNode;
  alias: IdentifierNode | null;
};

export type ColumnOrderNode = {
  kind: "order";
  column: ColumnNode;
  direction: "asc" | "desc";
};

export type FunctionNode = CountFunctionNode;

export type CountFunctionNode = {
  kind: "function";
  name: "count";
  args: [ColumnNode | WildcardNode];
};

export type JoinNode = {
  kind: "join";
  type: "inner" | "left outer" | "right outer";
  source: TableNode;
  condition: ConditionNode;
};

export type ConditionNode =
  | EqualityConditionNode
  | LogicalConditionNode
  | GroupedConditionNode;

export type EqualityConditionNode = {
  kind: "condition";
  left: ColumnNode;
  type: "equality" | "inequality";
  right: ColumnNode | LiteralNode | InputNode;
};

export type LogicalConditionNode = {
  kind: "condition";
  type: "and" | "or";
  left: ConditionNode;
  right: ConditionNode;
};

export type GroupedConditionNode = {
  kind: "condition-group";
  condition: ConditionNode;
};

export type InsertStatementNode = {
  kind: "insert";
  target: TableNode;
  columns: ColumnNode[];
  values: ValuesNode;
  output: ColumnNode[] | null;
};

export type ValuesNode = {
  kind: "values";
  values: (LiteralNode | InputNode | NewIdNode)[];
};

export type NewIdNode = {
  kind: "function";
  name: "newid";
  args: [];
};

export type WildcardNode = {
  kind: "literal";
  type: "wildcard";
};

export type IdentifierNode = {
  kind: "identifier";
  name: string;
};

export type LiteralNode =
  | NullLiteralNode
  | StringLiteralNode
  | NumberLiteralNode;

export type NullLiteralNode = {
  kind: "literal";
  type: "null";
};

export type StringLiteralNode = {
  kind: "literal";
  type: "string";
  value: string;
};

export type NumberLiteralNode = {
  kind: "literal";
  type: "number";
  value: number;
};

export type InputNode = {
  kind: "input";
  identifier: string;
};

export type OffsetNode = {
  kind: "offset";
  rows: NumberLiteralNode | InputNode;
};

export type LimitNode = {
  kind: "limit";
  rows: NumberLiteralNode | InputNode;
};
