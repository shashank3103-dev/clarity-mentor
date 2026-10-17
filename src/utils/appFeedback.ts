import {Platform, ToastAndroid, Alert, AlertButton} from 'react-native';

export interface FeedbackOptions {
  title?: string;
  duration?: 'short' | 'long';
  buttons?: AlertButton[];
}

/**
 * Display a short feedback message.
 * Uses native ToastAndroid on Android devices and Alert on iOS.
 */
export const showToast = (
  message: string,
  duration: 'short' | 'long' = 'short',
): void => {
  if (!message) return;

  if (Platform.OS === 'android') {
    const toastDuration =
      duration === 'long' ? ToastAndroid.LONG : ToastAndroid.SHORT;
    ToastAndroid.show(message, toastDuration);
  } else {
    Alert.alert('', message);
  }
};

/**
 * Display a success feedback notification.
 * On Android: Short ToastAndroid message.
 * On iOS: Alert dialog with 'Success' title.
 */
export const showSuccess = (
  message: string,
  title: string = 'Success',
): void => {
  if (!message) return;

  if (Platform.OS === 'android') {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  } else {
    Alert.alert(title, message);
  }
};

/**
 * Display an error feedback notification.
 * On Android: Long ToastAndroid message.
 * On iOS: Alert dialog with 'Error' title.
 */
export const showError = (
  message: string,
  title: string = 'Error',
): void => {
  if (!message) return;

  if (Platform.OS === 'android') {
    ToastAndroid.show(message, ToastAndroid.LONG);
  } else {
    Alert.alert(title, message);
  }
};

/**
 * Display an informational feedback notification.
 * On Android: Short ToastAndroid message.
 * On iOS: Alert dialog with 'Notice' title.
 */
export const showInfo = (
  message: string,
  title: string = 'Notice',
): void => {
  if (!message) return;

  if (Platform.OS === 'android') {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  } else {
    Alert.alert(title, message);
  }
};

/**
 * Display a confirmation prompt with Confirm and Cancel actions.
 * Always renders an interactive Alert dialog with action handlers on both platforms.
 */
export const showConfirm = (
  title: string,
  message: string,
  onConfirm: () => void,
  onCancel?: () => void,
  confirmText: string = 'Confirm',
  cancelText: string = 'Cancel',
): void => {
  Alert.alert(
    title,
    message,
    [
      {
        text: cancelText,
        style: 'cancel',
        onPress: onCancel,
      },
      {
        text: confirmText,
        onPress: onConfirm,
      },
    ],
    {cancelable: true},
  );
};

export const appFeedback = {
  toast: showToast,
  success: showSuccess,
  error: showError,
  info: showInfo,
  confirm: showConfirm,
};

export default appFeedback;
