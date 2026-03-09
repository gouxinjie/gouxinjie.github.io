declare module "*.vue" {
  import type { DefineComponent } from "vue";

  const component: DefineComponent<Record<string, never>, Record<string, never>, unknown>;
  export default component;
}

declare module "canvas-confetti" {
  interface ConfettiOptions {
    [key: string]: unknown;
  }

  type ConfettiFn = (options?: ConfettiOptions) => Promise<null> | null;

  const confetti: ConfettiFn;
  export default confetti;
}

declare module "busuanzi.pure.js" {
  const busuanzi: {
    fetch: () => void;
  };

  export default busuanzi;
}