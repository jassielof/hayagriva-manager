# Hayagriva Manager

A Zotero-like manager for Hayagriva, built with Svelte. It allows you to manage multiple Hayagriva bibliographies locally (in your browser).

## Functional Requirements

### Client-side Only

All operations are performed in the browser; no server-side components.

### Bibliography Management

- CRUD operations on bibliographies.
- Each bibliography is a collection of entries in Hayagriva YAML format.

### Entry Management

- CRUD operations within a bibliography.
- Validate entries against the Hayagriva schema.
- Support for setting custom ID patterns for entries, if specified, otherwise, it should default to a sane default, such as `TypeAuthorYearTitle`.

### Import/Export

- Import/export bibliographies in YAML format.
- Export backup of all bibliographies.

### Search & Filter

- Search, filter, and sort entries by fields (e.g., author, year, title).

## Non-Functional Requirements

### Local Storage

- Use browser's IndexedDB for persistent client-side storage (internally stored as JSON).

### UI/UX

- Responsive and user-friendly design.
- Fast performance for typical bibliography sizes.
- Dark mode support.
- Keyboard shortcuts for common actions.
- Accessibility features (e.g., ARIA roles, keyboard navigation).

### PWA

- Optional offline support and installability.
