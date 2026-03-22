import { Capacitor } from "@capacitor/core";
import { PushNotifications } from "@capacitor/push-notifications";

const SUPPORT_CHANNEL_ID = "support-messages";

function isNativePushPlatform() {
  return Capacitor.isNativePlatform() && ["android", "ios"].includes(Capacitor.getPlatform());
}

async function ensureAndroidChannel() {
  if (Capacitor.getPlatform() !== "android") {
    return;
  }

  await PushNotifications.createChannel({
    id: SUPPORT_CHANNEL_ID,
    name: "Support messages",
    description: "Notifications when connected outsiders send support messages.",
    importance: 5,
    visibility: 1,
  });
}

export async function checkNativePushAvailability() {
  if (!isNativePushPlatform()) {
    return {
      supported: false,
      permission: "prompt",
      platform: Capacitor.getPlatform(),
    };
  }

  const permissions = await PushNotifications.checkPermissions();

  return {
    supported: true,
    permission: permissions.receive,
    platform: Capacitor.getPlatform(),
  };
}

export async function requestNativePushPermissions() {
  if (!isNativePushPlatform()) {
    return { granted: false, permission: "prompt" };
  }

  const currentPermissions = await PushNotifications.checkPermissions();

  if (currentPermissions.receive === "granted") {
    return { granted: true, permission: currentPermissions.receive };
  }

  const nextPermissions = await PushNotifications.requestPermissions();

  return {
    granted: nextPermissions.receive === "granted",
    permission: nextPermissions.receive,
  };
}

export async function registerForNativePush({
  onToken,
  onRegistrationError,
  onNotificationReceived,
  onNotificationActionPerformed,
}) {
  if (!isNativePushPlatform()) {
    return {
      supported: false,
      permission: "prompt",
      cleanup: async () => {},
    };
  }

  const permissionResult = await requestNativePushPermissions();

  if (!permissionResult.granted) {
    return {
      supported: true,
      permission: permissionResult.permission,
      cleanup: async () => {},
    };
  }

  await ensureAndroidChannel();

  const registrationListener = await PushNotifications.addListener("registration", async (token) => {
    await onToken?.(token.value);
  });
  const registrationErrorListener = await PushNotifications.addListener("registrationError", async (error) => {
    await onRegistrationError?.(error);
  });
  const receivedListener = await PushNotifications.addListener("pushNotificationReceived", async (notification) => {
    await onNotificationReceived?.(notification);
  });
  const actionListener = await PushNotifications.addListener("pushNotificationActionPerformed", async (notification) => {
    await onNotificationActionPerformed?.(notification);
  });

  await PushNotifications.register();

  return {
    supported: true,
    permission: permissionResult.permission,
    cleanup: async () => {
      await registrationListener.remove();
      await registrationErrorListener.remove();
      await receivedListener.remove();
      await actionListener.remove();
    },
  };
}

export async function unregisterFromNativePush() {
  if (!isNativePushPlatform()) {
    return;
  }

  await PushNotifications.unregister();
}
