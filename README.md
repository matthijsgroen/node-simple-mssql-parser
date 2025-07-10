# node-simple-mssql-parser

A simple, lightweight parser for MSSQL (T-SQL) SELECT, UPDATE and INSERT statements in Node.js. It parses SQL queries into an Abstract Syntax Tree (AST) and provides utilities to traverse and analyze the AST for filtering, transformation, or inspection.


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
### Pretty-print a SQL AST

```ts
import { parseMSSQLStatement, prettyPrint } from "node-simple-mssql-parser";

const sql = "SELECT id, name FROM [dbo].[users];";
const ast = parseMSSQLStatement(sql);
const formatted = prettyPrint(ast);
console.log(formatted);
```

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


## Features

- **Parse MSSQL SELECT, INSERT, and UPDATE statements** into a rich, typed AST
- **Traverse and analyze the AST** with a flexible visitor utility
- **Supports WHERE conditions** with nested AND/OR and grouping (parentheses)
- **Joins:** INNER, LEFT OUTER, RIGHT OUTER
- **Column and table aliases**
- **Functions:** COUNT(*), COUNT(column), and NEWID()
- **GROUP BY, ORDER BY, OFFSET, LIMIT**
- **Output clause** for INSERT and UPDATE
- **TypeScript types** for all AST nodes
- **Pretty-printing**: Convert AST back to formatted SQL
- **Error reporting** for invalid SQL syntax

### Example SQL features supported:

- `SELECT id, name FROM [dbo].[users] WHERE id = 5 AND (a.b = @input OR columnName2 = 'hello')`
- `INSERT INTO [dbo].[users] (name, age) OUTPUT inserted.id VALUES ('Alice', 30);`
- `UPDATE [dbo].[users] SET name = 'Bob' WHERE id = 1;`
- `SELECT COUNT(*) FROM [dbo].[users]`
- `SELECT * FROM [dbo].[users] u JOIN [dbo].[posts] p ON u.id = p.user_id`

See the test files for more advanced usage and edge cases.


## License

MIT
