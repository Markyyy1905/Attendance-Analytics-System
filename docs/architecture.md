# Architecture

ClassPulse uses a hybrid feature-oriented architecture. Route and provider concerns live in `src/app`. Shared visual primitives live in `src/components`. Each domain feature owns its pages and query hooks under `src/features`. Mock records are kept in `src/mocks` and accessed through `src/services/api` so UI components do not own data fixtures.

The intended data flow is:

`Page -> feature hook -> TanStack Query -> API service -> backend`

Zustand is intentionally limited to client state such as role, sidebar visibility, and theme. Local component state handles isolated controls.
