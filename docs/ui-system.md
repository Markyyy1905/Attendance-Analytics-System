# Interface system

The interface is a staff-facing attendance analytics workspace for desktop review, with a responsive layout for smaller screens.

- **Canvas:** near-black charcoal; raised dark surfaces use subtle borders to separate work areas.
- **Primary color:** TalaTrack blue for navigation, primary actions, links, focus, and trend highlights.
- **Status colors:** bright green for present, coral red for absent, amber for late. Status letters and accessible labels accompany color.
- **Type:** DM Sans for interface text and Manrope for headings and measured values.
- **Shape:** 8-14px control and panel corners, thin dividers, restrained shadows.
- **Data tables:** tabular numerals, sticky student column for wide attendance matrices, horizontal overflow on small screens.
- **Page styles:** feature pages keep a local CSS file beside the page component; `shared/styles/global.css` owns reusable tokens and primitives.
- **Responsive behavior:** desktop sidebar collapses to a menu drawer; wide tables remain scrollable; page actions wrap and summary columns reflow.
- **Task surfaces:** staff-account creation and class assignment use a dedicated Staff & access page with inline form and assignment controls. Routine management actions do not open a popup; chart data tables use accessible inline disclosures.
- **First-run state:** when no students are stored, overview, attendance, roster, analytics, class workspace, and empty student-profile routes share a clear Upload CSV action.

Risk flags always include text. Every analytics chart must have a readable data-table equivalent and state its scope and denominator. Use blue for descriptive and projection charts; retain semantic status colors for attendance states.
