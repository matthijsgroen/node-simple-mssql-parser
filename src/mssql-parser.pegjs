sql
  = WS? st:select WS? { return st }

select
   = "select"i WS select:selection 
     WS "from"i WS from:table_source
     joins:(joins)?
     where:(where)?
     groupBy:(group)?
     order:(order)?
     offset:(offset)?
     limit:(limit)?
     ";"
     { return { kind: "select", select, from, joins, where, groupBy, order, offset, limit } }
   
selection 
  = select_statement|1.., "," WS |
   
select_statement 
  = source:select_source WS "as"i WS alias:identifier { return { kind: "select-source", source, alias } }
  / source:select_source { return { kind: "select-source", source, alias: null } }

column_name
  = alias:identifier "." column:identifier { return { kind: "column", alias, column } }
  / column:identifier { return { kind: "column", alias: null, column } }
  / "*" { return { kind: "literal", type: "wildcard" } }
  
table_source_alias
  = table:table_name WS alias:identifier { return { kind: "table", db: table.db, table: table.table, alias } }

table_source
  = table:table_source_alias { return table } 
  / table:table_name { return { kind: "table", db: table.db, table: table.table, alias: null } }
  
table_name
  = "[" db:identifier "].[" table:identifier "]" { return { db, table } }

select_source
  = "COUNT(" column:column_name ")" { return { kind: "function", name: "count", args: [column] } }
  / column:column_name { return column }

joins = join+

joinType =
  "inner"i WS { return "inner" }
  / "left"i (WS "outer"i)? WS { return "left outer" }
  / "right"i (WS "outer"i)? WS { return "right outer" }

join = WS type:joinType? "join"i
  WS source:table_source_alias 
  condition:(WS "on"i WS c:condition { return c })? 
  { return { 
    kind: "join", 
    type: type ?? "inner", 
    source,
    condition
  } }

where = WS "where"i WS c:conditions { return { kind: "where", condition:c } }

group = WS "group"i WS "by"i WS c:(column_name|1.., "," WS |) { return { kind: "group-by", columns: c } }

order = WS "order"i WS "by"i WS c:(column_sorting|1.., "," WS |) { return { kind: "order", columns: c } }

column_sorting 
  = c:column_name WS d:"desc"i? a:"asc"i? { return { kind: "sorting", column: c, direction: d ? "desc" : a ? "asc" : null } }

conditions
  = "(" WS? c:conditions WS? ")" { return c }
  / left:condition WS "and"i WS right:conditions { return { kind: "condition", type: "and", left, right } }
  / left:condition WS "or"i WS right:conditions { return { kind: "condition", type: "or", left, right } }
  / condition
  
condition
  = equality_condition
  
equality_condition
  = left:column_name WS "=" WS right:(literal / input / column_name) { return { kind: "condition", left, right, type: "equality" } }

offset
  = WS "offset"i WS input:(input / number) WS "rows"i { return { kind: "offset", rows: input } }

limit
  = WS "fetch"i WS "next"i WS input:(input / number) WS "rows"i WS "only"i { return { kind: "limit", rows: input } }

input
  = "@" input:$[A-Za-z_]+ { return { kind: "input", identifier: input } }

literal
  = null
  / number
  / string
  
null
  = "null"i { return { kind: "literal", type: "null" } }
  
number
  = n:$[0-9]+ { return { kind: "literal", type: "number", value: parseInt(n) } }

string
  = "'" value:$([^']+) "'" { return { kind: "literal", type: "string", value } }

identifier
  = !keyword $[A-Za-z_][A-Za-z0-9_]* { return { kind: "identifier", name: text() } }

keyword
  = "where"i
  / "from"i
  / "join"i
  / "group"i
  / "top"i
  / "next"i

WS "whitespace" = [ \t\n]+