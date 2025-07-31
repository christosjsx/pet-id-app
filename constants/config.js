// constants/config.js

import { Platform } from 'react-native';

// Replace with your static IP address (set via router settings)
const LOCAL_IP = '192.168.0.100';
const PORT = '8000';

export const API_BASE_URL = `http://${LOCAL_IP}:${PORT}`;
