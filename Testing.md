# Testing Strategy - MzansiBuilds

## Testing Approach

Due to time constraints of the Derivco Code Skills Challenge, I performed manual testing rather than automated unit tests. The following testing was conducted:

### Manual Testing Performed

| Feature | Test Cases | Result |
|---------|------------|--------|
| User Authentication | Signup, login, logout, protected routes | ✅ Pass |
| Create Project | Valid/invalid inputs, required fields | ✅ Pass |
| Edit Project | Owner only, non-owner redirected | ✅ Pass |
| Delete Project | With confirmation, cascade delete | ✅ Pass |
| Comments | Add, like, delete own comments | ✅ Pass |
| Raise Hand | Toggle on/off, count updates | ✅ Pass |
| Milestones | Add, delete, timeline order | ✅ Pass |
| Celebration Wall | Shows completed/shipped projects | ✅ Pass |

### Edge Cases Tested

- Submitting empty forms → validation errors shown
- Editing someone else's project → redirect with error
- Deleting content → confirmation dialog appears
- Unauthenticated access → redirect to login
- Real-time updates → multiple browser windows tested

### Future Testing Improvements

- Unit tests with Jest + React Testing Library
- Integration tests for Firebase operations
- E2E tests with Cypress