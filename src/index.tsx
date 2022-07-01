import type { LogLevel } from '@bugfender/types';
import { SDKOptionsBuilder } from './types/sdk-options';
import { BugfenderClass } from './bugfender';

const Bugfender = new BugfenderClass();

export { Bugfender, LogLevel, SDKOptionsBuilder };
