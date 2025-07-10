# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2025-07-10
### Added
- Added support for update statements

## [1.1.0] - 2025-07-10
### Added
- Added `prettyPrint` to print pieces of the AST

## [1.0.4] - 2025-07-10
### Fixed
- Add support for `IS NULL` 

## [1.0.3] - 2025-07-10
### Fixed
- Improve nested condition parsing
- Add support for `IS NULL` and `IS NOT NULL` conditions
- Add support for inequality conditions `<>`

## [1.0.2] - 2025-07-10
### Fixed
- Package notation for usage

## [1.0.1] - 2025-07-10
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
