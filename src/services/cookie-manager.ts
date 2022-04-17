import Cookie from "js-cookie";

export const setCookie = (key: string, value: string, options = {}): void => {
  const defaultTime = new Date(Date.now() + 24 * 60 * 60 * 1000);
  Cookie.set(key, value, {
    expires: defaultTime,
    path: "/",
    domain: "localhost",
    ...options,
  });
};

export const getCookie = (key: string) => Cookie.get(key);

export const removeCookie = (key: string) => Cookie.remove(key);

export {};
