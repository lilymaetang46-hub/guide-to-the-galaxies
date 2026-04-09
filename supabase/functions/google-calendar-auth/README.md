Required secrets for the `google-calendar-auth` Edge Function:

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `PUBLIC_APP_URL`
- optional: `GOOGLE_CALENDAR_SCOPE`

What this function does:

- starts the Google OAuth flow for the signed-in tracker user
- handles the Google OAuth callback
- stores Google access and refresh token data server-side
- updates `calendar_sync_connections` with the connected Google account and default calendar
- can return the user's Google calendar list for the tracker Connections page

Expected Google OAuth redirect URI:

- `https://<your-project-ref>.supabase.co/functions/v1/google-calendar-auth/callback`

Recommended scope for the current implementation:

- `https://www.googleapis.com/auth/calendar`

Why this lives in an Edge Function:

- the Google client secret should never be exposed in the browser
- refresh-token handling belongs on the server side
- later event create, update, and delete sync work can reuse the same token-refresh logic here
