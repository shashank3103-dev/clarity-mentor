export const isEmail = (value) => /^\S+@\S+\.\S+$/.test(value || "");
export const required = (value) => Boolean(value && String(value).trim());
