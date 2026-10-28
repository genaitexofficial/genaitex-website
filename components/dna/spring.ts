/** A value chasing a goal, with the speed it is moving at. */
export interface Spring {
  x: number;
  v: number;
}
export const spring = (x = 0): Spring => ({ x, v: 0 });

/**
 * One step of a critically damped spring toward `target` (no overshoot, and the speed changes continuously, so
 * a scroll starting, stopping or jumping a wheel notch glides instead of jerking). Returns how far it moved.
 * `smoothTime` is about how long a step takes to get most of the way there.
 */
export function damp(s: Spring, target: number, smoothTime: number, dt: number) {
  if (dt <= 0) return 0;
  const omega = 2 / smoothTime;
  const x = omega * dt;
  const decay = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
  const change = s.x - target;
  const carry = (s.v + omega * change) * dt;
  const before = s.x;
  s.v = (s.v - omega * carry) * decay;
  s.x = target + (change + carry) * decay;
  return Math.abs(s.x - before);
}
