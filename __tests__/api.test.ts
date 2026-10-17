jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

import {tokenStorage} from '../src/storage/tokenStorage';
import api from '../src/api/axiosInstance';
import {config} from '../src/config';

describe('API Client & Token Storage', () => {
  beforeEach(async () => {
    await tokenStorage.clearAll();
  });

  test('config has valid base URL and storage keys', () => {
    expect(config.apiBaseUrl).toBeDefined();
    expect(config.requestTimeout).toBeGreaterThan(0);
    expect(config.storageKeys.accessToken).toBe('clarity_access_token');
  });

  test('token storage manages access tokens and roles', async () => {
    await tokenStorage.setToken('test-access-token');
    const token = await tokenStorage.getToken();
    expect(token).toBe('test-access-token');

    await tokenStorage.setRole('seeker');
    const role = await tokenStorage.getRole();
    expect(role).toBe('seeker');

    await tokenStorage.setUser({name: 'Test User', role: 'seeker'});
    const user = await tokenStorage.getUser();
    expect(user?.name).toBe('Test User');

    await tokenStorage.clearAll();
    expect(await tokenStorage.getToken()).toBeNull();
    expect(await tokenStorage.getRole()).toBeNull();
    expect(await tokenStorage.getUser()).toBeNull();
  });

  test('axiosInstance is initialized with configured base URL', () => {
    expect(api.defaults.baseURL).toBe(config.apiBaseUrl);
    expect(api.defaults.timeout).toBe(config.requestTimeout);
  });
});
