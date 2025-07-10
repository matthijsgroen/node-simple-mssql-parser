import { describe, expect, it } from "vitest";
import { parseMSSQLStatement, UpdateStatementNode } from ".";

describe("update statement", () => {
  const parseUpdateStatement = (sql: string): UpdateStatementNode =>
    parseMSSQLStatement(sql) as UpdateStatementNode;

  it("parses a simple update statement", () => {
    const sql = `UPDATE [dbo].[users] SET name = 'Alice', age = 30 OUTPUT inserted.id, inserted.age WHERE id = @id;`;
    const result = parseUpdateStatement(sql);
    expect(result).toMatchInlineSnapshot(`
      {
        "kind": "update",
        "output": [
          {
            "alias": {
              "kind": "identifier",
              "name": "inserted",
            },
            "kind": "column",
            "name": {
              "kind": "identifier",
              "name": "id",
            },
          },
          {
            "alias": {
              "kind": "identifier",
              "name": "inserted",
            },
            "kind": "column",
            "name": {
              "kind": "identifier",
              "name": "age",
            },
          },
        ],
        "set": [
          {
            "column": {
              "alias": null,
              "kind": "column",
              "name": {
                "kind": "identifier",
                "name": "name",
              },
            },
            "kind": "assignment",
            "value": {
              "kind": "literal",
              "type": "string",
              "value": "Alice",
            },
          },
          {
            "column": {
              "alias": null,
              "kind": "column",
              "name": {
                "kind": "identifier",
                "name": "age",
              },
            },
            "kind": "assignment",
            "value": {
              "kind": "literal",
              "type": "number",
              "value": 30,
            },
          },
        ],
        "target": {
          "alias": null,
          "db": {
            "kind": "identifier",
            "name": "dbo",
          },
          "kind": "table",
          "table": {
            "kind": "identifier",
            "name": "users",
          },
        },
        "where": {
          "kind": "condition",
          "left": {
            "alias": null,
            "kind": "column",
            "name": {
              "kind": "identifier",
              "name": "id",
            },
          },
          "right": {
            "identifier": "id",
            "kind": "input",
          },
          "type": "equality",
        },
      }
    `);
  });
});
