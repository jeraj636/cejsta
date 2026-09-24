export class Barva {
  r: number;
  g: number;
  b: number;
  a: number;
  constructor(hex: string) {
    if (hex.startsWith("#")) hex = hex.substring(1);
    this.r = Number("0x".concat(hex.substring(0, 2))) / 255;
    this.g = Number("0x".concat(hex.substring(2, 4))) / 255;
    this.b = Number("0x".concat(hex.substring(4, 6))) / 255;
    this.a = Number("0x".concat(hex.substring(6, 8))) / 255;

    if (!hex.substring(6, 8)) {
      this.a = 1;
    }
  }
}
