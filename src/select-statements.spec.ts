import { describe, it, expect } from "vitest";
import { parse } from "./mssql-parser"

describe("parsing select statements", () => {
    it("parses a simple select statement", () => {
        const sql = "SELECT * FROM [dbo].[users];";
        const result = parse(sql);
        expect(result).toMatchInlineSnapshot(`
          {
            "from": {
              "alias": null,
              "db": "dbo",
              "table": "users",
              "type": "table",
            },
            "group": null,
            "joins": null,
            "limit": null,
            "offset": null,
            "order": null,
            "select": "*",
            "type": "select",
            "where": null,
          }
        `);
    });
});