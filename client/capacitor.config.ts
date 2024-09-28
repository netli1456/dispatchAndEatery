import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mbite.app',
  appName: 'dispatchEatery',
  webDir: 'build',
  server: {
    androidScheme: 'https', // Allow HTTPS in Android WebView
    allowNavigation: ['capacitor://localhost', 'http://localhost', 'http://10.0.2.2:3000'], 
  },
};

export default config;
