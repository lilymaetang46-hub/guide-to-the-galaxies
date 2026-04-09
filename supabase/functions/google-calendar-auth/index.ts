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
  title: string | null;
  event_date: string | null;
  event_time: string | null;
  location: string | null;
  note: string | null;
  created_at: string | null;
  updated_at: string | null;
};

type CalendarSyncEventLinkRow = {
  id: number;
  user_id: string;
  provider: string;
  source_type: string;
  source_record_id: string;
  source_kind?: string | null;
  source_id?: string | null;
  source_item_id?: string | null;
  external_calendar_id: string | null;
  external_event_id: string | null;
  sync_status: string;
  source_updated_at: string | null;
  last_synced_at: string | null;
  last_error: string | null;
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
  "openid email https://www.googleapis.com/auth/calendar";
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
  const requestUrl = new URL(request.url);
  const supabaseUrl = SUPABASE_URL ? new URL(SUPABASE_URL) : new URL(requestUrl.origin);
  const callbackUrl = new URL("/functions/v1/google-calendar-auth/callback", supabaseUrl);
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

function encodeStatePayload(payload: Record<string, string>) {
  const json = JSON.stringify(payload);
  const bytes = new TextEncoder().encode(json);
  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function decodeStatePayload(state: string | null) {
  if (!state) {
    return null;
  }

  try {
    const padded = state.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(state.length / 4) * 4, "=");
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    return null;
  }
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

async function fetchGoogleCalendarEvents(
  accessToken: string,
  calendarId: string,
  timeMin?: string,
  timeMax?: string
) {
  const url = new URL(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`
  );
  url.searchParams.set("singleEvents", "true");
  url.searchParams.set("orderBy", "startTime");
  url.searchParams.set("maxResults", "250");

  if (timeMin) {
    url.searchParams.set("timeMin", timeMin);
  }

  if (timeMax) {
    url.searchParams.set("timeMax", timeMax);
  }

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.error?.message || "Could not load Google Calendar events.");
  }

  return (payload?.items || []).map((item: Record<string, unknown>) => ({
    id: String(item.id || ""),
    status: String(item.status || "confirmed"),
    summary: String(item.summary || "Untitled event"),
    description: String(item.description || ""),
    location: String(item.location || ""),
    start: item.start || {},
    end: item.end || {},
    htmlLink: String(item.htmlLink || ""),
  }));
}

async function fetchGoogleUserInfo(accessToken: string) {
  const response = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    return null;
  }

  return await response.json();
}

function normalizeCalendarChoice(
  calendars: Array<{ id: string; summary: string; primary: boolean }>,
  connectionRow: CalendarSyncConnectionRow | null,
  externalAccountEmail: string | null | undefined,
  preferredCalendarId?: string | null,
  preferredCalendarName?: string | null
) {
  const email = String(externalAccountEmail || connectionRow?.external_account_email || "")
    .trim()
    .toLowerCase();
  const currentId = String(preferredCalendarId || connectionRow?.external_calendar_id || "").trim();
  const currentName = String(preferredCalendarName || connectionRow?.external_calendar_name || "").trim();
  const matchingCalendar = calendars.find((item) => item.id === currentId) || null;
  const matchingNameCalendar =
    calendars.find(
      (item) =>
        currentName &&
        item.summary.trim().toLowerCase() === currentName.toLowerCase()
    ) || null;
  const primaryCalendar = calendars.find((item) => item.primary) || calendars[0] || null;
  const nameLooksLikeEmail =
    currentName && email && currentName.toLowerCase() === email;

  if (matchingCalendar) {
    return {
      externalCalendarId: matchingCalendar.id,
      externalCalendarName: matchingCalendar.summary || currentName || null,
    };
  }

  if (matchingNameCalendar) {
    return {
      externalCalendarId: matchingNameCalendar.id,
      externalCalendarName: matchingNameCalendar.summary || currentName || null,
    };
  }

  if ((!currentId && primaryCalendar) || nameLooksLikeEmail) {
    return {
      externalCalendarId: primaryCalendar?.id || null,
      externalCalendarName: primaryCalendar?.summary || null,
    };
  }

  return {
    externalCalendarId: currentId || primaryCalendar?.id || null,
    externalCalendarName: currentName || primaryCalendar?.summary || null,
  };
}

async function createGoogleCalendarEvent(
  accessToken: string,
  calendarId: string,
  payload: Record<string, unknown>
) {
  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(body?.error?.message || "Could not create Google Calendar event.");
  }

  return body;
}

async function updateGoogleCalendarEvent(
  accessToken: string,
  calendarId: string,
  eventId: string,
  payload: Record<string, unknown>
) {
  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(eventId)}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(body?.error?.message || "Could not update Google Calendar event.");
  }

  return body;
}

async function deleteGoogleCalendarEvent(
  accessToken: string,
  calendarId: string,
  eventId: string
) {
  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(eventId)}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (response.status === 404) {
    return;
  }

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.error?.message || "Could not delete Google Calendar event.");
  }
}

function buildDateTimeParts(dateText: string, timeText: string, timeZone: string) {
  const normalizedTime = String(timeText || "").slice(0, 5);

  if (!dateText || !normalizedTime) {
    throw new Error("Appointment is missing a date or time.");
  }

  const [hoursText, minutesText] = normalizedTime.split(":");
  const hours = Number(hoursText);
  const minutes = Number(minutesText);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    throw new Error("Appointment time is invalid.");
  }

  const startDate = new Date(`${dateText}T00:00:00`);
  startDate.setHours(hours, minutes, 0, 0);

  return {
    startDate,
    start: {
      dateTime: `${dateText}T${normalizedTime}:00`,
      timeZone,
    },
  };
}

function formatDateText(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`;
}

function buildGoogleEventPayload(appointment: AppointmentRow, timeZone: string) {
  const calendarItemType = appointment.item_type === "reminder" ? "Reminder" : "Appointment";
  const { startDate, start } = buildDateTimeParts(
    appointment.event_date || "",
    appointment.event_time || "",
    timeZone
  );
  const endDate = new Date(startDate);
  endDate.setMinutes(
    endDate.getMinutes() + (appointment.item_type === "reminder" ? 15 : 60)
  );
  const endTime = `${String(endDate.getHours()).padStart(2, "0")}:${String(
    endDate.getMinutes()
  ).padStart(2, "0")}`;
  const descriptionParts = [
    `${calendarItemType} from Tracker`,
    appointment.note?.trim() || "",
  ].filter(Boolean);

  return {
    summary: appointment.title || calendarItemType,
    description: descriptionParts.join("\n\n"),
    location: appointment.location || undefined,
    start,
    end: {
      dateTime: `${formatDateText(endDate)}T${endTime}:00`,
      timeZone,
    },
  };
}

async function saveConnectionSyncState(
  adminClient: ReturnType<typeof createClient>,
  userId: string,
  updates: Record<string, unknown>
) {
  const { error } = await adminClient
    .from("calendar_sync_connections")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId)
    .eq("provider", "google");

  if (error) {
    console.error("google-calendar-auth: failed to save connection sync state", error);
  }
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
      source_kind: "appointment",
      source_id: String(item.id),
      source_item_id: String(item.id),
      external_calendar_id: calendarId,
      sync_status: "pending",
      source_updated_at: item.updated_at || item.created_at || new Date().toISOString(),
      last_error: null,
      updated_at: new Date().toISOString(),
    }));

  if (!links.length) {
    return 0;
  }

  const { error: upsertError } = await adminClient
    .from("calendar_sync_event_links")
    .upsert(links, { onConflict: "user_id,provider,source_type,source_record_id" });

  if (upsertError) {
    throw new Error(`Could not queue appointments for Google sync: ${upsertError.message}`);
  }

  return links.length;
}

async function saveGoogleConnectionErrorState(
  adminClient: ReturnType<typeof createClient>,
  connectionRow: CalendarSyncConnectionRow,
  message: string
) {
  const { error } = await adminClient
    .from("calendar_sync_connections")
    .update({
      status: "error",
      last_error: message,
      oauth_state: null,
      oauth_state_expires_at: null,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", connectionRow.user_id)
    .eq("provider", "google");

  if (error) {
    console.error("google-calendar-auth: failed to save error state", error);
  }
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

async function syncQueuedGoogleCalendarEvents(
  adminClient: ReturnType<typeof createClient>,
  connectionRow: CalendarSyncConnectionRow,
  userId: string,
  timeZone: string
) {
  const queuedCount = await queueExistingAppointments(
    adminClient,
    connectionRow,
    connectionRow.external_calendar_id
  );

  const { data: linkRows, error: linkError } = await adminClient
    .from("calendar_sync_event_links")
    .select("*")
    .eq("user_id", userId)
    .eq("provider", "google")
    .in("sync_status", ["pending", "failed", "deleted"])
    .order("updated_at", { ascending: true })
    .returns<CalendarSyncEventLinkRow[]>();

  if (linkError) {
    throw new Error(`Could not load queued calendar sync items: ${linkError.message}`);
  }

  const links = linkRows || [];

  if (!links.length) {
    await saveConnectionSyncState(adminClient, userId, {
      status: "ready",
      last_error: null,
      last_synced_at: new Date().toISOString(),
    });

    return {
      processed: 0,
      queued: queuedCount,
      synced: 0,
      deleted: 0,
      failed: 0,
    };
  }

  const accessToken = await getValidGoogleAccessToken(adminClient, userId);
  const appointmentIds = [...new Set(
    links
      .filter((link) => (link.source_type || link.source_kind) === "appointment")
      .map((link) => Number(link.source_record_id || link.source_item_id || link.source_id))
      .filter((value) => Number.isFinite(value))
  )];

  const appointmentMap = new Map<number, AppointmentRow>();

  if (appointmentIds.length) {
    const { data: appointments, error: appointmentError } = await adminClient
      .from("appointments")
      .select("id, item_type, title, event_date, event_time, location, note, created_at, updated_at")
      .eq("user_id", userId)
      .in("id", appointmentIds)
      .returns<AppointmentRow[]>();

    if (appointmentError) {
      throw new Error(`Could not load appointments for sync: ${appointmentError.message}`);
    }

    for (const appointment of appointments || []) {
      appointmentMap.set(appointment.id, appointment);
    }
  }

  let synced = 0;
  let deleted = 0;
  let failed = 0;
  const failureMessages: string[] = [];

  await saveConnectionSyncState(adminClient, userId, {
    status: "syncing",
    last_error: null,
  });

  for (const link of links) {
    const calendarId =
      link.external_calendar_id ||
      connectionRow.external_calendar_id ||
      null;

    if (!calendarId) {
      failed += 1;
      failureMessages.push("Choose a Google calendar before syncing events.");
      await adminClient
        .from("calendar_sync_event_links")
        .update({
          sync_status: "failed",
          last_error: "Choose a Google calendar before syncing events.",
          updated_at: new Date().toISOString(),
        })
        .eq("id", link.id);
      continue;
    }

    try {
      const sourceType = link.source_type || link.source_kind || "";

      if (sourceType !== "appointment") {
        throw new Error(`Unsupported sync source type: ${sourceType}`);
      }

      const appointmentId = Number(link.source_record_id || link.source_item_id || link.source_id);
      const appointment = appointmentMap.get(appointmentId);

      if (link.sync_status === "deleted" || !appointment) {
        if (link.external_event_id) {
          await deleteGoogleCalendarEvent(accessToken, calendarId, link.external_event_id);
        }

        await adminClient
          .from("calendar_sync_event_links")
          .update({
            external_calendar_id: calendarId,
            sync_status: "deleted",
            last_error: null,
            last_synced_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", link.id);

        deleted += 1;
        continue;
      }

      const eventPayload = buildGoogleEventPayload(appointment, timeZone);
      const event = link.external_event_id
        ? await updateGoogleCalendarEvent(
            accessToken,
            calendarId,
            link.external_event_id,
            eventPayload
          )
        : await createGoogleCalendarEvent(accessToken, calendarId, eventPayload);

      await adminClient
        .from("calendar_sync_event_links")
        .update({
          external_calendar_id: calendarId,
          external_event_id: event?.id || link.external_event_id,
          sync_status: "synced",
          last_error: null,
          last_synced_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", link.id);

      synced += 1;
    } catch (error) {
      failed += 1;
      const message = error instanceof Error ? error.message : "Google Calendar sync failed.";
      failureMessages.push(message);

      await adminClient
        .from("calendar_sync_event_links")
        .update({
          sync_status: "failed",
          last_error: message,
          updated_at: new Date().toISOString(),
        })
        .eq("id", link.id);
    }
  }

  const lastError = failureMessages[0] || null;
  await saveConnectionSyncState(adminClient, userId, {
    status: failed > 0 ? "error" : "ready",
    last_error: lastError,
    last_synced_at: new Date().toISOString(),
  });

  return {
    processed: links.length,
    queued: queuedCount,
    synced,
    deleted,
    failed,
  };
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
    const statePayload = decodeStatePayload(state);

    const { data: connectionRow } = statePayload?.userId
      ? await adminClient
          .from("calendar_sync_connections")
          .select("*")
          .eq("provider", "google")
          .eq("user_id", statePayload.userId)
          .maybeSingle<CalendarSyncConnectionRow>()
      : { data: null };

    const returnUrl =
      connectionRow?.oauth_return_url ||
      statePayload?.returnUrl ||
      DEFAULT_PUBLIC_APP_URL;

    if (oauthError) {
      return Response.redirect(buildAppRedirect(returnUrl, "error", oauthError), 302);
    }

    if (!state || !code || !connectionRow || connectionRow.oauth_state !== state) {
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
      const userInfo = await fetchGoogleUserInfo(tokenPayload.access_token);

      const { error: tokenSaveError } = await adminClient.from("calendar_sync_google_tokens").upsert(
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

      if (tokenSaveError) {
        throw new Error(`Could not save Google tokens: ${tokenSaveError.message}`);
      }

      const { data: updatedConnection, error: connectionUpdateError } = await adminClient
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
          oauth_return_url: null,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", connectionRow.user_id)
        .eq("provider", "google")
        .select("*")
        .single<CalendarSyncConnectionRow>();

      if (connectionUpdateError) {
        throw new Error(`Could not save Google connection: ${connectionUpdateError.message}`);
      }

      await queueExistingAppointments(
        adminClient,
        updatedConnection || connectionRow,
        primaryCalendar?.id || updatedConnection?.external_calendar_id || connectionRow.external_calendar_id
      );

      return Response.redirect(buildAppRedirect(returnUrl, "success", "Google Calendar connected."), 302);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Google OAuth failed.";
      console.error("google-calendar-auth callback failed", error);
      await saveGoogleConnectionErrorState(adminClient, connectionRow, errorMessage);

      return Response.redirect(
        buildAppRedirect(returnUrl, "error", errorMessage),
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
    const returnUrl = buildAppReturnUrl(body?.returnUrl || DEFAULT_PUBLIC_APP_URL);
    const oauthState = encodeStatePayload({
      userId: user.id,
      returnUrl,
      nonce: crypto.randomUUID(),
    });
    const callbackUrl = buildCallbackUrl(request);
    const oauthStateExpiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    const { error: startSaveError } = await adminClient.from("calendar_sync_connections").upsert(
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

    if (startSaveError) {
      console.error("google-calendar-auth start failed to save oauth state", startSaveError);
      return jsonResponse(
        { error: `Could not save Google OAuth session: ${startSaveError.message}` },
        500
      );
    }

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
      const userInfo = await fetchGoogleUserInfo(accessToken);
      const primaryCalendar =
        calendars.find((item: { primary: boolean }) => item.primary) || calendars[0] || null;

      const { data: connectionRow } = await adminClient
        .from("calendar_sync_connections")
        .select("*")
        .eq("provider", "google")
        .eq("user_id", user.id)
        .maybeSingle<CalendarSyncConnectionRow>();

      if (connectionRow) {
        const nextChoice = normalizeCalendarChoice(
          calendars,
          connectionRow,
          userInfo?.email,
          typeof body?.preferredCalendarId === "string" ? body.preferredCalendarId : null,
          typeof body?.preferredCalendarName === "string" ? body.preferredCalendarName : null
        );

        await adminClient
          .from("calendar_sync_connections")
          .update({
            external_account_email: userInfo?.email || connectionRow.external_account_email,
            external_calendar_id: nextChoice.externalCalendarId,
            external_calendar_name: nextChoice.externalCalendarName,
            last_error: null,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", user.id)
          .eq("provider", "google");

        return jsonResponse({
          calendars,
          externalAccountEmail: userInfo?.email || connectionRow.external_account_email || null,
          externalCalendarId: nextChoice.externalCalendarId,
          externalCalendarName: nextChoice.externalCalendarName,
        });
      }

      return jsonResponse({
        calendars,
        externalAccountEmail: userInfo?.email || connectionRow?.external_account_email || null,
        externalCalendarId: primaryCalendar?.id || null,
        externalCalendarName: primaryCalendar?.summary || null,
      });
    } catch (error) {
      return jsonResponse(
        { error: error instanceof Error ? error.message : "Could not load Google calendars." },
        400
      );
    }
  }

  if (action === "sync-events") {
    const { data: connectionRow, error: connectionError } = await adminClient
      .from("calendar_sync_connections")
      .select("*")
      .eq("provider", "google")
      .eq("user_id", user.id)
      .maybeSingle<CalendarSyncConnectionRow>();

    if (connectionError || !connectionRow) {
      return jsonResponse({ error: "Google Calendar is not connected for this user yet." }, 400);
    }

    const timeZone =
      typeof body?.timeZone === "string" && body.timeZone.trim()
        ? body.timeZone.trim()
        : "UTC";

    try {
      const result = await syncQueuedGoogleCalendarEvents(
        adminClient,
        connectionRow,
        user.id,
        timeZone
      );

      return jsonResponse(result);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not sync Google Calendar events.";

      await saveConnectionSyncState(adminClient, user.id, {
        status: "error",
        last_error: message,
      });

      return jsonResponse({ error: message }, 400);
    }
  }

  if (action === "list-events") {
    const { data: connectionRow, error: connectionError } = await adminClient
      .from("calendar_sync_connections")
      .select("*")
      .eq("provider", "google")
      .eq("user_id", user.id)
      .maybeSingle<CalendarSyncConnectionRow>();

    if (connectionError || !connectionRow) {
      return jsonResponse({ error: "Google Calendar is not connected for this user yet." }, 400);
    }

    const calendarId =
      (typeof body?.calendarId === "string" && body.calendarId.trim()) ||
      connectionRow.external_calendar_id ||
      "";

    if (!calendarId) {
      return jsonResponse({ error: "Choose a Google calendar before loading events." }, 400);
    }

    try {
      const accessToken = await getValidGoogleAccessToken(adminClient, user.id);
      const events = await fetchGoogleCalendarEvents(
        accessToken,
        calendarId,
        typeof body?.timeMin === "string" ? body.timeMin : undefined,
        typeof body?.timeMax === "string" ? body.timeMax : undefined
      );

      return jsonResponse({
        events,
        calendarId,
      });
    } catch (error) {
      return jsonResponse(
        { error: error instanceof Error ? error.message : "Could not load Google Calendar events." },
        400
      );
    }
  }

  return jsonResponse({ error: "Unknown action." }, 400);
});
