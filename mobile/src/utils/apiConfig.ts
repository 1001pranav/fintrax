/**
 * API Configuration Utilities
 * Centralized function to get API host based on environment
 */

import Constants from 'expo-constants';

/**
 * Get the API base URL dynamically
 * Priority:
 * 1. Environment variable (EXPO_PUBLIC_API_URL) - for manual override
 * 2. Auto-detect from Expo dev server host - for development
 * 3. Fallback to localhost
 */
export const getApiHost = (): string => {
  const port: number = 8080;
  // Check if we have a hardcoded API URL in env
  if (process.env.EXPO_PUBLIC_API_URL) {
    console.log('📍 Using API URL from env:', process.env.EXPO_PUBLIC_API_URL);
    return process.env.EXPO_PUBLIC_API_URL;
  }

  // In development, extract IP from Expo's development server
  const hostUri = Constants.expoConfig?.hostUri;
  console.log('📍 Expo hostUri:', hostUri);

  if (hostUri) {
    // hostUri format: "192.168.1.5:8081" - extract the IP part
    const host = hostUri.split(':')[0];
    const apiUrl = `http://${host}:${port}/api/`;
    console.log('📍 Auto-detected API URL:', apiUrl);
    return apiUrl;
  }

  // Fallback to localhost
  console.log('📍 Using fallback API URL: http://localhost:8080/');
  return 'http://localhost:8080/';
};

/**
 * Get the API timeout configuration
 */
export const getApiTimeout = (): number => {
  return 30000; // 30 seconds
};
