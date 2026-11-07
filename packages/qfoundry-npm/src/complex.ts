/**
 * @file complex.ts
 * @description High-precision complex number mathematics for quantum amplitudes.
 */

export class Complex {
  constructor(public readonly real: number, public readonly imag: number) {}

  static zero(): Complex {
    return new Complex(0, 0);
  }

  static one(): Complex {
    return new Complex(1, 0);
  }

  static i(): Complex {
    return new Complex(0, 1);
  }

  static fromPolar(r: number, theta: number): Complex {
    return new Complex(r * Math.cos(theta), r * Math.sin(theta));
  }

  add(other: Complex): Complex {
    return new Complex(this.real + other.real, this.imag + other.imag);
  }

  subtract(other: Complex): Complex {
    return new Complex(this.real - other.real, this.imag - other.imag);
  }

  multiply(other: Complex): Complex {
    return new Complex(
      this.real * other.real - this.imag * other.imag,
      this.real * other.imag + this.imag * other.real
    );
  }

  multiplyScalar(scalar: number): Complex {
    return new Complex(this.real * scalar, this.imag * scalar);
  }

  divideScalar(scalar: number): Complex {
    return new Complex(this.real / scalar, this.imag / scalar);
  }

  conjugate(): Complex {
    return new Complex(this.real, -this.imag);
  }

  magnitudeSquared(): number {
    return this.real * this.real + this.imag * this.imag;
  }

  magnitude(): number {
    return Math.sqrt(this.magnitudeSquared());
  }

  phase(): number {
    return Math.atan2(this.imag, this.real);
  }

  toString(decimals: number = 4): string {
    const r = Math.abs(this.real) < 1e-9 ? 0 : Number(this.real.toFixed(decimals));
    const im = Math.abs(this.imag) < 1e-9 ? 0 : Number(this.imag.toFixed(decimals));
    if (im === 0) return `${r}`;
    if (r === 0) return `${im}i`;
    const sign = im >= 0 ? '+' : '-';
    return `${r} ${sign} ${Math.abs(im)}i`;
  }
}

