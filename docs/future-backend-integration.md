# Future Backend Integration

1. Add a typed API client under `src/services/api/client.ts` using `VITE_API_URL`.
2. Replace methods in `mockApi.ts` with endpoint modules while preserving domain return types.
3. Add an authentication provider around the auth layout and persist the current user in a secure session.
4. Keep permission checks in shared navigation as presentation hints only; enforce authorization on the backend.
5. Add upload mutations, report mutations, and notification invalidation through TanStack Query.
