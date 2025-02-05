import { useState, useEffect } from 'react';
import * as Notifications from 'expo-notifications';

const useNotifications = () => {
  const [notification, setNotification] = useState(null);
  const [response, setResponse] = useState(null);

  useEffect(() => {
    // Listener for notifications when the app is in the foreground
    const foregroundListener = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
      console.log('Foreground notification received:', notification);
    });

    // Listener for when the user taps on the notification
    const backgroundListener = Notifications.addNotificationResponseReceivedListener(response => {
      setResponse(response);
      console.log('Notification response received:', response);
      // You can navigate to a specific screen or perform other actions based on the response
    });

    return () => {
      foregroundListener.remove();
      backgroundListener.remove();
    };
  }, []);

  return { notification, response };
};

export default useNotifications;
