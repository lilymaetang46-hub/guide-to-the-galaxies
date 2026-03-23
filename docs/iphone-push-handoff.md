# iPhone Push Handoff

This repo is already prepared for the shared and server-side parts of iPhone push notifications.

What is already done:

- Native push registration exists in [`src/pushNotifications.js`](C:\Users\Lily\tracker-app\src\pushNotifications.js).
- The tracker settings UI can enable and disable native push in [`src/pages/tracker/SettingsPage.jsx`](C:\Users\Lily\tracker-app\src\pages\tracker\SettingsPage.jsx).
- Device tokens are stored in `public.push_notification_devices`.
- Support inbox messages are stored in `public.support_messages`.
- The app calls the deployed Edge Function `send-support-message-push` after an outsider sends support.
- The Edge Function source lives in [`supabase/functions/send-support-message-push/index.ts`](C:\Users\Lily\tracker-app\supabase\functions\send-support-message-push\index.ts).

## Supabase

The function has already been deployed to project `bwxjqrrebgszccypnryc`.

Before iPhone testing, set these Supabase secrets:

```powershell
npx supabase secrets set APNS_KEY_ID=YOUR_KEY_ID --project-ref bwxjqrrebgszccypnryc
npx supabase secrets set APNS_TEAM_ID=YOUR_TEAM_ID --project-ref bwxjqrrebgszccypnryc
npx supabase secrets set APNS_BUNDLE_ID=YOUR_BUNDLE_ID --project-ref bwxjqrrebgszccypnryc
npx supabase secrets set APNS_USE_SANDBOX=true --project-ref bwxjqrrebgszccypnryc
```

For the APNS private key, paste the full `.p8` contents including headers:

```powershell
npx supabase secrets set APNS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
YOUR_KEY_CONTENT
-----END PRIVATE KEY-----" --project-ref bwxjqrrebgszccypnryc
```

When you switch from development testing to production/TestFlight/App Store delivery, update:

```powershell
npx supabase secrets set APNS_USE_SANDBOX=false --project-ref bwxjqrrebgszccypnryc
```

## Mac Setup

1. Install Xcode and sign in with the Apple Developer account.
2. In the repo root, run:

```bash
npx cap add ios
npm run ios
```

3. Open the iOS project:

```bash
npm run cap:open:ios
```

## Xcode Setup

In Xcode:

1. Select the app target.
2. Set the bundle identifier to match `APNS_BUNDLE_ID`.
3. Under "Signing & Capabilities", choose the correct team.
4. Add the `Push Notifications` capability.
5. Add the `Background Modes` capability.
6. Enable `Remote notifications` under Background Modes.
7. Build and run on a real iPhone.

## Development Token Environment

For development builds on a real iPhone, use sandbox APNs tokens:

```bash
VITE_PUSH_ENVIRONMENT=sandbox npm run ios
```

The app stores that environment in `push_notification_devices.environment`, and the Edge Function only sends to matching rows.

For production builds later, omit the variable or set:

```bash
VITE_PUSH_ENVIRONMENT=production npm run ios
```

## Apple Developer Portal

You need:

- an Apple Developer account
- an App ID matching the iOS bundle identifier
- an APNs Auth Key (`.p8`)
- the APNs Key ID
- the Apple Team ID

The APNs Auth Key is the thing that powers the Supabase Edge Function sender.

## Test Flow

1. Run the iPhone build on a physical device.
2. Log in as a tracker.
3. Open Settings and enable native push.
4. Confirm a row appears in `push_notification_devices` with:
   - `platform = 'ios'`
   - `enabled = true`
   - `environment = 'sandbox'` during development
5. Log in as a connected outsider on another device or session.
6. Send a support message.
7. Confirm:
   - the `support_messages` row is created
   - the tracker receives an iPhone notification
   - tapping the notification opens the app and lands on the support page

## Useful Checks

Verify registered devices:

```sql
select user_id, platform, environment, enabled, last_registered_at
from public.push_notification_devices
order by last_registered_at desc;
```

Verify support messages:

```sql
select id, tracker_id, outsider_id, message, created_at
from public.support_messages
order by created_at desc
limit 20;
```

## Current Limitation

The current Edge Function sender is APNs/iPhone-focused. Android delivery still needs its own FCM sending path later.
