# Placement Intelligence — Frontend

React + Vite + Tailwind CSS frontend for the Campus Placement Intelligence System FastAPI backend.

## Stack

- React 18 + React Router 6
- Tailwind CSS (dark glassmorphism theme)
- Axios (JWT access/refresh token handling, auto-retry on 401)
- lucide-react icons

## Setup

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173` and expects the FastAPI backend at
`http://localhost:8000` (configurable in `.env` via `VITE_API_BASE_URL`).

Make sure your backend has CORS enabled for `http://localhost:5173`, e.g. in `main.py`:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Folder structure

```
src/
  api/            axios instance + endpoint wrappers (auth, students, companies)
  context/        AuthContext — JWT session, login/logout, profile hydration
  components/     Sidebar, Navbar, MobileDrawer, GlassCard, ReadinessGauge, ProtectedRoute…
  layouts/        DashboardLayout (sidebar + responsive shell)
  pages/
    Login.jsx / Register.jsx
    DashboardHome.jsx     role-aware overview switcher
    student/              Profile, Resume upload, Recommendations, Eligibility check
    admin/                Student & Company CRUD management
    company/               Listing management, eligible-students view
```

## Notes on the backend contract

- `/login` expects `application/x-www-form-urlencoded` (`username`, `password`) per
  `OAuth2PasswordRequestForm` — handled in `src/api/auth.js`.
- Access tokens are short-lived (30 min); the axios interceptor auto-refreshes using
  `/refresh_tokens` on a 401 and retries the original request once.
- The `Companies` model isn't scoped to a `user_id` in the current backend endpoints
  (`insert_company` doesn't set it), so the Company dashboard treats the first company
  record as "your" listing. Once the backend scopes companies to their owning user, swap
  the `companies[0]` lookups in `pages/company/*` for a real filter.
- Role gating is enforced both by hiding nav items and by `ProtectedRoute`'s
  `allowedRoles` prop, but the backend's `roles_required` dependency remains the source
  of truth for authorization.
