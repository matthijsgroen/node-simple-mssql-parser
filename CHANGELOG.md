# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.2]
### Fixed
- Package notation for usage

## [1.0.1]
### Added
- Support for parsing MSSQL `INSERT` statements and traversing their AST.
- Improved AST traversal utility to support all node kinds, including new ones for `INSERT`.
- GitHub Actions workflow for linting, testing, and building on PRs and main branch.
- Enhanced README with usage examples for both SELECT and INSERT statements.
- Rich package metadata for npm and GitHub.

### Changed
- Uniform formatting and improved documentation in README.

## [1.0.0] - 2025-07-09
### Added
- Initial release: parse MSSQL `SELECT` statements to AST.
- AST traversal utility for SELECT queries.
- Basic support for WHERE, GROUP BY, ORDER BY, JOIN, OFFSET, LIMIT, and functions like COUNT(*).
- TypeScript types for all AST nodes.
