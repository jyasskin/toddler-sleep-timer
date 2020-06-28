importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

workbox.routing.registerRoute(
  () => true,
  new workbox.strategies.NetworkFirst()
);
