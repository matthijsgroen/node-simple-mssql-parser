import { describe, expect, it } from "vitest";
import { parseMSSQLStatement } from ".";
import { InsertStatementNode } from "./types";

describe("parsing insert statement", () => {
  const parseInsertStatement = (sql: string): InsertStatementNode =>
    parseMSSQLStatement(sql) as InsertStatementNode;

  it("parses a simple insert statement", () => {
    const sql = "INSERT INTO [dbo].[users] (name, age) VALUES ('Alice', 30);";
    const result = parseInsertStatement(sql);
    expect(result).toMatchInlineSnapshot(`
      {
        "columns": [
          {
            "alias": null,
            "kind": "column",
            "name": {
              "kind": "identifier",
              "name": "name",
            },
          },
          {
            "alias": null,
            "kind": "column",
            "name": {
              "kind": "identifier",
              "name": "age",
            },
          },
        ],
        "kind": "insert",
        "output": null,
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
        "values": {
          "kind": "values",
          "values": [
            {
              "kind": "literal",
              "type": "string",
              "value": "Alice",
            },
            {
              "kind": "literal",
              "type": "number",
              "value": 30,
            },
          ],
        },
      }
    `);
  });

  it("parses an insert with output clause", () => {
    const sql =
      "INSERT INTO [dbo].[users] (name, age) OUTPUT inserted.id VALUES ('Bob', 25);";
    const result = parseInsertStatement(sql);
    expect(result.output).toMatchInlineSnapshot(`
      [
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
      ]
    `);
  });

  it("parses an insert with a generated id", () => {
    const sql =
      "INSERT INTO [dbo].[users] (name, age, id) VALUES ('Charlie', 40, NEWID());";
    const result = parseInsertStatement(sql);
    expect(result.values.values).toMatchInlineSnapshot(`
      [
        {
          "kind": "literal",
          "type": "string",
          "value": "Charlie",
        },
        {
          "kind": "literal",
          "type": "number",
          "value": 40,
        },
        {
          "args": [],
          "kind": "function",
          "name": "newid",
        },
      ]
    `);
  });
});
