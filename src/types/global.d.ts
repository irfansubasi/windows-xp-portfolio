declare global {
  interface Window {
    Dos?: (
      el: HTMLElement,
      opts: { url: string; autoStart: boolean }
    ) => { stop?: () => void };
  }
}
export {};
