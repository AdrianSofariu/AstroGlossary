// utils/offlineQueue.ts
import axios from "axios";
import { request } from "http";

const STORAGE_KEY = "offline_operations";

// Add operation to the queue in localStorage
export const addToQueue = (operation: any) => {
  const queue = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  queue.push(operation);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
};

// Process and sync queued operations when online
export const processQueue = async (isOnline: boolean, isServerUp: boolean) => {
  if (!isOnline || !isServerUp) return;

  const queue = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  for (const op of queue) {
    try {
      await axios(op.request); // Execute the operation
    } catch (error) {
      //Try next operation if one fails
      console.log(op.request);
      console.error("Failed to sync operation:", error);
    }
  }
  localStorage.removeItem(STORAGE_KEY); // Clear queue after successful sync
};
