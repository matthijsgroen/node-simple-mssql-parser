import { parse } from './mssql-parser';
import { StatementNode } from './types';

export const parseMSSQLStatement = (query: string): StatementNode => {
  try {
    return parse(query);
  } catch (error) {
    console.error('Parsing error:', error);
    throw error;
  }
}