# Interface system

The interface is a teacher-facing education dashboard for focused desktop review, with a responsive compact layout for smaller screens.

- **Canvas:** soft neutral green-grey; content surfaces stay white with subtle borders.
- **Primary color:** deep leaf green for navigation and primary actions.
- **Status colors:** green for present, red for absent, amber for late. Status letters and accessible labels accompany color.
- **Type:** DM Sans for interface text and Manrope for headings and measured values.
- **Shape:** 8–12px control and panel corners, thin dividers, no decorative blur or heavy shadows.
- **Data tables:** tabular numerals, sticky student column for wide attendance matrices, horizontal overflow on small screens.
- **Page styles:** each feature page keeps a local CSS file beside its page component. `shared/styles/global.css` owns reusable tokens and primitives.
- **Responsive behavior:** desktop sidebar collapses to a menu drawer; wide tables remain scrollable; page actions wrap and summary columns reflow.

Risk flags always include text. The prototype calls out the assumed attendance formula where percentages are shown.
