type StatementNode = SelectStatementNode;
type SelectStatementNode = {
    kind: 'select';
    select: SelectSourceNode[];
    from: TableSourceNode;
    joins: JoinNode[] | null;
    where: ConditionNode | null;
    groupBy: ColumnNode[] | null;
    orderBy: ColumnOrderNode[] | null;
    offset: OffsetNode | null;
    limit: LimitNode | null;
};
type SelectSourceNode = {
    kind: 'select-source';
    source: ColumnNode | WildcardNode | FunctionNode;
    alias: IdentifierNode | null;
};
type TableSourceNode = {
    kind: 'table-source';
    db: IdentifierNode;
    table: IdentifierNode;
    alias: IdentifierNode | null;
};
type ColumnNode = {
    kind: 'column';
    name: IdentifierNode;
    alias: IdentifierNode | null;
};
type ColumnOrderNode = {
    kind: 'order';
    column: ColumnNode;
    direction: 'asc' | 'desc';
};
type FunctionNode = CountFunctionNode;
type CountFunctionNode = {
    kind: 'function';
    name: "count";
    args: [ColumnNode | WildcardNode];
};
type JoinNode = {
    kind: 'join';
    type: 'inner' | 'left outer' | 'right outer';
    table: TableSourceNode;
    condition: ConditionNode;
};
type ConditionNode = EqualityConditionNode | LogicalConditionNode;
type EqualityConditionNode = {
    kind: 'condition';
    left: ColumnNode;
    type: "equality";
    right: ColumnNode | LiteralNode | InputNode;
};
type LogicalConditionNode = {
    kind: 'condition';
    type: "and" | "or";
    left: ConditionNode;
    right: ConditionNode;
};
type WildcardNode = {
    kind: 'literal';
    type: 'wildcard';
};
type IdentifierNode = {
    kind: 'identifier';
    name: string;
};
type LiteralNode = NullLiteralNode | StringLiteralNode | NumberLiteralNode;
type NullLiteralNode = {
    kind: 'literal';
    type: 'null';
};
type StringLiteralNode = {
    kind: 'literal';
    type: 'string';
    value: string;
};
type NumberLiteralNode = {
    kind: 'literal';
    type: 'number';
    value: number;
};
type InputNode = {
    kind: 'input';
    identifier: string;
};
type OffsetNode = {
    kind: 'offset';
    rows: NumberLiteralNode | InputNode;
};
type LimitNode = {
    kind: 'limit';
    rows: NumberLiteralNode | InputNode;
};

declare const parseMSSQLStatement: (query: string) => StatementNode;

export { parseMSSQLStatement };
