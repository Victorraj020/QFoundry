/**
 * @file gates.ts
 * @description Standard quantum gate unitary definitions.
 */

import { Complex } from './complex';

export type Matrix2x2 = [[Complex, Complex], [Complex, Complex]];

const INV_SQRT2 = 1 / Math.SQRT2;

export const GATES = {
  h: (): Matrix2x2 => [
    [new Complex(INV_SQRT2, 0), new Complex(INV_SQRT2, 0)],
    [new Complex(INV_SQRT2, 0), new Complex(-INV_SQRT2, 0)],
  ],
  x: (): Matrix2x2 => [
    [Complex.zero(), Complex.one()],
    [Complex.one(), Complex.zero()],
  ],
  y: (): Matrix2x2 => [
    [Complex.zero(), new Complex(0, -1)],
    [new Complex(0, 1), Complex.zero()],
  ],
  z: (): Matrix2x2 => [
    [Complex.one(), Complex.zero()],
    [Complex.zero(), new Complex(-1, 0)],
  ],
  s: (): Matrix2x2 => [
    [Complex.one(), Complex.zero()],
    [Complex.zero(), new Complex(0, 1)],
  ],
  sdg: (): Matrix2x2 => [
    [Complex.one(), Complex.zero()],
    [Complex.zero(), new Complex(0, -1)],
  ],
  t: (): Matrix2x2 => [
    [Complex.one(), Complex.zero()],
    [Complex.zero(), new Complex(INV_SQRT2, INV_SQRT2)],
  ],
  tdg: (): Matrix2x2 => [
    [Complex.one(), Complex.zero()],
    [Complex.zero(), new Complex(INV_SQRT2, -INV_SQRT2)],
  ],
  rx: (theta: number): Matrix2x2 => {
    const half = theta / 2;
    return [
      [new Complex(Math.cos(half), 0), new Complex(0, -Math.sin(half))],
      [new Complex(0, -Math.sin(half)), new Complex(Math.cos(half), 0)],
    ];
  },
  ry: (theta: number): Matrix2x2 => {
    const half = theta / 2;
    return [
      [new Complex(Math.cos(half), 0), new Complex(-Math.sin(half), 0)],
      [new Complex(Math.sin(half), 0), new Complex(Math.cos(half), 0)],
    ];
  },
  rz: (phi: number): Matrix2x2 => {
    const half = phi / 2;
    return [
      [new Complex(Math.cos(-half), Math.sin(-half)), Complex.zero()],
      [Complex.zero(), new Complex(Math.cos(half), Math.sin(half))],
    ];
  },
  p: (lambda: number): Matrix2x2 => [
    [Complex.one(), Complex.zero()],
    [Complex.zero(), new Complex(Math.cos(lambda), Math.sin(lambda))],
  ],
  u: (theta: number, phi: number, lambda: number): Matrix2x2 => {
    const half = theta / 2;
    const cosHalf = Math.cos(half);
    const sinHalf = Math.sin(half);
    return [
      [
        new Complex(cosHalf, 0),
        new Complex(-Math.sin(lambda) * sinHalf, 0).subtract(
          new Complex(0, Math.cos(lambda) * sinHalf)
        ).multiplyScalar(-1), // -e^(i*lambda)*sin(theta/2)
      ],
      [
        Complex.fromPolar(sinHalf, phi),
        Complex.fromPolar(cosHalf, phi + lambda),
      ],
    ];
  },
};

