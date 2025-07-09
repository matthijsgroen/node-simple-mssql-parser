"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  parseMSSQLStatement: () => parseMSSQLStatement
});
module.exports = __toCommonJS(index_exports);

// src/mssql-parser.js
var peg$SyntaxError = class extends SyntaxError {
  constructor(message, expected, found, location) {
    super(message);
    this.expected = expected;
    this.found = found;
    this.location = location;
    this.name = "SyntaxError";
  }
  format(sources) {
    let str = "Error: " + this.message;
    if (this.location) {
      let src = null;
      const st = sources.find((s2) => s2.source === this.location.source);
      if (st) {
        src = st.text.split(/\r\n|\n|\r/g);
      }
      const s = this.location.start;
      const offset_s = this.location.source && typeof this.location.source.offset === "function" ? this.location.source.offset(s) : s;
      const loc = this.location.source + ":" + offset_s.line + ":" + offset_s.column;
      if (src) {
        const e = this.location.end;
        const filler = "".padEnd(offset_s.line.toString().length, " ");
        const line = src[s.line - 1];
        const last = s.line === e.line ? e.column : line.length + 1;
        const hatLen = last - s.column || 1;
        str += "\n --> " + loc + "\n" + filler + " |\n" + offset_s.line + " | " + line + "\n" + filler + " | " + "".padEnd(s.column - 1, " ") + "".padEnd(hatLen, "^");
      } else {
        str += "\n at " + loc;
      }
    }
    return str;
  }
  static buildMessage(expected, found) {
    function hex(ch) {
      return ch.codePointAt(0).toString(16).toUpperCase();
    }
    const nonPrintable = Object.prototype.hasOwnProperty.call(RegExp.prototype, "unicode") ? new RegExp("[\\p{C}\\p{Mn}\\p{Mc}]", "gu") : null;
    function unicodeEscape(s) {
      if (nonPrintable) {
        return s.replace(nonPrintable, (ch) => "\\u{" + hex(ch) + "}");
      }
      return s;
    }
    function literalEscape(s) {
      return unicodeEscape(s.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\0/g, "\\0").replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/[\x00-\x0F]/g, (ch) => "\\x0" + hex(ch)).replace(/[\x10-\x1F\x7F-\x9F]/g, (ch) => "\\x" + hex(ch)));
    }
    function classEscape(s) {
      return unicodeEscape(s.replace(/\\/g, "\\\\").replace(/\]/g, "\\]").replace(/\^/g, "\\^").replace(/-/g, "\\-").replace(/\0/g, "\\0").replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/[\x00-\x0F]/g, (ch) => "\\x0" + hex(ch)).replace(/[\x10-\x1F\x7F-\x9F]/g, (ch) => "\\x" + hex(ch)));
    }
    const DESCRIBE_EXPECTATION_FNS = {
      literal(expectation) {
        return '"' + literalEscape(expectation.text) + '"';
      },
      class(expectation) {
        const escapedParts = expectation.parts.map(
          (part) => Array.isArray(part) ? classEscape(part[0]) + "-" + classEscape(part[1]) : classEscape(part)
        );
        return "[" + (expectation.inverted ? "^" : "") + escapedParts.join("") + "]" + (expectation.unicode ? "u" : "");
      },
      any() {
        return "any character";
      },
      end() {
        return "end of input";
      },
      other(expectation) {
        return expectation.description;
      }
    };
    function describeExpectation(expectation) {
      return DESCRIBE_EXPECTATION_FNS[expectation.type](expectation);
    }
    function describeExpected(expected2) {
      const descriptions = expected2.map(describeExpectation);
      descriptions.sort();
      if (descriptions.length > 0) {
        let j = 1;
        for (let i = 1; i < descriptions.length; i++) {
          if (descriptions[i - 1] !== descriptions[i]) {
            descriptions[j] = descriptions[i];
            j++;
          }
        }
        descriptions.length = j;
      }
      switch (descriptions.length) {
        case 1:
          return descriptions[0];
        case 2:
          return descriptions[0] + " or " + descriptions[1];
        default:
          return descriptions.slice(0, -1).join(", ") + ", or " + descriptions[descriptions.length - 1];
      }
    }
    function describeFound(found2) {
      return found2 ? '"' + literalEscape(found2) + '"' : "end of input";
    }
    return "Expected " + describeExpected(expected) + " but " + describeFound(found) + " found.";
  }
};
function peg$parse(input, options) {
  options = options !== void 0 ? options : {};
  const peg$FAILED = {};
  const peg$source = options.grammarSource;
  const peg$startRuleFunctions = {
    sql: peg$parsesql
  };
  let peg$startRuleFunction = peg$parsesql;
  const peg$c0 = "select";
  const peg$c1 = "from";
  const peg$c2 = ";";
  const peg$c3 = ",";
  const peg$c4 = "as";
  const peg$c5 = ".";
  const peg$c6 = "*";
  const peg$c7 = "[";
  const peg$c8 = "].[";
  const peg$c9 = "]";
  const peg$c10 = "COUNT(";
  const peg$c11 = ")";
  const peg$c12 = "inner";
  const peg$c13 = "left";
  const peg$c14 = "outer";
  const peg$c15 = "right";
  const peg$c16 = "join";
  const peg$c17 = "on";
  const peg$c18 = "where";
  const peg$c19 = "group";
  const peg$c20 = "by";
  const peg$c21 = "order";
  const peg$c22 = "asc";
  const peg$c23 = "desc";
  const peg$c24 = "(";
  const peg$c25 = "and";
  const peg$c26 = "or";
  const peg$c27 = "=";
  const peg$c28 = "offset";
  const peg$c29 = "rows";
  const peg$c30 = "fetch";
  const peg$c31 = "next";
  const peg$c32 = "only";
  const peg$c33 = "@";
  const peg$c34 = "null";
  const peg$c35 = "'";
  const peg$r0 = /^[A-Za-z_]/;
  const peg$r1 = /^[0-9]/;
  const peg$r2 = /^[^']/;
  const peg$r3 = /^[A-Za-z0-9_]/;
  const peg$r4 = /^[ \t\n]/;
  const peg$e0 = peg$literalExpectation("select", true);
  const peg$e1 = peg$literalExpectation("from", true);
  const peg$e2 = peg$literalExpectation(";", false);
  const peg$e3 = peg$literalExpectation(",", false);
  const peg$e4 = peg$literalExpectation("as", true);
  const peg$e5 = peg$literalExpectation(".", false);
  const peg$e6 = peg$literalExpectation("*", false);
  const peg$e7 = peg$literalExpectation("[", false);
  const peg$e8 = peg$literalExpectation("].[", false);
  const peg$e9 = peg$literalExpectation("]", false);
  const peg$e10 = peg$literalExpectation("COUNT(", false);
  const peg$e11 = peg$literalExpectation(")", false);
  const peg$e12 = peg$literalExpectation("inner", true);
  const peg$e13 = peg$literalExpectation("left", true);
  const peg$e14 = peg$literalExpectation("outer", true);
  const peg$e15 = peg$literalExpectation("right", true);
  const peg$e16 = peg$literalExpectation("join", true);
  const peg$e17 = peg$literalExpectation("on", true);
  const peg$e18 = peg$literalExpectation("where", true);
  const peg$e19 = peg$literalExpectation("group", true);
  const peg$e20 = peg$literalExpectation("by", true);
  const peg$e21 = peg$literalExpectation("order", true);
  const peg$e22 = peg$literalExpectation("asc", true);
  const peg$e23 = peg$literalExpectation("desc", true);
  const peg$e24 = peg$literalExpectation("(", false);
  const peg$e25 = peg$literalExpectation("and", true);
  const peg$e26 = peg$literalExpectation("or", true);
  const peg$e27 = peg$literalExpectation("=", false);
  const peg$e28 = peg$literalExpectation("offset", true);
  const peg$e29 = peg$literalExpectation("rows", true);
  const peg$e30 = peg$literalExpectation("fetch", true);
  const peg$e31 = peg$literalExpectation("next", true);
  const peg$e32 = peg$literalExpectation("only", true);
  const peg$e33 = peg$literalExpectation("@", false);
  const peg$e34 = peg$classExpectation([["A", "Z"], ["a", "z"], "_"], false, false, false);
  const peg$e35 = peg$literalExpectation("null", true);
  const peg$e36 = peg$classExpectation([["0", "9"]], false, false, false);
  const peg$e37 = peg$literalExpectation("'", false);
  const peg$e38 = peg$classExpectation(["'"], true, false, false);
  const peg$e39 = peg$classExpectation([["A", "Z"], ["a", "z"], ["0", "9"], "_"], false, false, false);
  const peg$e40 = peg$otherExpectation("whitespace");
  const peg$e41 = peg$classExpectation([" ", "	", "\n"], false, false, false);
  function peg$f0(st) {
    return st;
  }
  function peg$f1(select, from, joins, where, groupBy, orderBy, offset2, limit) {
    return { kind: "select", select, from, joins, where, groupBy, orderBy, offset: offset2, limit };
  }
  function peg$f2(source, alias) {
    return { kind: "select-source", source, alias };
  }
  function peg$f3(source) {
    return { kind: "select-source", source, alias: null };
  }
  function peg$f4(alias, column) {
    return { kind: "column", alias, column };
  }
  function peg$f5(column) {
    return { kind: "column", alias: null, column };
  }
  function peg$f6() {
    return { kind: "literal", type: "wildcard" };
  }
  function peg$f7(table, alias) {
    return { kind: "table", db: table.db, table: table.table, alias };
  }
  function peg$f8(table) {
    return table;
  }
  function peg$f9(table) {
    return { kind: "table", db: table.db, table: table.table, alias: null };
  }
  function peg$f10(db, table) {
    return { db, table };
  }
  function peg$f11(column) {
    return { kind: "function", name: "count", args: [column] };
  }
  function peg$f12(column) {
    return column;
  }
  function peg$f13() {
    return "inner";
  }
  function peg$f14() {
    return "left outer";
  }
  function peg$f15() {
    return "right outer";
  }
  function peg$f16(type, source, c) {
    return c;
  }
  function peg$f17(type, source, condition) {
    return {
      kind: "join",
      type: type ?? "inner",
      source,
      condition
    };
  }
  function peg$f18(c) {
    return { kind: "where", condition: c };
  }
  function peg$f19(c) {
    return c;
  }
  function peg$f20(c) {
    return c;
  }
  function peg$f21() {
    return "asc";
  }
  function peg$f22() {
    return "desc";
  }
  function peg$f23(c, d) {
    return d;
  }
  function peg$f24(c, direction) {
    return { kind: "order", column: c, direction: direction ?? "asc" };
  }
  function peg$f25(c) {
    return c;
  }
  function peg$f26(left, right) {
    return { kind: "condition", type: "and", left, right };
  }
  function peg$f27(left, right) {
    return { kind: "condition", type: "or", left, right };
  }
  function peg$f28(left, right) {
    return { kind: "condition", left, right, type: "equality" };
  }
  function peg$f29(input2) {
    return { kind: "offset", rows: input2 };
  }
  function peg$f30(input2) {
    return { kind: "limit", rows: input2 };
  }
  function peg$f31(input2) {
    return { kind: "input", identifier: input2 };
  }
  function peg$f32() {
    return { kind: "literal", type: "null" };
  }
  function peg$f33(n) {
    return { kind: "literal", type: "number", value: parseInt(n) };
  }
  function peg$f34(value) {
    return { kind: "literal", type: "string", value };
  }
  function peg$f35() {
    return { kind: "identifier", name: text() };
  }
  let peg$currPos = options.peg$currPos | 0;
  let peg$savedPos = peg$currPos;
  const peg$posDetailsCache = [{ line: 1, column: 1 }];
  let peg$maxFailPos = peg$currPos;
  let peg$maxFailExpected = options.peg$maxFailExpected || [];
  let peg$silentFails = options.peg$silentFails | 0;
  let peg$result;
  if (options.startRule) {
    if (!(options.startRule in peg$startRuleFunctions)) {
      throw new Error(`Can't start parsing from rule "` + options.startRule + '".');
    }
    peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
  }
  function text() {
    return input.substring(peg$savedPos, peg$currPos);
  }
  function offset() {
    return peg$savedPos;
  }
  function range() {
    return {
      source: peg$source,
      start: peg$savedPos,
      end: peg$currPos
    };
  }
  function location() {
    return peg$computeLocation(peg$savedPos, peg$currPos);
  }
  function expected(description, location2) {
    location2 = location2 !== void 0 ? location2 : peg$computeLocation(peg$savedPos, peg$currPos);
    throw peg$buildStructuredError(
      [peg$otherExpectation(description)],
      input.substring(peg$savedPos, peg$currPos),
      location2
    );
  }
  function error(message, location2) {
    location2 = location2 !== void 0 ? location2 : peg$computeLocation(peg$savedPos, peg$currPos);
    throw peg$buildSimpleError(message, location2);
  }
  function peg$getUnicode(pos = peg$currPos) {
    const cp = input.codePointAt(pos);
    if (cp === void 0) {
      return "";
    }
    return String.fromCodePoint(cp);
  }
  function peg$literalExpectation(text2, ignoreCase) {
    return { type: "literal", text: text2, ignoreCase };
  }
  function peg$classExpectation(parts, inverted, ignoreCase, unicode) {
    return { type: "class", parts, inverted, ignoreCase, unicode };
  }
  function peg$anyExpectation() {
    return { type: "any" };
  }
  function peg$endExpectation() {
    return { type: "end" };
  }
  function peg$otherExpectation(description) {
    return { type: "other", description };
  }
  function peg$computePosDetails(pos) {
    let details = peg$posDetailsCache[pos];
    let p;
    if (details) {
      return details;
    } else {
      if (pos >= peg$posDetailsCache.length) {
        p = peg$posDetailsCache.length - 1;
      } else {
        p = pos;
        while (!peg$posDetailsCache[--p]) {
        }
      }
      details = peg$posDetailsCache[p];
      details = {
        line: details.line,
        column: details.column
      };
      while (p < pos) {
        if (input.charCodeAt(p) === 10) {
          details.line++;
          details.column = 1;
        } else {
          details.column++;
        }
        p++;
      }
      peg$posDetailsCache[pos] = details;
      return details;
    }
  }
  function peg$computeLocation(startPos, endPos, offset2) {
    const startPosDetails = peg$computePosDetails(startPos);
    const endPosDetails = peg$computePosDetails(endPos);
    const res = {
      source: peg$source,
      start: {
        offset: startPos,
        line: startPosDetails.line,
        column: startPosDetails.column
      },
      end: {
        offset: endPos,
        line: endPosDetails.line,
        column: endPosDetails.column
      }
    };
    if (offset2 && peg$source && typeof peg$source.offset === "function") {
      res.start = peg$source.offset(res.start);
      res.end = peg$source.offset(res.end);
    }
    return res;
  }
  function peg$fail(expected2) {
    if (peg$currPos < peg$maxFailPos) {
      return;
    }
    if (peg$currPos > peg$maxFailPos) {
      peg$maxFailPos = peg$currPos;
      peg$maxFailExpected = [];
    }
    peg$maxFailExpected.push(expected2);
  }
  function peg$buildSimpleError(message, location2) {
    return new peg$SyntaxError(message, null, null, location2);
  }
  function peg$buildStructuredError(expected2, found, location2) {
    return new peg$SyntaxError(
      peg$SyntaxError.buildMessage(expected2, found),
      expected2,
      found,
      location2
    );
  }
  function peg$parsesql() {
    let s0, s1, s2, s3;
    s0 = peg$currPos;
    s1 = peg$parseWS();
    if (s1 === peg$FAILED) {
      s1 = null;
    }
    s2 = peg$parseselect();
    if (s2 !== peg$FAILED) {
      s3 = peg$parseWS();
      if (s3 === peg$FAILED) {
        s3 = null;
      }
      peg$savedPos = s0;
      s0 = peg$f0(s2);
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    return s0;
  }
  function peg$parseselect() {
    let s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14;
    s0 = peg$currPos;
    s1 = input.substr(peg$currPos, 6);
    if (s1.toLowerCase() === peg$c0) {
      peg$currPos += 6;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e0);
      }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parseWS();
      if (s2 !== peg$FAILED) {
        s3 = peg$parseselection();
        if (s3 !== peg$FAILED) {
          s4 = peg$parseWS();
          if (s4 !== peg$FAILED) {
            s5 = input.substr(peg$currPos, 4);
            if (s5.toLowerCase() === peg$c1) {
              peg$currPos += 4;
            } else {
              s5 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$e1);
              }
            }
            if (s5 !== peg$FAILED) {
              s6 = peg$parseWS();
              if (s6 !== peg$FAILED) {
                s7 = peg$parsetable_source();
                if (s7 !== peg$FAILED) {
                  s8 = peg$parsejoins();
                  if (s8 === peg$FAILED) {
                    s8 = null;
                  }
                  s9 = peg$parsewhere();
                  if (s9 === peg$FAILED) {
                    s9 = null;
                  }
                  s10 = peg$parsegroup();
                  if (s10 === peg$FAILED) {
                    s10 = null;
                  }
                  s11 = peg$parseorder();
                  if (s11 === peg$FAILED) {
                    s11 = null;
                  }
                  s12 = peg$parseoffset();
                  if (s12 === peg$FAILED) {
                    s12 = null;
                  }
                  s13 = peg$parselimit();
                  if (s13 === peg$FAILED) {
                    s13 = null;
                  }
                  if (input.charCodeAt(peg$currPos) === 59) {
                    s14 = peg$c2;
                    peg$currPos++;
                  } else {
                    s14 = peg$FAILED;
                    if (peg$silentFails === 0) {
                      peg$fail(peg$e2);
                    }
                  }
                  if (s14 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s0 = peg$f1(s3, s7, s8, s9, s10, s11, s12, s13);
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    return s0;
  }
  function peg$parseselection() {
    let s0, s1, s2, s3, s4, s5;
    s0 = peg$currPos;
    s1 = [];
    s2 = peg$parseselect_statement();
    while (s2 !== peg$FAILED) {
      s1.push(s2);
      s2 = peg$currPos;
      s3 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 44) {
        s4 = peg$c3;
        peg$currPos++;
      } else {
        s4 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$e3);
        }
      }
      if (s4 !== peg$FAILED) {
        s5 = peg$parseWS();
        if (s5 !== peg$FAILED) {
          s4 = [s4, s5];
          s3 = s4;
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
      } else {
        peg$currPos = s3;
        s3 = peg$FAILED;
      }
      if (s3 !== peg$FAILED) {
        s3 = peg$parseselect_statement();
        if (s3 === peg$FAILED) {
          peg$currPos = s2;
          s2 = peg$FAILED;
        } else {
          s2 = s3;
        }
      } else {
        s2 = s3;
      }
    }
    if (s1.length < 1) {
      peg$currPos = s0;
      s0 = peg$FAILED;
    } else {
      s0 = s1;
    }
    return s0;
  }
  function peg$parseselect_statement() {
    let s0, s1, s2, s3, s4, s5;
    s0 = peg$currPos;
    s1 = peg$parseselect_source();
    if (s1 !== peg$FAILED) {
      s2 = peg$parseWS();
      if (s2 !== peg$FAILED) {
        s3 = input.substr(peg$currPos, 2);
        if (s3.toLowerCase() === peg$c4) {
          peg$currPos += 2;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$e4);
          }
        }
        if (s3 !== peg$FAILED) {
          s4 = peg$parseWS();
          if (s4 !== peg$FAILED) {
            s5 = peg$parseidentifier();
            if (s5 !== peg$FAILED) {
              peg$savedPos = s0;
              s0 = peg$f2(s1, s5);
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    if (s0 === peg$FAILED) {
      s0 = peg$currPos;
      s1 = peg$parseselect_source();
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$f3(s1);
      }
      s0 = s1;
    }
    return s0;
  }
  function peg$parsecolumn_name() {
    let s0, s1, s2, s3;
    s0 = peg$currPos;
    s1 = peg$parseidentifier();
    if (s1 !== peg$FAILED) {
      if (input.charCodeAt(peg$currPos) === 46) {
        s2 = peg$c5;
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$e5);
        }
      }
      if (s2 !== peg$FAILED) {
        s3 = peg$parseidentifier();
        if (s3 !== peg$FAILED) {
          peg$savedPos = s0;
          s0 = peg$f4(s1, s3);
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    if (s0 === peg$FAILED) {
      s0 = peg$currPos;
      s1 = peg$parseidentifier();
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$f5(s1);
      }
      s0 = s1;
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 42) {
          s1 = peg$c6;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$e6);
          }
        }
        if (s1 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$f6();
        }
        s0 = s1;
      }
    }
    return s0;
  }
  function peg$parsetable_source_alias() {
    let s0, s1, s2, s3;
    s0 = peg$currPos;
    s1 = peg$parsetable_name();
    if (s1 !== peg$FAILED) {
      s2 = peg$parseWS();
      if (s2 !== peg$FAILED) {
        s3 = peg$parseidentifier();
        if (s3 !== peg$FAILED) {
          peg$savedPos = s0;
          s0 = peg$f7(s1, s3);
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    return s0;
  }
  function peg$parsetable_source() {
    let s0, s1;
    s0 = peg$currPos;
    s1 = peg$parsetable_source_alias();
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$f8(s1);
    }
    s0 = s1;
    if (s0 === peg$FAILED) {
      s0 = peg$currPos;
      s1 = peg$parsetable_name();
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$f9(s1);
      }
      s0 = s1;
    }
    return s0;
  }
  function peg$parsetable_name() {
    let s0, s1, s2, s3, s4, s5;
    s0 = peg$currPos;
    if (input.charCodeAt(peg$currPos) === 91) {
      s1 = peg$c7;
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e7);
      }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parseidentifier();
      if (s2 !== peg$FAILED) {
        if (input.substr(peg$currPos, 3) === peg$c8) {
          s3 = peg$c8;
          peg$currPos += 3;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$e8);
          }
        }
        if (s3 !== peg$FAILED) {
          s4 = peg$parseidentifier();
          if (s4 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 93) {
              s5 = peg$c9;
              peg$currPos++;
            } else {
              s5 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$e9);
              }
            }
            if (s5 !== peg$FAILED) {
              peg$savedPos = s0;
              s0 = peg$f10(s2, s4);
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    return s0;
  }
  function peg$parseselect_source() {
    let s0, s1, s2, s3;
    s0 = peg$currPos;
    if (input.substr(peg$currPos, 6) === peg$c10) {
      s1 = peg$c10;
      peg$currPos += 6;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e10);
      }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parsecolumn_name();
      if (s2 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 41) {
          s3 = peg$c11;
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$e11);
          }
        }
        if (s3 !== peg$FAILED) {
          peg$savedPos = s0;
          s0 = peg$f11(s2);
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    if (s0 === peg$FAILED) {
      s0 = peg$currPos;
      s1 = peg$parsecolumn_name();
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$f12(s1);
      }
      s0 = s1;
    }
    return s0;
  }
  function peg$parsejoins() {
    let s0, s1;
    s0 = [];
    s1 = peg$parsejoin();
    if (s1 !== peg$FAILED) {
      while (s1 !== peg$FAILED) {
        s0.push(s1);
        s1 = peg$parsejoin();
      }
    } else {
      s0 = peg$FAILED;
    }
    return s0;
  }
  function peg$parsejoinType() {
    let s0, s1, s2, s3, s4;
    s0 = peg$currPos;
    s1 = input.substr(peg$currPos, 5);
    if (s1.toLowerCase() === peg$c12) {
      peg$currPos += 5;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e12);
      }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parseWS();
      if (s2 !== peg$FAILED) {
        peg$savedPos = s0;
        s0 = peg$f13();
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    if (s0 === peg$FAILED) {
      s0 = peg$currPos;
      s1 = input.substr(peg$currPos, 4);
      if (s1.toLowerCase() === peg$c13) {
        peg$currPos += 4;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$e13);
        }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$currPos;
        s3 = peg$parseWS();
        if (s3 !== peg$FAILED) {
          s4 = input.substr(peg$currPos, 5);
          if (s4.toLowerCase() === peg$c14) {
            peg$currPos += 5;
          } else {
            s4 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$e14);
            }
          }
          if (s4 !== peg$FAILED) {
            s3 = [s3, s4];
            s2 = s3;
          } else {
            peg$currPos = s2;
            s2 = peg$FAILED;
          }
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 === peg$FAILED) {
          s2 = null;
        }
        s3 = peg$parseWS();
        if (s3 !== peg$FAILED) {
          peg$savedPos = s0;
          s0 = peg$f14();
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = input.substr(peg$currPos, 5);
        if (s1.toLowerCase() === peg$c15) {
          peg$currPos += 5;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$e15);
          }
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$currPos;
          s3 = peg$parseWS();
          if (s3 !== peg$FAILED) {
            s4 = input.substr(peg$currPos, 5);
            if (s4.toLowerCase() === peg$c14) {
              peg$currPos += 5;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$e14);
              }
            }
            if (s4 !== peg$FAILED) {
              s3 = [s3, s4];
              s2 = s3;
            } else {
              peg$currPos = s2;
              s2 = peg$FAILED;
            }
          } else {
            peg$currPos = s2;
            s2 = peg$FAILED;
          }
          if (s2 === peg$FAILED) {
            s2 = null;
          }
          s3 = peg$parseWS();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s0 = peg$f15();
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      }
    }
    return s0;
  }
  function peg$parsejoin() {
    let s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10;
    s0 = peg$currPos;
    s1 = peg$parseWS();
    if (s1 !== peg$FAILED) {
      s2 = peg$parsejoinType();
      if (s2 === peg$FAILED) {
        s2 = null;
      }
      s3 = input.substr(peg$currPos, 4);
      if (s3.toLowerCase() === peg$c16) {
        peg$currPos += 4;
      } else {
        s3 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$e16);
        }
      }
      if (s3 !== peg$FAILED) {
        s4 = peg$parseWS();
        if (s4 !== peg$FAILED) {
          s5 = peg$parsetable_source_alias();
          if (s5 !== peg$FAILED) {
            s6 = peg$currPos;
            s7 = peg$parseWS();
            if (s7 !== peg$FAILED) {
              s8 = input.substr(peg$currPos, 2);
              if (s8.toLowerCase() === peg$c17) {
                peg$currPos += 2;
              } else {
                s8 = peg$FAILED;
                if (peg$silentFails === 0) {
                  peg$fail(peg$e17);
                }
              }
              if (s8 !== peg$FAILED) {
                s9 = peg$parseWS();
                if (s9 !== peg$FAILED) {
                  s10 = peg$parseequality_condition();
                  if (s10 !== peg$FAILED) {
                    peg$savedPos = s6;
                    s6 = peg$f16(s2, s5, s10);
                  } else {
                    peg$currPos = s6;
                    s6 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s6;
                  s6 = peg$FAILED;
                }
              } else {
                peg$currPos = s6;
                s6 = peg$FAILED;
              }
            } else {
              peg$currPos = s6;
              s6 = peg$FAILED;
            }
            if (s6 === peg$FAILED) {
              s6 = null;
            }
            peg$savedPos = s0;
            s0 = peg$f17(s2, s5, s6);
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    return s0;
  }
  function peg$parsewhere() {
    let s0, s1, s2, s3, s4;
    s0 = peg$currPos;
    s1 = peg$parseWS();
    if (s1 !== peg$FAILED) {
      s2 = input.substr(peg$currPos, 5);
      if (s2.toLowerCase() === peg$c18) {
        peg$currPos += 5;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$e18);
        }
      }
      if (s2 !== peg$FAILED) {
        s3 = peg$parseWS();
        if (s3 !== peg$FAILED) {
          s4 = peg$parseconditions();
          if (s4 !== peg$FAILED) {
            peg$savedPos = s0;
            s0 = peg$f18(s4);
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    return s0;
  }
  function peg$parsegroup() {
    let s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11;
    s0 = peg$currPos;
    s1 = peg$parseWS();
    if (s1 !== peg$FAILED) {
      s2 = input.substr(peg$currPos, 5);
      if (s2.toLowerCase() === peg$c19) {
        peg$currPos += 5;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$e19);
        }
      }
      if (s2 !== peg$FAILED) {
        s3 = peg$parseWS();
        if (s3 !== peg$FAILED) {
          s4 = input.substr(peg$currPos, 2);
          if (s4.toLowerCase() === peg$c20) {
            peg$currPos += 2;
          } else {
            s4 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$e20);
            }
          }
          if (s4 !== peg$FAILED) {
            s5 = peg$parseWS();
            if (s5 !== peg$FAILED) {
              s6 = peg$currPos;
              s7 = [];
              s8 = peg$parsecolumn_name();
              while (s8 !== peg$FAILED) {
                s7.push(s8);
                s8 = peg$currPos;
                s9 = peg$currPos;
                if (input.charCodeAt(peg$currPos) === 44) {
                  s10 = peg$c3;
                  peg$currPos++;
                } else {
                  s10 = peg$FAILED;
                  if (peg$silentFails === 0) {
                    peg$fail(peg$e3);
                  }
                }
                if (s10 !== peg$FAILED) {
                  s11 = peg$parseWS();
                  if (s11 !== peg$FAILED) {
                    s10 = [s10, s11];
                    s9 = s10;
                  } else {
                    peg$currPos = s9;
                    s9 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s9;
                  s9 = peg$FAILED;
                }
                if (s9 !== peg$FAILED) {
                  s9 = peg$parsecolumn_name();
                  if (s9 === peg$FAILED) {
                    peg$currPos = s8;
                    s8 = peg$FAILED;
                  } else {
                    s8 = s9;
                  }
                } else {
                  s8 = s9;
                }
              }
              if (s7.length < 1) {
                peg$currPos = s6;
                s6 = peg$FAILED;
              } else {
                s6 = s7;
              }
              if (s6 !== peg$FAILED) {
                peg$savedPos = s0;
                s0 = peg$f19(s6);
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    return s0;
  }
  function peg$parseorder() {
    let s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11;
    s0 = peg$currPos;
    s1 = peg$parseWS();
    if (s1 !== peg$FAILED) {
      s2 = input.substr(peg$currPos, 5);
      if (s2.toLowerCase() === peg$c21) {
        peg$currPos += 5;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$e21);
        }
      }
      if (s2 !== peg$FAILED) {
        s3 = peg$parseWS();
        if (s3 !== peg$FAILED) {
          s4 = input.substr(peg$currPos, 2);
          if (s4.toLowerCase() === peg$c20) {
            peg$currPos += 2;
          } else {
            s4 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$e20);
            }
          }
          if (s4 !== peg$FAILED) {
            s5 = peg$parseWS();
            if (s5 !== peg$FAILED) {
              s6 = peg$currPos;
              s7 = [];
              s8 = peg$parsecolumn_sorting();
              while (s8 !== peg$FAILED) {
                s7.push(s8);
                s8 = peg$currPos;
                s9 = peg$currPos;
                if (input.charCodeAt(peg$currPos) === 44) {
                  s10 = peg$c3;
                  peg$currPos++;
                } else {
                  s10 = peg$FAILED;
                  if (peg$silentFails === 0) {
                    peg$fail(peg$e3);
                  }
                }
                if (s10 !== peg$FAILED) {
                  s11 = peg$parseWS();
                  if (s11 !== peg$FAILED) {
                    s10 = [s10, s11];
                    s9 = s10;
                  } else {
                    peg$currPos = s9;
                    s9 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s9;
                  s9 = peg$FAILED;
                }
                if (s9 !== peg$FAILED) {
                  s9 = peg$parsecolumn_sorting();
                  if (s9 === peg$FAILED) {
                    peg$currPos = s8;
                    s8 = peg$FAILED;
                  } else {
                    s8 = s9;
                  }
                } else {
                  s8 = s9;
                }
              }
              if (s7.length < 1) {
                peg$currPos = s6;
                s6 = peg$FAILED;
              } else {
                s6 = s7;
              }
              if (s6 !== peg$FAILED) {
                peg$savedPos = s0;
                s0 = peg$f20(s6);
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    return s0;
  }
  function peg$parseorderDirection() {
    let s0, s1;
    s0 = peg$currPos;
    s1 = input.substr(peg$currPos, 3);
    if (s1.toLowerCase() === peg$c22) {
      peg$currPos += 3;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e22);
      }
    }
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$f21();
    }
    s0 = s1;
    if (s0 === peg$FAILED) {
      s0 = peg$currPos;
      s1 = input.substr(peg$currPos, 4);
      if (s1.toLowerCase() === peg$c23) {
        peg$currPos += 4;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$e23);
        }
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$f22();
      }
      s0 = s1;
    }
    return s0;
  }
  function peg$parsecolumn_sorting() {
    let s0, s1, s2, s3, s4;
    s0 = peg$currPos;
    s1 = peg$parsecolumn_name();
    if (s1 !== peg$FAILED) {
      s2 = peg$currPos;
      s3 = peg$parseWS();
      if (s3 !== peg$FAILED) {
        s4 = peg$parseorderDirection();
        if (s4 !== peg$FAILED) {
          peg$savedPos = s2;
          s2 = peg$f23(s1, s4);
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
      } else {
        peg$currPos = s2;
        s2 = peg$FAILED;
      }
      if (s2 === peg$FAILED) {
        s2 = null;
      }
      peg$savedPos = s0;
      s0 = peg$f24(s1, s2);
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    return s0;
  }
  function peg$parseconditions() {
    let s0, s1, s2, s3, s4, s5;
    s0 = peg$currPos;
    if (input.charCodeAt(peg$currPos) === 40) {
      s1 = peg$c24;
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e24);
      }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parseWS();
      if (s2 === peg$FAILED) {
        s2 = null;
      }
      s3 = peg$parseconditions();
      if (s3 !== peg$FAILED) {
        s4 = peg$parseWS();
        if (s4 === peg$FAILED) {
          s4 = null;
        }
        if (input.charCodeAt(peg$currPos) === 41) {
          s5 = peg$c11;
          peg$currPos++;
        } else {
          s5 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$e11);
          }
        }
        if (s5 !== peg$FAILED) {
          peg$savedPos = s0;
          s0 = peg$f25(s3);
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    if (s0 === peg$FAILED) {
      s0 = peg$currPos;
      s1 = peg$parseequality_condition();
      if (s1 !== peg$FAILED) {
        s2 = peg$parseWS();
        if (s2 !== peg$FAILED) {
          s3 = input.substr(peg$currPos, 3);
          if (s3.toLowerCase() === peg$c25) {
            peg$currPos += 3;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$e25);
            }
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parseWS();
            if (s4 !== peg$FAILED) {
              s5 = peg$parseconditions();
              if (s5 !== peg$FAILED) {
                peg$savedPos = s0;
                s0 = peg$f26(s1, s5);
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$parseequality_condition();
        if (s1 !== peg$FAILED) {
          s2 = peg$parseWS();
          if (s2 !== peg$FAILED) {
            s3 = input.substr(peg$currPos, 2);
            if (s3.toLowerCase() === peg$c26) {
              peg$currPos += 2;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$e26);
              }
            }
            if (s3 !== peg$FAILED) {
              s4 = peg$parseWS();
              if (s4 !== peg$FAILED) {
                s5 = peg$parseconditions();
                if (s5 !== peg$FAILED) {
                  peg$savedPos = s0;
                  s0 = peg$f27(s1, s5);
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        if (s0 === peg$FAILED) {
          s0 = peg$parseequality_condition();
        }
      }
    }
    return s0;
  }
  function peg$parseequality_condition() {
    let s0, s1, s2, s3, s4, s5;
    s0 = peg$currPos;
    s1 = peg$parsecolumn_name();
    if (s1 !== peg$FAILED) {
      s2 = peg$parseWS();
      if (s2 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 61) {
          s3 = peg$c27;
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$e27);
          }
        }
        if (s3 !== peg$FAILED) {
          s4 = peg$parseWS();
          if (s4 !== peg$FAILED) {
            s5 = peg$parseliteral();
            if (s5 === peg$FAILED) {
              s5 = peg$parseinput();
              if (s5 === peg$FAILED) {
                s5 = peg$parsecolumn_name();
              }
            }
            if (s5 !== peg$FAILED) {
              peg$savedPos = s0;
              s0 = peg$f28(s1, s5);
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    return s0;
  }
  function peg$parseoffset() {
    let s0, s1, s2, s3, s4, s5, s6;
    s0 = peg$currPos;
    s1 = peg$parseWS();
    if (s1 !== peg$FAILED) {
      s2 = input.substr(peg$currPos, 6);
      if (s2.toLowerCase() === peg$c28) {
        peg$currPos += 6;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$e28);
        }
      }
      if (s2 !== peg$FAILED) {
        s3 = peg$parseWS();
        if (s3 !== peg$FAILED) {
          s4 = peg$parseinput();
          if (s4 === peg$FAILED) {
            s4 = peg$parsenumber();
          }
          if (s4 !== peg$FAILED) {
            s5 = peg$parseWS();
            if (s5 !== peg$FAILED) {
              s6 = input.substr(peg$currPos, 4);
              if (s6.toLowerCase() === peg$c29) {
                peg$currPos += 4;
              } else {
                s6 = peg$FAILED;
                if (peg$silentFails === 0) {
                  peg$fail(peg$e29);
                }
              }
              if (s6 !== peg$FAILED) {
                peg$savedPos = s0;
                s0 = peg$f29(s4);
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    return s0;
  }
  function peg$parselimit() {
    let s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10;
    s0 = peg$currPos;
    s1 = peg$parseWS();
    if (s1 !== peg$FAILED) {
      s2 = input.substr(peg$currPos, 5);
      if (s2.toLowerCase() === peg$c30) {
        peg$currPos += 5;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$e30);
        }
      }
      if (s2 !== peg$FAILED) {
        s3 = peg$parseWS();
        if (s3 !== peg$FAILED) {
          s4 = input.substr(peg$currPos, 4);
          if (s4.toLowerCase() === peg$c31) {
            peg$currPos += 4;
          } else {
            s4 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$e31);
            }
          }
          if (s4 !== peg$FAILED) {
            s5 = peg$parseWS();
            if (s5 !== peg$FAILED) {
              s6 = peg$parseinput();
              if (s6 === peg$FAILED) {
                s6 = peg$parsenumber();
              }
              if (s6 !== peg$FAILED) {
                s7 = peg$parseWS();
                if (s7 !== peg$FAILED) {
                  s8 = input.substr(peg$currPos, 4);
                  if (s8.toLowerCase() === peg$c29) {
                    peg$currPos += 4;
                  } else {
                    s8 = peg$FAILED;
                    if (peg$silentFails === 0) {
                      peg$fail(peg$e29);
                    }
                  }
                  if (s8 !== peg$FAILED) {
                    s9 = peg$parseWS();
                    if (s9 !== peg$FAILED) {
                      s10 = input.substr(peg$currPos, 4);
                      if (s10.toLowerCase() === peg$c32) {
                        peg$currPos += 4;
                      } else {
                        s10 = peg$FAILED;
                        if (peg$silentFails === 0) {
                          peg$fail(peg$e32);
                        }
                      }
                      if (s10 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s0 = peg$f30(s6);
                      } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    return s0;
  }
  function peg$parseinput() {
    let s0, s1, s2, s3, s4;
    s0 = peg$currPos;
    if (input.charCodeAt(peg$currPos) === 64) {
      s1 = peg$c33;
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e33);
      }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$currPos;
      s3 = [];
      s4 = input.charAt(peg$currPos);
      if (peg$r0.test(s4)) {
        peg$currPos++;
      } else {
        s4 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$e34);
        }
      }
      if (s4 !== peg$FAILED) {
        while (s4 !== peg$FAILED) {
          s3.push(s4);
          s4 = input.charAt(peg$currPos);
          if (peg$r0.test(s4)) {
            peg$currPos++;
          } else {
            s4 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$e34);
            }
          }
        }
      } else {
        s3 = peg$FAILED;
      }
      if (s3 !== peg$FAILED) {
        s2 = input.substring(s2, peg$currPos);
      } else {
        s2 = s3;
      }
      if (s2 !== peg$FAILED) {
        peg$savedPos = s0;
        s0 = peg$f31(s2);
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    return s0;
  }
  function peg$parseliteral() {
    let s0;
    s0 = peg$parsenull();
    if (s0 === peg$FAILED) {
      s0 = peg$parsenumber();
      if (s0 === peg$FAILED) {
        s0 = peg$parsestring();
      }
    }
    return s0;
  }
  function peg$parsenull() {
    let s0, s1;
    s0 = peg$currPos;
    s1 = input.substr(peg$currPos, 4);
    if (s1.toLowerCase() === peg$c34) {
      peg$currPos += 4;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e35);
      }
    }
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$f32();
    }
    s0 = s1;
    return s0;
  }
  function peg$parsenumber() {
    let s0, s1, s2, s3;
    s0 = peg$currPos;
    s1 = peg$currPos;
    s2 = [];
    s3 = input.charAt(peg$currPos);
    if (peg$r1.test(s3)) {
      peg$currPos++;
    } else {
      s3 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e36);
      }
    }
    if (s3 !== peg$FAILED) {
      while (s3 !== peg$FAILED) {
        s2.push(s3);
        s3 = input.charAt(peg$currPos);
        if (peg$r1.test(s3)) {
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$e36);
          }
        }
      }
    } else {
      s2 = peg$FAILED;
    }
    if (s2 !== peg$FAILED) {
      s1 = input.substring(s1, peg$currPos);
    } else {
      s1 = s2;
    }
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$f33(s1);
    }
    s0 = s1;
    return s0;
  }
  function peg$parsestring() {
    let s0, s1, s2, s3, s4;
    s0 = peg$currPos;
    if (input.charCodeAt(peg$currPos) === 39) {
      s1 = peg$c35;
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e37);
      }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$currPos;
      s3 = [];
      s4 = input.charAt(peg$currPos);
      if (peg$r2.test(s4)) {
        peg$currPos++;
      } else {
        s4 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$e38);
        }
      }
      if (s4 !== peg$FAILED) {
        while (s4 !== peg$FAILED) {
          s3.push(s4);
          s4 = input.charAt(peg$currPos);
          if (peg$r2.test(s4)) {
            peg$currPos++;
          } else {
            s4 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$e38);
            }
          }
        }
      } else {
        s3 = peg$FAILED;
      }
      if (s3 !== peg$FAILED) {
        s2 = input.substring(s2, peg$currPos);
      } else {
        s2 = s3;
      }
      if (s2 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 39) {
          s3 = peg$c35;
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$e37);
          }
        }
        if (s3 !== peg$FAILED) {
          peg$savedPos = s0;
          s0 = peg$f34(s2);
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    return s0;
  }
  function peg$parseidentifier() {
    let s0, s1, s2, s3, s4;
    s0 = peg$currPos;
    s1 = peg$currPos;
    peg$silentFails++;
    s2 = peg$parsekeyword();
    peg$silentFails--;
    if (s2 === peg$FAILED) {
      s1 = void 0;
    } else {
      peg$currPos = s1;
      s1 = peg$FAILED;
    }
    if (s1 !== peg$FAILED) {
      s2 = input.charAt(peg$currPos);
      if (peg$r0.test(s2)) {
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$e34);
        }
      }
      if (s2 !== peg$FAILED) {
        s3 = [];
        s4 = input.charAt(peg$currPos);
        if (peg$r3.test(s4)) {
          peg$currPos++;
        } else {
          s4 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$e39);
          }
        }
        while (s4 !== peg$FAILED) {
          s3.push(s4);
          s4 = input.charAt(peg$currPos);
          if (peg$r3.test(s4)) {
            peg$currPos++;
          } else {
            s4 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$e39);
            }
          }
        }
        peg$savedPos = s0;
        s0 = peg$f35();
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    return s0;
  }
  function peg$parsekeyword() {
    let s0;
    s0 = input.substr(peg$currPos, 5);
    if (s0.toLowerCase() === peg$c18) {
      peg$currPos += 5;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e18);
      }
    }
    if (s0 === peg$FAILED) {
      s0 = input.substr(peg$currPos, 4);
      if (s0.toLowerCase() === peg$c1) {
        peg$currPos += 4;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$e1);
        }
      }
      if (s0 === peg$FAILED) {
        s0 = input.substr(peg$currPos, 4);
        if (s0.toLowerCase() === peg$c16) {
          peg$currPos += 4;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$e16);
          }
        }
        if (s0 === peg$FAILED) {
          s0 = input.substr(peg$currPos, 5);
          if (s0.toLowerCase() === peg$c19) {
            peg$currPos += 5;
          } else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$e19);
            }
          }
          if (s0 === peg$FAILED) {
            s0 = input.substr(peg$currPos, 6);
            if (s0.toLowerCase() === peg$c28) {
              peg$currPos += 6;
            } else {
              s0 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$e28);
              }
            }
            if (s0 === peg$FAILED) {
              s0 = input.substr(peg$currPos, 5);
              if (s0.toLowerCase() === peg$c30) {
                peg$currPos += 5;
              } else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) {
                  peg$fail(peg$e30);
                }
              }
              if (s0 === peg$FAILED) {
                s0 = input.substr(peg$currPos, 4);
                if (s0.toLowerCase() === peg$c31) {
                  peg$currPos += 4;
                } else {
                  s0 = peg$FAILED;
                  if (peg$silentFails === 0) {
                    peg$fail(peg$e31);
                  }
                }
                if (s0 === peg$FAILED) {
                  s0 = input.substr(peg$currPos, 5);
                  if (s0.toLowerCase() === peg$c21) {
                    peg$currPos += 5;
                  } else {
                    s0 = peg$FAILED;
                    if (peg$silentFails === 0) {
                      peg$fail(peg$e21);
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    return s0;
  }
  function peg$parseWS() {
    let s0, s1;
    peg$silentFails++;
    s0 = [];
    s1 = input.charAt(peg$currPos);
    if (peg$r4.test(s1)) {
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e41);
      }
    }
    if (s1 !== peg$FAILED) {
      while (s1 !== peg$FAILED) {
        s0.push(s1);
        s1 = input.charAt(peg$currPos);
        if (peg$r4.test(s1)) {
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$e41);
          }
        }
      }
    } else {
      s0 = peg$FAILED;
    }
    peg$silentFails--;
    if (s0 === peg$FAILED) {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$e40);
      }
    }
    return s0;
  }
  peg$result = peg$startRuleFunction();
  const peg$success = peg$result !== peg$FAILED && peg$currPos === input.length;
  function peg$throw() {
    if (peg$result !== peg$FAILED && peg$currPos < input.length) {
      peg$fail(peg$endExpectation());
    }
    throw peg$buildStructuredError(
      peg$maxFailExpected,
      peg$maxFailPos < input.length ? peg$getUnicode(peg$maxFailPos) : null,
      peg$maxFailPos < input.length ? peg$computeLocation(peg$maxFailPos, peg$maxFailPos + 1) : peg$computeLocation(peg$maxFailPos, peg$maxFailPos)
    );
  }
  if (options.peg$library) {
    return (
      /** @type {any} */
      {
        peg$result,
        peg$currPos,
        peg$FAILED,
        peg$maxFailExpected,
        peg$maxFailPos,
        peg$success,
        peg$throw: peg$success ? void 0 : peg$throw
      }
    );
  }
  if (peg$success) {
    return peg$result;
  } else {
    peg$throw();
  }
}
module.exports = {
  StartRules: ["sql"],
  SyntaxError: peg$SyntaxError,
  parse: peg$parse
};

// src/index.ts
var parseMSSQLStatement = (query) => {
  try {
    return (void 0)(query);
  } catch (error) {
    console.error("Parsing error:", error);
    throw error;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  parseMSSQLStatement
});
//# sourceMappingURL=index.cjs.map