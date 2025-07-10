import { describe, expect, it } from "vitest";
import { traverse } from "./traverse";
import { StatementNode } from "./types";

describe("traverse", () => {
  it("visits all nodes in a simple select statement", () => {
    const ast: StatementNode = {
      kind: "select",
      select: [
        {
          kind: "select-source",
          source: {
            kind: "column",
            name: { kind: "identifier", name: "foo" },
            alias: null,
          },
          alias: null,
        },
      ],
      from: {
        kind: "table",
        db: { kind: "identifier", name: "dbo" },
        table: { kind: "identifier", name: "bar" },
        alias: null,
      },
      joins: null,
      where: null,
      groupBy: null,
      orderBy: null,
      offset: null,
      limit: null,
    };

    const visited: string[] = [];
    traverse(ast, {
      enter(node) {
        if (node.kind && typeof node.kind === "string") {
          visited.push(node.kind);
        }
      },
    });
    expect(visited).toEqual([
      "select",
      "select-source",
      "column",
      "identifier",
      "table",
      "identifier",
      "identifier",
    ]);
  });

  it("allows filtering columns", () => {
    const ast: StatementNode = {
      kind: "select",
      select: [
        {
          kind: "select-source",
          source: {
            kind: "column",
            name: { kind: "identifier", name: "foo" },
            alias: null,
          },
          alias: null,
        },
        {
          kind: "select-source",
          source: {
            kind: "column",
            name: { kind: "identifier", name: "bar" },
            alias: null,
          },
          alias: null,
        },
      ],
      from: {
        kind: "table",
        db: { kind: "identifier", name: "dbo" },
        table: { kind: "identifier", name: "baz" },
        alias: null,
      },
      joins: null,
      where: null,
      groupBy: null,
      orderBy: null,
      offset: null,
      limit: null,
    };

    const columns: string[] = [];
    traverse(ast, {
      enter(node) {
        if (node.kind === "column") {
          columns.push(node.name.name);
        }
      },
    });
    expect(columns).toEqual(["foo", "bar"]);
  });

  it("visits all nodes in an insert statement", () => {
    const ast: StatementNode = {
      kind: "insert",
      target: {
        kind: "table",
        db: { kind: "identifier", name: "dbo" },
        table: { kind: "identifier", name: "users" },
        alias: null,
      },
      columns: [
        {
          kind: "column",
          name: { kind: "identifier", name: "name" },
          alias: null,
        },
        {
          kind: "column",
          name: { kind: "identifier", name: "age" },
          alias: null,
        },
      ],
      values: {
        kind: "values",
        values: [
          { kind: "literal", type: "string", value: "Alice" },
          { kind: "literal", type: "number", value: 30 },
        ],
      },
      output: null,
    };

    const visitedNodes: string[] = [];
    traverse(ast, {
      enter(node) {
        visitedNodes.push(node.kind);
      },
    });

    expect(visitedNodes).toEqual([
      "insert",
      "table",
      "identifier",
      "identifier",
      "column",
      "identifier",
      "column",
      "identifier",
      "values",
      "literal",
      "literal",
    ]);
  });
});
