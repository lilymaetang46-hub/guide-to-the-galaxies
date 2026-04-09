import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

type CalendarSyncConnectionRow = {
  user_id: string;
  provider: string;
  status: string;
  external_calendar_id: string | null;
  external_calendar_name: string | null;
  external_account_email: string | null;
  oauth_state: string | null;
  oauth_state_expires_at: string | null;
  oauth_return_url: string | null;
  sync_appointments: boolean;
  sync_reminders: boolean;
  sync_dated_todos: boolean;
};

type GoogleTokenRow = {
  user_id: string;
  access_token: string;
  refresh_token: string | null;
  expires_at: string | null;
  scope: string | null;
  token_type: string | null;
};

type AppointmentRow = {
  id: number;
  item_type: string;
  created_at: string | null;
  updated_at: string | null;
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const GOOGLE_CLIENT_ID = Deno.env.get("GOOGLE_CLIENT_ID") ?? "";
const GOOGLE_CLIENT_SECRET = Deno.env.get("GOOGLE_CLIENT_SECRET") ?? "";
const GOOGLE_OAUTH_SCOPE =
  Deno.env.get("GOOGLE_CALENDAR_SCOPE") ??
  "https://www.googleapis.com/auth/calendar";
const DEFAULT_PUBLIC_APP_URL =
  Deno.env.get("PUBLIC_APP_URL") ?? "https://guide-to-the-galaxies.app";

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

function buildCallbackUrl(request: Request) {
  const url = new URL(request.url);
  const callbackUrl = new URL(url.toString());

  if (!callbackUrl.pathname.endsWith("/callback")) {
    callbackUrl.pathname = `${callbackUrl.pathname.replace(/\/$/, "")}/callback`;
  }

  callbackUrl.search = "";
  return callbackUrl.toString();
}

function buildAppReturnUrl(rawUrl: string | null | undefined) {
  if (!rawUrl) {
    return DEFAULT_PUBLIC_APP_URL;
  }

  try {
    return new URL(rawUrl).toString();
  } catch {
    return DEFAULT_PUBLIC_APP_URL;
  }
}

function buildAppRedirect(returnUrl: string, status: "success" | "error", detail = "") {
  const url = new URL(buildAppReturnUrl(returnUrl));
  url.searchParams.set("google_calendar_oauth", status);

  if (detail) {
    url.searchParams.set("google_calendar_detail", detail);
  }

  return url.toString();
}

async function getAuthedUser(request: Request) {
  const authHeader = request.headers.get("Authorization");

  if (!authHeader) {
    return { user: null, error: "Missing Authorization header." };
  }

  const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: {
      headers: {
        Authorization: authHeader,
      },
    },
  });

  const {
    data: { user },
    error,
  } = await userClient.auth.getUser();

  if (error || !user) {
    return { user: null, error: "Could not verify the current user." };
  }

  return { user, error: null };
}

async function exchangeCodeForTokens(code: string, redirectUri: string) {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      code,
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.error_description || payload.error || "Could not exchange Google OAuth code.");
  }

  return payload;
}

async function refreshGoogleAccessToken(refreshToken: string) {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.error_description || payload.error || "Could not refresh Google access token.");
  }

  return payload;
}

async function fetchGoogleCalendars(accessToken: string) {
  const response = await fetch("https://www.googleapis.com/calendar/v3/users/me/calendarList", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.error?.message || "Could not load Google calendars.");
  }

  return (payload.items || []).map((item: Record<string, unknown>) => ({
    id: String(item.id || ""),
    summary: String(item.summary || "Untitled calendar"),
    primary: Boolean(item.primary),
    accessRole: String(item.accessRole || ""),
  }));
}

async function queueExistingAppointments(
  adminClient: ReturnType<typeof createClient>,
  connectionRow: CalendarSyncConnectionRow,
  calendarId: string | null
) {
  const { data: appointments, error } = await adminClient
    .from("appointments")
    .select("id, item_type, created_at, updated_at")
    .eq("user_id", connectionRow.user_id);

  if (error || !appointments?.length) {
    return;
  }

  const links = (appointments as AppointmentRow[])
    .filter((item) =>
      item.item_type === "reminder"
        ? connectionRow.sync_reminders
        : connectionRow.sync_appointments
    )
    .map((item) => ({
      user_id: connectionRow.user_id,
      provider: "google",
      source_type: "appointment",
      source_record_id: String(item.id),
      external_calendar_id: calendarId,
      sync_status: "pending",
      source_updated_at: item.updated_at || item.created_at || new Date().toISOString(),
      last_error: null,
      updated_at: new Date().toISOString(),
    }));

  if (!links.length) {
    return;
  }

  await adminClient
    .from("calendar_sync_event_links")
    .upsert(links, { onConflict: "user_id,provider,source_type,source_record_id" });
}

async function getValidGoogleAccessToken(
  adminClient: ReturnType<typeof createClient>,
  userId: string
) {
  const { data: tokenRow, error } = await adminClient
    .from("calendar_sync_google_tokens")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle<GoogleTokenRow>();

  if (error || !tokenRow) {
    throw new Error("Google Calendar is not connected for this user yet.");
  }

  const expiresAt = tokenRow.expires_at ? new Date(tokenRow.expires_at).getTime() : 0;
  const stillValid = expiresAt && expiresAt - Date.now() > 60_000;

  if (stillValid) {
    return tokenRow.access_token;
  }

  if (!tokenRow.refresh_token) {
    throw new Error("Google Calendar needs to be reconnected because the refresh token is missing.");
  }

  const refreshed = await refreshGoogleAccessToken(tokenRow.refresh_token);
  const nextExpiresAt = refreshed.expires_in
    ? new Date(Date.now() + Number(refreshed.expires_in) * 1000).toISOString()
    : tokenRow.expires_at;

  await adminClient.from("calendar_sync_google_tokens").upsert(
    {
      user_id: userId,
      access_token: refreshed.access_token,
      refresh_token: refreshed.refresh_token || tokenRow.refresh_token,
      expires_at: nextExpiresAt,
      scope: refreshed.scope || tokenRow.scope,
      token_type: refreshed.token_type || tokenRow.token_type || "Bearer",
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );

  return refreshed.access_token;
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_SERVICE_ROLE_KEY) {
    return jsonResponse({ error: "Supabase environment variables are missing." }, 500);
  }

  const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const url = new URL(request.url);
  const isCallback = url.pathname.endsWith("/callback");

  if (isCallback) {
    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
      return Response.redirect(
        buildAppRedirect(DEFAULT_PUBLIC_APP_URL, "error", "Google OAuth is not configured on the server."),
        302
      );
    }

    const state = url.searchParams.get("state");
    const code = url.searchParams.get("code");
    const oauthError = url.searchParams.get("error");

    const { data: connectionRow } = await adminClient
      .from("calendar_sync_connections")
      .select("*")
      .eq("provider", "google")
      .eq("oauth_state", state || "")
      .maybeSingle<CalendarSyncConnectionRow>();

    const returnUrl = connectionRow?.oauth_return_url || DEFAULT_PUBLIC_APP_URL;

    if (oauthError) {
      return Response.redirect(buildAppRedirect(returnUrl, "error", oauthError), 302);
    }

    if (!state || !code || !connectionRow) {
      return Response.redirect(
        buildAppRedirect(returnUrl, "error", "Missing or expired Google OAuth state."),
        302
      );
    }

    if (
      connectionRow.oauth_state_expires_at &&
      new Date(connectionRow.oauth_state_expires_at).getTime() < Date.now()
    ) {
      return Response.redirect(
        buildAppRedirect(returnUrl, "error", "Google OAuth session expired. Please try again."),
        302
      );
    }

    try {
      const tokenPayload = await exchangeCodeForTokens(code, buildCallbackUrl(request));
      const expiresAt = tokenPayload.expires_in
        ? new Date(Date.now() + Number(tokenPayload.expires_in) * 1000).toISOString()
        : null;
      const calendars = await fetchGoogleCalendars(tokenPayload.access_token);
      const primaryCalendar =
        calendars.find((item: { primary: boolean }) => item.primary) || calendars[0] || null;
      const userInfoResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
        headers: {
          Authorization: `Bearer ${tokenPayload.access_token}`,
        },
      });
      const userInfo = userInfoResponse.ok ? await userInfoResponse.json() : null;

      await adminClient.from("calendar_sync_google_tokens").upsert(
        {
          user_id: connectionRow.user_id,
          access_token: tokenPayload.access_token,
          refresh_token: tokenPayload.refresh_token || null,
          expires_at: expiresAt,
          scope: tokenPayload.scope || GOOGLE_OAUTH_SCOPE,
          token_type: tokenPayload.token_type || "Bearer",
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );

      await adminClient
        .from("calendar_sync_connections")
        .update({
          status: "ready",
          external_account_email: userInfo?.email || connectionRow.external_account_email,
          external_calendar_id: primaryCalendar?.id || connectionRow.external_calendar_id,
          external_calendar_name: primaryCalendar?.summary || connectionRow.external_calendar_name,
          connected_at: new Date().toISOString(),
          last_error: null,
          oauth_state: null,
          oauth_state_expires_at: null,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", connectionRow.user_id)
        .eq("provider", "google");

      await queueExistingAppointments(
        adminClient,
        connectionRow,
        primaryCalendar?.id || connectionRow.external_calendar_id
      );

      return Response.redirect(buildAppRedirect(returnUrl, "success", "Google Calendar connected."), 302);
    } catch (error) {
      await adminClient
        .from("calendar_sync_connections")
        .update({
          status: "error",
          last_error: error instanceof Error ? error.message : "Google OAuth failed.",
          oauth_state: null,
          oauth_state_expires_at: null,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", connectionRow.user_id)
        .eq("provider", "google");

      return Response.redirect(
        buildAppRedirect(returnUrl, "error", error instanceof Error ? error.message : "Google OAuth failed."),
        302
      );
    }
  }

  if (request.method !== "POST") {
    return jsonResponse({ error: "Method not allowed." }, 405);
  }

  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    return jsonResponse({ error: "Google OAuth is not configured on the server." }, 500);
  }

  const { user, error: userError } = await getAuthedUser(request);

  if (userError || !user) {
    return jsonResponse({ error: userError || "Could not verify the current user." }, 401);
  }

  const body = await request.json().catch(() => ({}));
  const action = String(body?.action || "");

  if (action === "start") {
    const oauthState = crypto.randomUUID();
    const returnUrl = buildAppReturnUrl(body?.returnUrl || DEFAULT_PUBLIC_APP_URL);
    const callbackUrl = buildCallbackUrl(request);
    const oauthStateExpiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    await adminClient.from("calendar_sync_connections").upsert(
      {
        user_id: user.id,
        provider: "google",
        status: "needs_setup",
        sync_appointments: true,
        sync_reminders: true,
        sync_dated_todos: false,
        oauth_state: oauthState,
        oauth_state_expires_at: oauthStateExpiresAt,
        oauth_return_url: returnUrl,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,provider" }
    );

    const authorizeUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    authorizeUrl.searchParams.set("client_id", GOOGLE_CLIENT_ID);
    authorizeUrl.searchParams.set("redirect_uri", callbackUrl);
    authorizeUrl.searchParams.set("response_type", "code");
    authorizeUrl.searchParams.set("access_type", "offline");
    authorizeUrl.searchParams.set("prompt", "consent");
    authorizeUrl.searchParams.set("include_granted_scopes", "true");
    authorizeUrl.searchParams.set("scope", GOOGLE_OAUTH_SCOPE);
    authorizeUrl.searchParams.set("state", oauthState);

    return jsonResponse({
      authorizeUrl: authorizeUrl.toString(),
      callbackUrl,
    });
  }

  if (action === "list-calendars") {
    try {
      const accessToken = await getValidGoogleAccessToken(adminClient, user.id);
      const calendars = await fetchGoogleCalendars(accessToken);
      return jsonResponse({ calendars });
    } catch (error) {
      return jsonResponse(
        { error: error instanceof Error ? error.message : "Could not load Google calendars." },
        400
      );
    }
  }

  return jsonResponse({ error: "Unknown action." }, 400);
});
