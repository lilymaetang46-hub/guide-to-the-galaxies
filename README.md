# Guide to the Galaxies

Guide to the Galaxies is a React + Vite app backed by Supabase. The current codebase supports both the tracker and outsider experiences from the same web app, with [`src/App.jsx`](C:\Users\Lily\tracker-app\src\App.jsx) acting as the main stateful controller and the extracted layouts/pages living under [`src/layouts`](C:\Users\Lily\tracker-app\src\layouts), [`src/pages`](C:\Users\Lily\tracker-app\src\pages), and [`src/components`](C:\Users\Lily\tracker-app\src\components).

## Web development

- `npm run dev` starts the Vite dev server.
- `npm run build` creates the production web build in `dist`.
- `npm run preview` serves the production build locally.

## Mobile shell with Capacitor

The repo is now set up to use Capacitor as the native shell so the existing React app can be reused with minimal code churn.

- [`capacitor.config.json`](C:\Users\Lily\tracker-app\capacitor.config.json) points Capacitor at the Vite output in `dist`.
- The app now uses `@capacitor/app` so incoming mobile links can be handled in the shared React layer.
- `npm run assets:mobile` regenerates the shared mobile icon and splash assets in [`public`](C:\Users\Lily\tracker-app\public).
- `npm run build:mobile` builds the web app for the native shell.
- `npm run cap:sync` copies the web build into the Android project and syncs native dependencies.
- `npm run android` is the main day-to-day command for preparing the Android shell.
- `npm run cap:open:android` opens the generated Android project in Android Studio.
- The shared asset generator also refreshes the current Android launcher and splash PNGs under [`android/app/src/main/res`](C:\Users\Lily\tracker-app\android\app\src\main\res).

## iPhone prep

- `npm run ios` is ready for a future macOS machine and will build the web app before syncing the iOS shell.
- `npm run cap:open:ios` can be used on macOS to open the Xcode project once `npx cap add ios` has been run there.
- Invite links such as `/connect/<token>` are now parsed by the shared app layer, which makes future iPhone deep-link setup smoother.
- Shared branding assets now live in [`public/mobile-app-icon.png`](C:\Users\Lily\tracker-app\public\mobile-app-icon.png) and [`public/mobile-splash.png`](C:\Users\Lily\tracker-app\public\mobile-splash.png), which gives us a better base for future native icon and launch-screen generation.

## First Android setup

1. Run `npm run android`.
2. Open the native project with `npm run cap:open:android`.
3. In Android Studio, let Gradle finish syncing, then run the app on an emulator or device.

## Notes

- Android is the practical first native target from this Windows workspace.
- iOS can be added later from a macOS machine with `npx cap add ios` once we are ready for that platform.
- When iOS is added, the existing Capacitor shell and shared deep-link handling can be reused rather than rebuilt separately.
- Native push groundwork now lives in the shared React app plus the Capacitor Android shell:
  - [`src/pushNotifications.js`](C:\Users\Lily\tracker-app\src\pushNotifications.js) wraps Capacitor push registration so the web app codepath stays unchanged.
  - [`supabase/migrations/20260322143000_add_push_notification_devices.sql`](C:\Users\Lily\tracker-app\supabase\migrations\20260322143000_add_push_notification_devices.sql) stores per-device push tokens for authenticated users.
  - [`android/app/src/main/AndroidManifest.xml`](C:\Users\Lily\tracker-app\android\app\src\main\AndroidManifest.xml) now requests Android notification permission.
- To finish live Android push delivery, add your Firebase `google-services.json` file under [`android/app`](C:\Users\Lily\tracker-app\android\app), run `npm run cap:sync`, and then add the server-side send step that targets rows in `push_notification_devices`.
