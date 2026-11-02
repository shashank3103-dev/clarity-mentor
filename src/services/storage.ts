import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'auth-token';
const USER_TYPE_KEY = 'userType';
const ONBOARDED_KEY = 'clarity-onboarded';

export type UserType = 'seeker' | 'mentor';

// In-memory copy so the axios interceptor does not hit disk on every request.
let cachedToken: string | null = null;

export const storage = {
  async getToken() {
    if (cachedToken) return cachedToken;
    cachedToken = await AsyncStorage.getItem(TOKEN_KEY);
    return cachedToken;
  },
  async getUserType() {
    return (await AsyncStorage.getItem(USER_TYPE_KEY)) as UserType | null;
  },
  async setSession(token: string, userType: UserType) {
    cachedToken = token;
    await AsyncStorage.multiSet([
      [TOKEN_KEY, token],
      [USER_TYPE_KEY, userType],
    ]);
  },
  async clearSession() {
    cachedToken = null;
    await AsyncStorage.multiRemove([TOKEN_KEY, USER_TYPE_KEY]);
  },
  async isOnboarded() {
    return (await AsyncStorage.getItem(ONBOARDED_KEY)) === '1';
  },
  async setOnboarded() {
    await AsyncStorage.setItem(ONBOARDED_KEY, '1');
  },
};
