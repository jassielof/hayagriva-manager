# Hayagriva Manager

A Zotero-like manager for Hayagriva. It allows you to manage multiple Hayagriva bibliographies locally (in your browser).

## Technologies

- SvelteKit
- JSDoc
- Bun
- DaisyUI/TailwindCSS
- IndexedDB for local storage

## Functional Requirements

### Client-side Only

All operations are performed in the browser; no server-side components.

### Bibliography Management

- CRUD operations on bibliographies.
- Each bibliography is a collection of entries in Hayagriva YAML format.
- Support for multiple bibliographies.
- Each bibliography:
  - Can be named and managed independently.
  - Can have the following optional metadata, which won't be stored in the YAML file:
    - `title`: Title of the bibliography.
    - `description`: Description of the bibliography.
    - `createdAt`: Timestamp of creation.
    - `updatedAt`: Timestamp of last update.
  - The optional metadata should be editable/displayed in the index page.
  - On first load, the user should be able to create a new bibliography or select an existing one.
  - If a bibliography is imported, the metadata info should be prompted to the user to add it.
  - If no bibliography exists, the user should be prompted to create/import one.
    - Otherwise, the user should be able to select an existing bibliography, while still being able to create/import more.
  - Each bibliography ID will be a unique identifier, which can be used to reference it in the URL (e.g., `/bibliography/:id`).

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
- On the future, it'll be possible to attach files to entries, these won't have any relation with the bibliography file, but will have its relation within the DB, so each entry can possibly have multiple files attached to it.

### PWA

- Optional offline support and installability.
