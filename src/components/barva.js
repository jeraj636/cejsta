export class Barva {
  constructor(hex) {
    if (hex.substring(0, 1) === "#") hex = hex.substring(1);
    this.r = "0x".concat(hex.substring(0, 2));
    this.g = "0x".concat(hex.substring(2, 4));
    this.b = "0x".concat(hex.substring(4, 6));
    this.a = "0x".concat(hex.substring(6, 8));
    if (!hex.substring(6, 8)) {
      this.a = "0xFF";
    }

    this.r = Number(this.r) / 255;
    this.g = Number(this.g) / 255;
    this.b = Number(this.b) / 255;
    this.a = Number(this.a) / 255;
  }
}
