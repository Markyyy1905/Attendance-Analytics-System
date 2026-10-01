# Routing

React Router owns the route hierarchy in `src/app/router.tsx`. Auth routes render without the dashboard shell. `/app/*` routes render through `DashboardLayout`, which provides the shared sidebar and top navigation via `Shell`.

Use nested routes for new domain pages. Keep route-level loading and error states in the layout or route module rather than duplicating navigation across pages.
