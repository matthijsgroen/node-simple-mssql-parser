import { describe, it, expect } from "vitest";
import { parseMSSQLStatement } from "./index";

describe("parsing select statements", () => {
  it("parses a simple select statement", () => {
    const sql = "SELECT * FROM [dbo].[users];";
    const result = parseMSSQLStatement(sql);
    expect(result).toMatchInlineSnapshot(`
          {
            "from": {
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
            "groupBy": null,
            "joins": null,
            "kind": "select",
            "limit": null,
            "offset": null,
            "orderBy": null,
            "select": [
              {
                "alias": null,
                "kind": "select-source",
                "source": {
                  "kind": "literal",
                  "type": "wildcard",
                },
              },
            ],
            "where": null,
          }
        `);
  });

  describe("selection clause", () => {
    it("parses a selection clause with multiple columns", () => {
      const sql = "SELECT id, name FROM [dbo].[users];";
      const result = parseMSSQLStatement(sql);
      expect(result.select).toMatchInlineSnapshot(`
              [
                {
                  "alias": null,
                  "kind": "select-source",
                  "source": {
                    "alias": null,
                    "column": {
                      "kind": "identifier",
                      "name": "id",
                    },
                    "kind": "column",
                  },
                },
                {
                  "alias": null,
                  "kind": "select-source",
                  "source": {
                    "alias": null,
                    "column": {
                      "kind": "identifier",
                      "name": "name",
                    },
                    "kind": "column",
                  },
                },
              ]
            `);
    });

    it("parses a selection clause columns from aliases", () => {
      const sql = "SELECT users.id, users.name FROM [dbo].[users] users;";
      const result = parseMSSQLStatement(sql);
      expect(result.select).toMatchInlineSnapshot(`
              [
                {
                  "alias": null,
                  "kind": "select-source",
                  "source": {
                    "alias": {
                      "kind": "identifier",
                      "name": "users",
                    },
                    "column": {
                      "kind": "identifier",
                      "name": "id",
                    },
                    "kind": "column",
                  },
                },
                {
                  "alias": null,
                  "kind": "select-source",
                  "source": {
                    "alias": {
                      "kind": "identifier",
                      "name": "users",
                    },
                    "column": {
                      "kind": "identifier",
                      "name": "name",
                    },
                    "kind": "column",
                  },
                },
              ]
            `);
    });

    it("parses a selection clause with an alias", () => {
      const sql = "SELECT id AS user_id FROM [dbo].[users];";
      const result = parseMSSQLStatement(sql);
      expect(result.select).toMatchInlineSnapshot(`
              [
                {
                  "alias": {
                    "kind": "identifier",
                    "name": "user_id",
                  },
                  "kind": "select-source",
                  "source": {
                    "alias": null,
                    "column": {
                      "kind": "identifier",
                      "name": "id",
                    },
                    "kind": "column",
                  },
                },
              ]
            `);
    });

    it("parses a selection clause with a function", () => {
      const sql = "SELECT COUNT(*) FROM [dbo].[users];";
      const result = parseMSSQLStatement(sql);
      expect(result.select).toMatchInlineSnapshot(`
              [
                {
                  "alias": null,
                  "kind": "select-source",
                  "source": {
                    "args": [
                      {
                        "kind": "literal",
                        "type": "wildcard",
                      },
                    ],
                    "kind": "function",
                    "name": "count",
                  },
                },
              ]
            `);
    });

    it("parses a selection clause with a function", () => {
      const sql =
        "SELECT COUNT(message.likes) as num_likes FROM [dbo].[users];";
      const result = parseMSSQLStatement(sql);
      expect(result.select).toMatchInlineSnapshot(`
              [
                {
                  "alias": {
                    "kind": "identifier",
                    "name": "num_likes",
                  },
                  "kind": "select-source",
                  "source": {
                    "args": [
                      {
                        "alias": {
                          "kind": "identifier",
                          "name": "message",
                        },
                        "column": {
                          "kind": "identifier",
                          "name": "likes",
                        },
                        "kind": "column",
                      },
                    ],
                    "kind": "function",
                    "name": "count",
                  },
                },
              ]
            `);
    });
  });

  describe("from clause", () => {
    it("parses a from clause with a table", () => {
      const sql = "SELECT * FROM [dbo].[users];";
      const result = parseMSSQLStatement(sql);
      expect(result.from).toMatchInlineSnapshot(`
              {
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
              }
            `);
    });

    it("parses a from clause with an alias", () => {
      const sql = "SELECT * FROM [dbo].[users] u;";
      const result = parseMSSQLStatement(sql);
      expect(result.from).toMatchInlineSnapshot(`
              {
                "alias": {
                  "kind": "identifier",
                  "name": "u",
                },
                "db": {
                  "kind": "identifier",
                  "name": "dbo",
                },
                "kind": "table",
                "table": {
                  "kind": "identifier",
                  "name": "users",
                },
              }
            `);
    });
  });

  describe("joins", () => {
    it("parses a join clause", () => {
      const sql =
        "SELECT * FROM [dbo].[users] u JOIN [dbo].[posts] p ON u.id = p.user_id;";
      const result = parseMSSQLStatement(sql);
      expect(result.joins).toMatchInlineSnapshot(`
              [
                {
                  "condition": {
                    "kind": "condition",
                    "left": {
                      "alias": {
                        "kind": "identifier",
                        "name": "u",
                      },
                      "column": {
                        "kind": "identifier",
                        "name": "id",
                      },
                      "kind": "column",
                    },
                    "right": {
                      "alias": {
                        "kind": "identifier",
                        "name": "p",
                      },
                      "column": {
                        "kind": "identifier",
                        "name": "user_id",
                      },
                      "kind": "column",
                    },
                    "type": "equality",
                  },
                  "kind": "join",
                  "source": {
                    "alias": {
                      "kind": "identifier",
                      "name": "p",
                    },
                    "db": {
                      "kind": "identifier",
                      "name": "dbo",
                    },
                    "kind": "table",
                    "table": {
                      "kind": "identifier",
                      "name": "posts",
                    },
                  },
                  "type": "inner",
                },
              ]
            `);
    });

    it("parses a left join clause", () => {
      const sql =
        "SELECT * FROM [dbo].[users] u LEFT JOIN [dbo].[posts] p ON u.id = p.user_id;";
      const result = parseMSSQLStatement(sql);
      expect(result.joins).toMatchInlineSnapshot(`
              [
                {
                  "condition": {
                    "kind": "condition",
                    "left": {
                      "alias": {
                        "kind": "identifier",
                        "name": "u",
                      },
                      "column": {
                        "kind": "identifier",
                        "name": "id",
                      },
                      "kind": "column",
                    },
                    "right": {
                      "alias": {
                        "kind": "identifier",
                        "name": "p",
                      },
                      "column": {
                        "kind": "identifier",
                        "name": "user_id",
                      },
                      "kind": "column",
                    },
                    "type": "equality",
                  },
                  "kind": "join",
                  "source": {
                    "alias": {
                      "kind": "identifier",
                      "name": "p",
                    },
                    "db": {
                      "kind": "identifier",
                      "name": "dbo",
                    },
                    "kind": "table",
                    "table": {
                      "kind": "identifier",
                      "name": "posts",
                    },
                  },
                  "type": "left outer",
                },
              ]
            `);
    });

    it("parses a right join clause", () => {
      const sql =
        "SELECT * FROM [dbo].[users] u RIGHT JOIN [dbo].[posts] p ON u.id = p.user_id;";
      const result = parseMSSQLStatement(sql);
      expect(result.joins).toMatchInlineSnapshot(`
              [
                {
                  "condition": {
                    "kind": "condition",
                    "left": {
                      "alias": {
                        "kind": "identifier",
                        "name": "u",
                      },
                      "column": {
                        "kind": "identifier",
                        "name": "id",
                      },
                      "kind": "column",
                    },
                    "right": {
                      "alias": {
                        "kind": "identifier",
                        "name": "p",
                      },
                      "column": {
                        "kind": "identifier",
                        "name": "user_id",
                      },
                      "kind": "column",
                    },
                    "type": "equality",
                  },
                  "kind": "join",
                  "source": {
                    "alias": {
                      "kind": "identifier",
                      "name": "p",
                    },
                    "db": {
                      "kind": "identifier",
                      "name": "dbo",
                    },
                    "kind": "table",
                    "table": {
                      "kind": "identifier",
                      "name": "posts",
                    },
                  },
                  "type": "right outer",
                },
              ]
            `);
    });
  });

  describe("where clause", () => {
    it("parses a where clause with a simple condition", () => {
      const sql = "SELECT * FROM [dbo].[users] WHERE id = null;";
      const result = parseMSSQLStatement(sql);
      expect(result.where).toMatchInlineSnapshot(`
              {
                "condition": {
                  "kind": "condition",
                  "left": {
                    "alias": null,
                    "column": {
                      "kind": "identifier",
                      "name": "id",
                    },
                    "kind": "column",
                  },
                  "right": {
                    "kind": "literal",
                    "type": "null",
                  },
                  "type": "equality",
                },
                "kind": "where",
              }
            `);
    });

    it("parses a where clause with a complex condition", () => {
      const sql =
        "SELECT * FROM [dbo].[users] WHERE id = 5 AND (a.b = @input OR columnName2 = 'hello');";
      const result = parseMSSQLStatement(sql);
      expect(result.where).toMatchInlineSnapshot(`
              {
                "condition": {
                  "kind": "condition",
                  "left": {
                    "kind": "condition",
                    "left": {
                      "alias": null,
                      "column": {
                        "kind": "identifier",
                        "name": "id",
                      },
                      "kind": "column",
                    },
                    "right": {
                      "kind": "literal",
                      "type": "number",
                      "value": 5,
                    },
                    "type": "equality",
                  },
                  "right": {
                    "kind": "condition",
                    "left": {
                      "kind": "condition",
                      "left": {
                        "alias": {
                          "kind": "identifier",
                          "name": "a",
                        },
                        "column": {
                          "kind": "identifier",
                          "name": "b",
                        },
                        "kind": "column",
                      },
                      "right": {
                        "identifier": "input",
                        "kind": "input",
                      },
                      "type": "equality",
                    },
                    "right": {
                      "kind": "condition",
                      "left": {
                        "alias": null,
                        "column": {
                          "kind": "identifier",
                          "name": "columnName2",
                        },
                        "kind": "column",
                      },
                      "right": {
                        "kind": "literal",
                        "type": "string",
                        "value": "hello",
                      },
                      "type": "equality",
                    },
                    "type": "or",
                  },
                  "type": "and",
                },
                "kind": "where",
              }
            `);
    });
  });

  describe("group by clause", () => {
    it("parses a group by clause with a single column", () => {
      const sql = "SELECT * FROM [dbo].[users] GROUP BY id;";
      const result = parseMSSQLStatement(sql);
      expect(result.groupBy).toMatchInlineSnapshot(`
              [
                {
                  "alias": null,
                  "column": {
                    "kind": "identifier",
                    "name": "id",
                  },
                  "kind": "column",
                },
              ]
            `);
    });

    it("parses a group by clause with multiple columns", () => {
      const sql = "SELECT * FROM [dbo].[users] GROUP BY id, name;";
      const result = parseMSSQLStatement(sql);
      expect(result.groupBy).toMatchInlineSnapshot(`
              [
                {
                  "alias": null,
                  "column": {
                    "kind": "identifier",
                    "name": "id",
                  },
                  "kind": "column",
                },
                {
                  "alias": null,
                  "column": {
                    "kind": "identifier",
                    "name": "name",
                  },
                  "kind": "column",
                },
              ]
            `);
    });
  });

  describe("order by clause", () => {
    it("parses an order by clause with a single column", () => {
      const sql = "SELECT * FROM [dbo].[users] ORDER BY id;";
      const result = parseMSSQLStatement(sql);
      expect(result.orderBy).toMatchInlineSnapshot(`
              [
                {
                  "column": {
                    "alias": null,
                    "column": {
                      "kind": "identifier",
                      "name": "id",
                    },
                    "kind": "column",
                  },
                  "direction": "asc",
                  "kind": "order",
                },
              ]
            `);
    });

    it("parses an order by clause with multiple columns", () => {
      const sql = "SELECT * FROM [dbo].[users] ORDER BY id, name DESC;";
      const result = parseMSSQLStatement(sql);
      expect(result.orderBy).toMatchInlineSnapshot(`
              [
                {
                  "column": {
                    "alias": null,
                    "column": {
                      "kind": "identifier",
                      "name": "id",
                    },
                    "kind": "column",
                  },
                  "direction": "asc",
                  "kind": "order",
                },
                {
                  "column": {
                    "alias": null,
                    "column": {
                      "kind": "identifier",
                      "name": "name",
                    },
                    "kind": "column",
                  },
                  "direction": "desc",
                  "kind": "order",
                },
              ]
            `);
    });
  });

  describe("offset and limit", () => {
    it("parses an offset clause", () => {
      const sql = "SELECT * FROM [dbo].[users] OFFSET 10 ROWS;";
      const result = parseMSSQLStatement(sql);
      expect(result.offset).toMatchInlineSnapshot(`
              {
                "kind": "offset",
                "rows": {
                  "kind": "literal",
                  "type": "number",
                  "value": 10,
                },
              }
            `);
    });

    it("parses a limit clause", () => {
      const sql = "SELECT * FROM [dbo].[users] FETCH NEXT 5 ROWS ONLY;";
      const result = parseMSSQLStatement(sql);
      expect(result.limit).toMatchInlineSnapshot(`
              {
                "kind": "limit",
                "rows": {
                  "kind": "literal",
                  "type": "number",
                  "value": 5,
                },
              }
            `);
    });
  });
});
