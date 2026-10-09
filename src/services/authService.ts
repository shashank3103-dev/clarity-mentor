export const loginUser = async (credentials) => ({
  token: "mock-token",
  user: { name: credentials?.name || "Bhanu Pratap" },
});
export const registerUser = loginUser;
