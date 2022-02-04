import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ColorGenerator {

  constructor() {}

  COLORS: any[] = ["#adae84",
  "#fab1eb",
  "#94bb76",
  "#bccfff",
  "#efe698",
  "#7fb0e1",
  "#bfb96e",
  "#22cceb",
  "#ffe3b1",
  "#08bec5",
  "#fff9cc",
  "#7fd7ff",
  "#d1ffbc",
  "#cbe8ff",
  "#6ebb92",
  "#70efff",
  "#d8ffeb",
  "#42d4ce",
  "#a0cccc",
  "#8bffff"]

  /*
  COLORS: any[] = ['#e57373', '#f06292', '#ba68c8', '#9575cd', '#7986cb', '#64b5f6',
    '#4fc3f7', '#4dd0e1', '#4db6ac', '#81c784', '#aed581', '#ff8a65', '#d4e157', '#673ab7',
    '#ffb74d', '#a1887f', '#90a4ae'];
  */


  public getColor(str: string): string {
    return this.COLORS[Math.abs(this.toNumber(str)) % this.COLORS.length];
  }

  private toNumber(str: string): number {
    let h = 0;

    for (let i = 0; i < str.length; i++) {
      h = 31 * h + str.charCodeAt(i);
      // tslint:disable-next-line: no-bitwise
      h |= 0; // Convert to 32bit integer
    }

    return h;
  }
}

