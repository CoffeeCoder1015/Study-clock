// electron-api.d.ts

export {};

declare global {
  interface Window {
    electronAPI: {
      getLocation: () => Promise<[number,number]>;
      // Add other methods here as needed
    };
  }
}
