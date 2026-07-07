# Campus Placements — Frontend

A React (Vite) frontend for your FastAPI Campus Placements backend. Covers all three roles —
student, company, admin — against the routes in `main.py`.

## What's inside

- **Public**: landing page, login, register (student/company self sign-up).
- **Student**: dashboard, editable profile + resume upload (auto-fills skills), job board with
  apply, application tracker, ranked recommendations, and an eligibility checker — all built
  around a "readiness dial" gauge that mirrors the backend's own scoring bands (Needs
  Improvement / Average / Placement Ready).
- **Company**: dashboard, editable company record (minimum CGPA + required skills), post/view
  roles, review & update applicant status (with filter), browse eligible students.
- **Admin**: dashboard, manage student & company records (edit/delete), create student/company/
  admin accounts.

## Setup

```bash
cd frontend
npm install
cp .env.example .env
```

Edit `.env` and point `VITE_API_URL` at your running FastAPI backend (no trailing slash):

```
VITE_API_URL=http://127.0.0.1:8000
```

Then run it:

```bash
npm run dev
```

Open the printed local URL (usually `http://localhost:5173`).

## Connecting to your backend

Two things to check on the backend side:

1. **CORS** — `main.py` already allows `http://localhost:5173`, so the default Vite port works
   out of the box. If you change the frontend's port, add it to the `allow_origins` list in
   `main.py`.
2. **Login endpoint** — `/login` expects `application/x-www-form-urlencoded` with `username` and
   `password` fields (FastAPI's `OAuth2PasswordRequestForm`). The frontend already sends the
   user's email as `username`, since that's what your backend looks up.

## How registration works, end to end

`/register` only takes a name, email, password, and role, so a self-registered student/company
starts with placeholder values (`registration_number` / `company_code` = `"TEMP"`, CGPA/skills
empty). After signing in, the dashboard shows a banner prompting them to finish their record on
the Profile page — that's the `PUT /students/{id}` or `PUT /company/{id}` call. Registration
numbers and company codes can only be set by an admin, via **Add a Record** in the admin section,
which calls `/admin/create-student` and `/admin/create-company` directly.

## Notes on a couple of backend quirs worth knowing

- `PUT /students/{id}` and `PUT /company/{id}` take the **record's own `id`**, not the user id —
  the frontend fetches `/student/me` or `/company/me` first to get the right id before saving.
- Skills and required-skills are stored as one comma-separated string on the backend. The chip
  inputs in this frontend read/write that same format, so nothing needs to change server-side.

## Build for production

```bash
npm run build
```

Outputs static files to `dist/`, ready to deploy anywhere that serves static sites (Vercel,
Netlify, etc.) — just set `VITE_API_URL` as an environment variable at build time to your deployed
backend URL.
