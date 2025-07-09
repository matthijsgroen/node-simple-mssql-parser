sql
  = WS? st:select WS? { return st }

select
   = "select"i WS select:selection 
     WS "from"i WS from:table_source
     joins:(joins)?
     where:(where)?
     group:(group)?
     order:(order)?
     offset:(offset)?
     limit:(limit)?
     ";"
     { return { type: "select", select, from, joins, where, group, order, offset, limit } }
   
selection 
  = select_statement|1.., "," WS |
  / "*"
   
select_statement 
  = source:select_source WS "as"i WS alias:identifier { return { type: "select_source", source, alias } }
  / source:select_source { return { type: "select_source", source, alias: null } }

column_name
  = alias:identifier "." column:identifier { return { type: "column", alias, column } }
  / column:identifier { return { type: "column", alias: null, column } }
  
table_source_alias
  = table:table_name WS alias:identifier { return { type: "table", db: table.db, table: table.table, alias } }

table_source
  = table:table_source_alias { return table } 
  / table:table_name { return { type: "table", db: table.db, table: table.table, alias: null } }
  
table_name
  = "[" db:identifier "].[" table:identifier "]" { return { db, table } }

select_source
  = column:column_name { return column }
  / "COUNT(" column:column_name ")" { return { type: "function", func: "count", column } }

joins = join+

join = WS left:("left"i WS)? right:("right"i WS)? "join"i
  WS table_source_alias WS "on"i
  WS a:column_name WS "=" WS b:column_name { return { 
    type: "join", 
    direction: left ? "left" : right ? "right" : null,
    left: a, right: b
  } }

where = WS "where"i WS c:condition { return { type: "where", condition:c } }

group = WS "group"i WS "by"i WS c:(column_name|1.., "," WS |) { return { type: "group", columns: c } }

order = WS "order"i WS "by"i WS c:(column_sorting|1.., "," WS |) { return { type: "order", columns: c } }

column_sorting 
  = c:column_name WS d:"desc"i? a:"asc"i? { return { type: "sorting", column: c, direction: d ? "desc" : a ? "asc" : null } }

conditions
  = "(" WS c:conditions WS ")" { return c }
  / a:condition WS "and"i WS b:conditions { return { type: "and", a, b } }
  / a:condition WS "or"i WS b:conditions { return { type: "or", a, b } }
  / condition
  
condition
  = equality_condition
  
equality_condition
  = a:column_name WS "=" WS b:column_name { return { a, b, type: "equality" } }
  / a:column_name WS "=" WS b:literal { return { a, b, type: "equality" } }
  / a:column_name WS "=" WS b:input { return { a, b, type: "equality" } }

offset
  = WS "offset"i WS input:(input / number) WS "rows"i { return { type: "offset", value: input } }

limit
  = WS "fetch"i WS "next"i WS input:(input / number) WS "rows"i WS "only"i { return { type: "limit", value: input } }

input
  = "@" input:$[A-Za-z_]+ { return { type: "input", identifier: input } }

literal
  = null
  / number
  
null
  = "null"i { return { type: "literal", value: "null" } }
  
number
  = n:$[0-9]+ { return { type: "number", value: parseInt(n) } }

identifier
  = $[a-z_]+
  
WS = [ \t\n]+