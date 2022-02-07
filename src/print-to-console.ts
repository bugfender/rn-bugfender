import {format} from 'util';
import type {ILogEntry} from "./types/log";
import {LogLevel} from "./types/log";

export class PrintToConsole {
  protected printToConsole: boolean = false;

  constructor(
    protected readonly console: Console,
  ) {
  }

  public init(printToConsole: boolean): void {
    this.printToConsole = printToConsole;
  }

  public error(...parameters: unknown[]): void {
    if (this.printToConsole) {
      this.console.error(...parameters);
    }
  }

  public info(...parameters: unknown[]): void {
    if (this.printToConsole) {
      this.console.info(...parameters);
    }
  }

  public log(...parameters: unknown[]): void {
    if (this.printToConsole) {
      this.console.log(...parameters);
    }
  }

  public debug(...parameters: unknown[]): void {
    if (this.printToConsole) {
      this.console.debug(...parameters);
    }
  }

  public trace(...parameters: unknown[]): void {
    if (this.printToConsole) {
      this.console.trace(...parameters);
    }
  }

  public warn(...parameters: unknown[]): void {
    if (this.printToConsole) {
      this.console.warn(...parameters);
    }
  }

  public printLog(log: ILogEntry): void {
    if (this.printToConsole) {
      // Log to browser console
      // debug, warning, error, trace, info, fatal
      const levelToMethod = ['log', 'warn', 'error', 'trace', 'info', 'error'];
      const method = levelToMethod[log.level || LogLevel.Debug];
      const tag = log.tag ? `[${log.tag}] ` : '';
      const location = [log.file || '', log.method || '', log.line || ''].filter(p => p !== '').join(':');
      const message = `${tag}${format(log.text)} ${location}`;

      // @ts-ignore
      this.console[method](message);
    }
  }
}
