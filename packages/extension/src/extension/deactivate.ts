/**
 * @file deactivate.ts
 * @description Called by VS Code when the extension is deactivated.
 *
 * Note: VS Code automatically disposes all items added to `context.subscriptions`
 * in activate(). This file handles any async teardown that subscriptions can't cover.
 */

export function deactivate(): void {
  // Synchronous teardown only.
  // Async operations (e.g., Python server graceful shutdown) are handled
  // by PythonBridgeService.dispose(), which is registered as a subscription.
  //
  // Nothing to do here for Phase 1. This function exists as an explicit
  // hook for future phases (e.g., flushing telemetry, saving workspace state).
}
