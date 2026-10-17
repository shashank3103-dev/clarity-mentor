import {userLogin, userRegister, verifyRegisterOtp} from '../api/authApi';
import {tokenStorage} from '../storage/tokenStorage';

export const loginUser = async (credentials: {email: string; password: string}) => {
  const response = await userLogin(credentials);
  const data = response.data;
  const token = data?.token || data?.data?.token || data?.access_token;
  const user = data?.user || data?.data?.user || data?.data || {email: credentials.email};

  if (token) {
    await tokenStorage.setToken(token);
    if (user?.role) {
      await tokenStorage.setRole(user.role);
    }
    await tokenStorage.setUser(user);
  }

  return {token, user, data};
};

export const registerUser = async (payload: {
  name: string;
  email: string;
  password: string;
  role?: 'seeker' | 'mentor';
}) => {
  const response = await userRegister({
    name: payload.name,
    email: payload.email,
    password: payload.password,
    role: payload.role || 'seeker',
  });
  return response.data;
};

export const verifyOtp = async (payload: {
  email: string;
  otp: string;
  role?: 'seeker' | 'mentor';
}) => {
  const response = await verifyRegisterOtp({
    email: payload.email,
    otp: payload.otp,
    role: payload.role || 'seeker',
  });
  const data = response.data;
  const token = data?.token || data?.data?.token;
  if (token) {
    await tokenStorage.setToken(token);
  }
  return data;
};

export const logoutUser = async () => {
  await tokenStorage.clearAll();
};
