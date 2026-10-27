"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * Current year without making the server render time-dependent
 * (Cache Components would otherwise treat `new Date()` as request-time work).
 */
export function Year() {
  const year = useSyncExternalStore(
    subscribe,
    () => new Date().getFullYear(),
    () => 2026,
  );
  return <>{year}</>;
}
