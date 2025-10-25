import { message } from "antd";

export const getLocalStorage = <T>(
  key: string,
  defaultValue: T | null = null
): T | null => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    message.error("Error reading from local storage：", error);
    return defaultValue;
  }
};

export const setLocalStorage = <T>(key: string, value: T): void => {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  } catch (error) {
    message.error("Error writing to local storage：", error);
  }
};

export const removeLocalStorage = (key: string): void => {
  localStorage.removeItem(key);
};

export const clearLocalStorage = (): void => {
  localStorage.clear();
};

export const getSessionStorage = <T>(
  key: string,
  defaultValue: T | null = null
): T | null => {
  try {
    const item = sessionStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    message.error("Error reading from session storage：", error);
    return defaultValue;
  }
};

export const setSessionStorage = <T>(key: string, value: T): void => {
  try {
    const serializedValue = JSON.stringify(value);
    sessionStorage.setItem(key, serializedValue);
  } catch (error) {
    message.error("Error writing to session storage：", error);
  }
};

export const removeSessionStorage = (key: string): void => {
  sessionStorage.removeItem(key);
};

export const clearSessionStorage = (): void => {
  sessionStorage.clear();
};
