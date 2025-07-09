# node-simple-mssql-parser

A simple, lightweight parser for MSSQL (T-SQL) SELECT and INSERT statements in Node.js. It parses SQL queries into an Abstract Syntax Tree (AST) and provides utilities to traverse and analyze the AST for filtering, transformation, or inspection.


## Use Cases

- Parse MSSQL SELECT and INSERT queries into a structured AST for further analysis or transformation.
- Traverse the AST to filter, select, or modify nodes (e.g., extract columns, rewrite queries, static analysis).
- Useful for query analysis tools, code generation, query rewriting, or building SQL-aware applications.


## Installation

```sh
# Using pnpm
pnpm add node-simple-mssql-parser
# or npm
npm install node-simple-mssql-parser
```


## Basic Usage

### Parse a SELECT Query

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


### Example: Extracting All Column Names

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



### Parse and Traverse an INSERT Statement

```ts
const sql = "INSERT INTO [dbo].[users] (name, age) VALUES ('Alice', 30);";
const ast = parseMSSQLStatement(sql);
traverse(ast, {
  enter(node) {
    if (node.kind === "insert") {
      console.log("Insert target:", node.target.table.name);
    }
    if (node.kind === "column") {
      console.log("Column:", node.name.name);
    }
    if (node.kind === "literal") {
      console.log("Value:", node.value);
    }
  },
});
```


## Supported Features

- SELECT, INSERT, FROM, WHERE, GROUP BY, ORDER BY, JOIN, OFFSET, LIMIT
- Column and table aliases
- COUNT(*) and similar functions
- Nested conditions (AND/OR)


## License

MIT
