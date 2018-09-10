self.addEventListener('install', function () {
  self.skipWaiting();
});
/* eslint-disable no-undef */
self.addEventListener('activate', function (event) {
  event.waitUntil(clients.claim());
});
/* eslint-enable no-undef*/

self.addEventListener('notificationclick', function (event) {
    // Close the notification when it is clicked
  event.notification.close();
});
