# Changelog

All notable changes to this project will be documented in this file.

## [0.2.0] - 2026-01-02

### Added

- **Pixel Garden Tracker**: A custom-built, modular activity heatmap component (`GardenTracker.jsx`).
- **Growth Levels**: Implemented visual "levels" for post frequency:
  - _Sprout_: 1 post (Light Emerald)
  - _Planted_: 2 posts (Medium Emerald + Shadow)
  - _Lush_: 3+ posts (Dark Emerald + Glow effect)
- **Dynamic Grid**: Implemented horizontal expansion logic using CSS Grid `grid-flow-col`.
- **Future Indicator**: Added a dashed-border "Next Step" circle to encourage daily posting.

### Changed

- **Library Layout**: Refactored the Library page to include a `w-fit` centered tracker for a more "Mochi-style" aesthetic.
- **Data Logic**: Migrated from `react-calendar-heatmap` library to a manual React-based mapping for better performance and Tailwind v4 compatibility.

### Fixed

- **Timezone Mismatch**: Resolved issue where `toISOString()` caused posts to appear on the wrong day in the tracker.
- **Date Calculation**: Fixed a `TypeError` when calling `getDate()` on string-formatted timestamps.
- **Layout Collapse**: Fixed a bug where the heatmap container would collapse to 0px height in Flexbox layouts.

---

## [0.1.0] - 2025-12-30

- Initial release of the "Digital Space" blog.
- Basic CRUD functionality for posts via Admin Dashboard.
- Markdown support and Tailwind v4 integration.
