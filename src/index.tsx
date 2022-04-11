import { LogLevel } from './types/log';
import { SDKOptionsBuilder } from './types/sdk-options';
import { BugfenderClass } from './bugfender';

const Bugfender = new BugfenderClass();

export { Bugfender, LogLevel, SDKOptionsBuilder };
