import { StackClientApp } from "@stackframe/react";

// Initialize the core app instance (non-React)
export const stackClientApp = new StackClientApp({
  projectId: import.meta.env.VITE_STACK_PROJECT_ID,
  publishableClientKey: import.meta.env.VITE_STACK_PUBLISHABLE_KEY,
  tokenStore: "cookie",
  // Don't include redirectMethod here
});
