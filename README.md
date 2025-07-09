
# node-simple-mssql-parser

A simple, lightweight parser for MSSQL (T-SQL) SELECT statements in Node.js. It parses SQL queries into an Abstract Syntax Tree (AST) and provides utilities to traverse and analyze the AST for filtering, transformation, or inspection.

## Use Case

- Parse MSSQL SELECT queries into a structured AST for further analysis or transformation.
- Traverse the AST to filter, select, or modify nodes (e.g., extract columns, rewrite queries, static analysis).
- Useful for query analysis tools, code generation, query rewriting, or building SQL-aware applications.

## Installation

```sh
pnpm add node-simple-mssql-parser
# or
npm install node-simple-mssql-parser
```

## Basic Usage

### Parse a Query

```ts
import { parseMSSQLStatement } from "node-simple-mssql-parser";

const sql = "SELECT id, name FROM [dbo].[users];";
const ast = parseMSSQLStatement(sql);
console.log(JSON.stringify(ast, null, 2));
```

### Traverse the AST

```ts
import { traverse } from "node-simple-mssql-parser";

traverse(ast, {
  enter(node) {
    if (node.kind === "column") {
      console.log("Column:", node.name.name);
    }
  },
});
```

## Example: Extracting All Column Names

```ts
const columns = [];
traverse(ast, {
  enter(node) {
    if (node.kind === "column") {
      columns.push(node.name.name);
    }
  },
});
console.log(columns); // ["id", "name"]
```

## Supported Features
- SELECT, FROM, WHERE, GROUP BY, ORDER BY, JOIN, OFFSET, LIMIT
- Column and table aliases
- COUNT(*) and similar functions
- Nested conditions (AND/OR)

## License

MIT
