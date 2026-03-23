Required secrets for the `send-support-message-push` Edge Function:

- `APNS_KEY_ID`
- `APNS_TEAM_ID`
- `APNS_PRIVATE_KEY`
- `APNS_BUNDLE_ID`
- `APNS_USE_SANDBOX` set to `true` for development builds and `false` for production

This function is called after an outsider creates a `support_messages` row. It looks up enabled rows in `push_notification_devices` for the tracker and currently sends Apple Push Notification Service alerts to iOS devices.

The client writes each device row with an `environment` value. By default it is `production`, but native test builds can be compiled with `VITE_PUSH_ENVIRONMENT=sandbox` so APNs sandbox tokens stay separated from production tokens.
