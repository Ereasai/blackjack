# WebSocket deployment proof

A deliberately small Vite frontend and Cloudflare Worker backend. The browser
connects to `/ws`, sends `hello`, and displays the Worker's `echo: hello` reply.

## Local development

Use two terminals from the repository root:

```sh
cd backend
npm ci
npm run dev
```

```sh
cd frontend
npm ci
npm run dev
```

The frontend defaults to `ws://localhost:8787/ws`. To override it, copy
`frontend/.env.example` to `frontend/.env.local` and change
`VITE_BACKEND_WS_URL`.

## One-time deployment setup

1. In Cloudflare, create an API token from the **Edit Cloudflare Workers**
   template, scoped to this account. Ensure the account has a `workers.dev`
   subdomain enabled. No Worker, route, custom domain, Pages project, database,
   or Git integration needs to be created in the dashboard.
2. In GitHub under **Settings → Secrets and variables → Actions**, add these
   repository secrets:
   - `CLOUDFLARE_API_TOKEN`: the API token.
   - `CLOUDFLARE_ACCOUNT_ID`: the Cloudflare account ID.
3. Add this repository variable (it is public configuration, not a secret):
   - `VITE_BACKEND_WS_URL`: `wss://blackjack-backend.<your-workers-subdomain>.workers.dev/ws`

The first successful deploy creates the two Workers named in their checked-in
`wrangler.jsonc` files. Wrangler serves the frontend's built `dist/` directory
as Worker static assets.

## Automatic deployment

Every push to `main` starts two GitHub Actions jobs. The backend job installs,
typechecks, and deploys `blackjack-backend`. In parallel, the frontend job
installs, builds with `VITE_BACKEND_WS_URL`, and deploys
`blackjack-frontend`. Once both finish, the public frontend opens a WebSocket
to the public backend.
