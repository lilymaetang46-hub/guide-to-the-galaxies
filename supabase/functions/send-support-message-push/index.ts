import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";
import { importPKCS8, SignJWT } from "https://esm.sh/jose@5.9.6";

type SupportMessageRow = {
  id: string;
  tracker_id: string;
  outsider_id: string;
  outsider_name: string | null;
  message: string;
  created_at: string;
};

type PushDeviceRow = {
  id: string;
  token: string;
  platform: string;
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const APNS_KEY_ID = Deno.env.get("APNS_KEY_ID") ?? "";
const APNS_TEAM_ID = Deno.env.get("APNS_TEAM_ID") ?? "";
const APNS_PRIVATE_KEY = Deno.env.get("APNS_PRIVATE_KEY") ?? "";
const APNS_BUNDLE_ID = Deno.env.get("APNS_BUNDLE_ID") ?? "app.guidetothegalaxies";
const APNS_USE_SANDBOX = Deno.env.get("APNS_USE_SANDBOX") === "true";

function getTargetPushEnvironment() {
  return APNS_USE_SANDBOX ? "sandbox" : "production";
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

function getApnsHost() {
  return APNS_USE_SANDBOX ? "https://api.sandbox.push.apple.com" : "https://api.push.apple.com";
}

function getApnsPrivateKeyPem() {
  return APNS_PRIVATE_KEY.replace(/\\n/g, "\n").trim();
}

async function createApnsJwt() {
  const privateKey = await importPKCS8(getApnsPrivateKeyPem(), "ES256");

  return await new SignJWT({})
    .setProtectedHeader({
      alg: "ES256",
      kid: APNS_KEY_ID,
    })
    .setIssuer(APNS_TEAM_ID)
    .setIssuedAt()
    .sign(privateKey);
}

async function sendApplePush(token: string, payload: Record<string, unknown>) {
  const jwt = await createApnsJwt();

  const response = await fetch(`${getApnsHost()}/3/device/${token}`, {
    method: "POST",
    headers: {
      authorization: `bearer ${jwt}`,
      "apns-topic": APNS_BUNDLE_ID,
      "apns-push-type": "alert",
      "apns-priority": "10",
      "content-type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const responseText = await response.text();

  return {
    ok: response.ok,
    status: response.status,
    body: responseText ? JSON.parse(responseText) : null,
  };
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return jsonResponse({ error: "Method not allowed." }, 405);
  }

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_SERVICE_ROLE_KEY) {
    return jsonResponse({ error: "Supabase environment variables are missing." }, 500);
  }

  const authHeader = request.headers.get("Authorization");

  if (!authHeader) {
    return jsonResponse({ error: "Missing Authorization header." }, 401);
  }

  const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: {
      headers: {
        Authorization: authHeader,
      },
    },
  });

  const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  const {
    data: { user },
    error: userError,
  } = await userClient.auth.getUser();

  if (userError || !user) {
    return jsonResponse({ error: "Could not verify the current user." }, 401);
  }

  const { supportMessageId } = await request.json();

  if (!supportMessageId || typeof supportMessageId !== "string") {
    return jsonResponse({ error: "supportMessageId is required." }, 400);
  }

  const { data: supportMessage, error: supportMessageError } = await adminClient
    .from("support_messages")
    .select("id, tracker_id, outsider_id, outsider_name, message, created_at")
    .eq("id", supportMessageId)
    .maybeSingle<SupportMessageRow>();

  if (supportMessageError || !supportMessage) {
    return jsonResponse({ error: "Support message not found." }, 404);
  }

  if (supportMessage.outsider_id !== user.id) {
    return jsonResponse({ error: "You do not have access to send a push for this message." }, 403);
  }

  const { data: trackerProfile } = await adminClient
    .from("profiles")
    .select("display_name, secondary_display_name")
    .eq("id", supportMessage.tracker_id)
    .maybeSingle();

  const { data: devices, error: devicesError } = await adminClient
    .from("push_notification_devices")
    .select("id, token, platform")
    .eq("user_id", supportMessage.tracker_id)
    .eq("enabled", true)
    .eq("environment", getTargetPushEnvironment());

  if (devicesError) {
    return jsonResponse({ error: "Could not load tracker push devices." }, 500);
  }

  if (!devices || devices.length === 0) {
    return jsonResponse({
      success: true,
      sent: 0,
      skipped: 0,
      reason: "no_registered_devices",
    });
  }

  if (!APNS_KEY_ID || !APNS_TEAM_ID || !APNS_PRIVATE_KEY) {
    return jsonResponse({
      success: true,
      sent: 0,
      skipped: devices.length,
      reason: "apns_not_configured",
    });
  }

  const trackerName =
    trackerProfile?.display_name ||
    trackerProfile?.secondary_display_name ||
    "your tracker";
  const senderName = supportMessage.outsider_name || "Someone in your support circle";
  const apnsDevices = (devices as PushDeviceRow[]).filter((device) => device.platform === "ios");

  if (apnsDevices.length === 0) {
    return jsonResponse({
      success: true,
      sent: 0,
      skipped: devices.length,
      reason: "no_ios_devices",
    });
  }

  const results = await Promise.all(
    apnsDevices.map(async (device) => {
      const payload = {
        aps: {
          alert: {
            title: `${senderName} sent support`,
            body: supportMessage.message,
          },
          sound: "default",
        },
        targetPage: "support",
        supportMessageId: supportMessage.id,
        trackerId: supportMessage.tracker_id,
        trackerName,
      };

      const response = await sendApplePush(device.token, payload);

      if (
        !response.ok &&
        response.body &&
        ["BadDeviceToken", "Unregistered", "DeviceTokenNotForTopic"].includes(
          response.body.reason ?? ""
        )
      ) {
        await adminClient
          .from("push_notification_devices")
          .update({
            enabled: false,
            updated_at: new Date().toISOString(),
          })
          .eq("id", device.id);
      }

      return {
        deviceId: device.id,
        token: device.token,
        ...response,
      };
    })
  );

  const sent = results.filter((result) => result.ok).length;
  const failed = results.filter((result) => !result.ok);

  return jsonResponse({
    success: failed.length === 0,
    sent,
    skipped: devices.length - apnsDevices.length,
    failed,
  });
});
