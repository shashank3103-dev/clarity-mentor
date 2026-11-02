import AsyncStorage from '@react-native-async-storage/async-storage';
import {config} from '../config';

const {storageKeys} = config;

/**
 * Secure token storage.
 *
 * For a production app you should migrate to react-native-keychain or
 * react-native-encrypted-storage. The current project already depends
 * on @react-native-async-storage/async-storage, so we use it here to
 * avoid adding extra native dependencies that need linking.
 *
 * All token access is routed through this module so migrating later is
 * a one-file change.
 */

export const tokenStorage = {
  /** Store the access token. */
  async setToken(token: string): Promise<void> {
    await AsyncStorage.setItem(storageKeys.accessToken, token);
  },

  /** Retrieve the stored access token. */
  async getToken(): Promise<string | null> {
    return AsyncStorage.getItem(storageKeys.accessToken);
  },

  /** Remove the access token on logout. */
  async removeToken(): Promise<void> {
    await AsyncStorage.removeItem(storageKeys.accessToken);
  },

  /** Store the user role (seeker | mentor | admin). */
  async setRole(role: string): Promise<void> {
    await AsyncStorage.setItem(storageKeys.userRole, role);
  },

  /** Retrieve the stored user role. */
  async getRole(): Promise<string | null> {
    return AsyncStorage.getItem(storageKeys.userRole);
  },

  /** Store serialised user data. */
  async setUser(user: object): Promise<void> {
    await AsyncStorage.setItem(storageKeys.userData, JSON.stringify(user));
  },

  /** Retrieve stored user data. */
  async getUser(): Promise<any | null> {
    const raw = await AsyncStorage.getItem(storageKeys.userData);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  /** Clear everything on full logout. */
  async clearAll(): Promise<void> {
    await AsyncStorage.multiRemove([
      storageKeys.accessToken,
      storageKeys.userRole,
      storageKeys.userData,
    ]);
  },
};
