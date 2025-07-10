import { describe, expect, it } from "vitest";
import { prettyPrint } from "./pretty-print";
import { parseMSSQLStatement, SelectStatementNode } from ".";

describe(prettyPrint, () => {
  it("formats a simple select statement", () => {
    const sql = `SELECT foo FROM [dbo].[bar] WHERE baz = 'qux';`;
    const ast = parseMSSQLStatement(sql);

    const result = prettyPrint(ast);
    expect(result).toBe("SELECT foo FROM [dbo].[bar] WHERE baz = 'qux';");
  });

  it("formats null conditions", () => {
    const sql = `SELECT foo FROM [dbo].[bar] WHERE baz is null or qux is not null;`;
    const ast = parseMSSQLStatement(sql);

    const result = prettyPrint(ast);
    expect(result).toBe(
      "SELECT foo FROM [dbo].[bar] WHERE baz IS NULL OR qux IS NOT NULL;",
    );
  });

  it("formats joins", () => {
    const sql = `SeLeCT foo.bar, COUNT(bar.stuff) as likes frOM [dbo].[bar] foo left join [dbo].[oink] bar on bar.message_id = foo.message_id;`;
    const ast = parseMSSQLStatement(sql) as SelectStatementNode;

    const result = prettyPrint(ast);
    expect(result).toBe(
      "SELECT foo.bar, COUNT(bar.stuff) AS likes FROM [dbo].[bar] foo LEFT OUTER JOIN [dbo].[oink] bar ON bar.message_id = foo.message_id;",
    );
  });

  it("formats group by, limit, top", () => {
    const sql = `
       SeLeCT foo.bar, COUNT(bar.stuff) as likes frOM [dbo].[bar] foo left join [dbo].[oink] bar 
       on bar.message_id = foo.message_id group by foo.bar order
       by likes offset 0 rows fetch
       next @amount 
       rows only;`;
    const ast = parseMSSQLStatement(sql) as SelectStatementNode;

    const result = prettyPrint(ast);
    expect(result).toBe(
      "SELECT foo.bar, COUNT(bar.stuff) AS likes FROM [dbo].[bar] foo " +
        "LEFT OUTER JOIN [dbo].[oink] bar ON bar.message_id = foo.message_id " +
        "GROUP BY foo.bar " +
        "ORDER BY likes ASC " +
        "OFFSET 0 ROWS " +
        "FETCH NEXT @amount ROWS ONLY;",
    );
  });

  it("formats wildcards", () => {
    const sql = `SELECT * FROM [dbo].[bar];`;
    const ast = parseMSSQLStatement(sql) as SelectStatementNode;
    const result = prettyPrint(ast);
    expect(result).toBe("SELECT * FROM [dbo].[bar];");
  });

  it("formats insert statements", () => {
    const sql = `INSERT INTO [dbo].[users] (name, age)   VALUES     (    'Alice',     30);`;
    const ast = parseMSSQLStatement(sql);
    const result = prettyPrint(ast);
    expect(result).toBe(
      "INSERT INTO [dbo].[users] (name, age) VALUES ('Alice', 30);",
    );
  });

  it("formats insert statements with output clause", () => {
    const sql = `INSERT INTO [dbo].[users] (name, age) OUTPUT inserted.id, inserted.age VALUES ('Alice', 30);`;
    const ast = parseMSSQLStatement(sql);
    const result = prettyPrint(ast);
    expect(result).toBe(
      "INSERT INTO [dbo].[users] (name, age) OUTPUT inserted.id, inserted.age VALUES ('Alice', 30);",
    );
  });

  it("formats update statements", () => {
    const sql = `UPDATE [dbo].[users] SET name = 'Alice', age = 30 WHERE id = @id;`;
    const ast = parseMSSQLStatement(sql);
    const result = prettyPrint(ast);
    expect(result).toBe(
      "UPDATE [dbo].[users] SET name = 'Alice', age = 30 WHERE id = @id;",
    );
  });

  it("formats update statements with output clause", () => {
    const sql = `UPDATE [dbo].[users] SET name = 'Alice', age = 30 OUTPUT inserted.id, inserted.age WHERE id = @id;`;
    const ast = parseMSSQLStatement(sql);
    const result = prettyPrint(ast);
    expect(result).toBe(
      "UPDATE [dbo].[users] SET name = 'Alice', age = 30 OUTPUT inserted.id, inserted.age WHERE id = @id;",
    );
  });
});
