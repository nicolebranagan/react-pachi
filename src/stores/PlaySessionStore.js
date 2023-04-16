const LOCAL_STORAGE_KEY = "nicole_react_pachi";

let store = [];
const listeners = new Set();

let initialized = false;
const initialize = () => {
  initialized = true;

  try {
    const storeData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!storeData) {
      return;
    }
    const jsonData = JSON.parse(storeData);
    if (!Array.isArray(jsonData)) {
      return;
    }
    store = jsonData;
  } catch (e) {
    // Do nothing
  }
};

const subscribe = (listener) => {
  if (!initialized) {
    initialize();
  }

  listeners.add(listener);
  listener(store);
  return () => listeners.delete(listener);
};

const push = (newSession) => {
  if (!initialized) {
    initialize();
  }

  // Make sure listeners are called asynchronously so React is happy
  window.setTimeout(() => {
    const newStore = [...store, newSession];
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newStore));
    } catch (e) {}
    store = newStore;
    listeners.forEach((l) => l(store));
  }, 0);
};

const getState = () => {
  if (!initialized) {
    initialize();
  }

  return store;
};

export const PlaySessionStore = { subscribe, push, getState };
