const LOCAL_STORAGE_KEY = "nicole_react_pachi";
const SIGIL = "nicole_react_pachi_0";

let store = {
  pastSessions: [],
  currentSession: [],
  sigil: SIGIL,
};
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
    if (!jsonData || jsonData.sigil !== SIGIL) {
      return;
    }
    if (jsonData.currentSession.length) {
      jsonData.pastSessions = [
        jsonData.currentSession,
        ...jsonData.pastSessions,
      ];
    }
    jsonData.currentSession = [];
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
  listener(store.pastSessions);
  return () => listeners.delete(listener);
};

const push = (newSession) => {
  if (!initialized) {
    initialize();
  }

  // Make sure listeners are called asynchronously so React is happy
  window.setTimeout(() => {
    const newStore = {
      pastSessions: [newSession, ...store.pastSessions],
      currentSession: [],
      sigil: SIGIL,
    };
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newStore));
    } catch (e) {}
    store = newStore;
    listeners.forEach((l) => l(store.pastSessions));
  }, 0);
};

const getState = () => {
  if (!initialized) {
    initialize();
  }

  return store.pastSessions;
};

const update = (currentSession) => {
  store.currentSession = currentSession;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(store));
  } catch (e) {}
};

export const PlaySessionStore = { subscribe, push, getState, update };
