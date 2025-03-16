import { EventEmitter } from "expo-modules-core";

type StorageEvents = {
  storageUpdate: {
    key: string;
    value: string | null;
  };
  tokenRefresh: {
    success: boolean;
    message?: string;
  };
  userLogout: undefined;
};

type EventEmitterType = {
  emit<K extends keyof StorageEvents>(type: K, event: StorageEvents[K]): void;

  addListener<K extends keyof StorageEvents>(
    type: K,
    listener: (event: StorageEvents[K]) => void
  ): { remove: () => void };

  removeAllListeners<K extends keyof StorageEvents>(type?: K): void;
};

export const storageEventEmitter = new EventEmitter() as EventEmitterType;
