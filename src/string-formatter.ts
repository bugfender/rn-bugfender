import {format} from "util";

export class StringFormatter {
  public format(parameters: unknown[]): string {
    const [, ...textParams] = parameters;
    let [textFormat] = parameters as string[];
    let text: string;

    try {
      // Our sanitizer gives better results, try with it first
      textFormat = this.toString(textFormat);
    } catch {
      // Fallback to `format`
      textFormat = format(textFormat);
    }

    if (textParams.length > 0) {
      text = format(textFormat, ...textParams);
    } else {
      text = textFormat;
    }

    return text;
  }

  private toString(value: unknown): string {
    // Depending on the type we prefer to do `String` or `stringify`
    const isToString = ['string', 'symbol', 'bigint', 'function'].includes(typeof value) || value instanceof Error;

    if (isToString) {
      try {
        return String(value);
      } catch {
        return JSON.stringify(value);
      }
    } else {
      try {
        return JSON.stringify(value);
      } catch {
        return String(value);
      }
    }
  }
}
