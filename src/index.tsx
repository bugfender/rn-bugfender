import { LogLevel } from '@bugfender/common';
import { SDKOptionsBuilder } from './types/sdk-options';
import { BugfenderClass } from './bugfender';
export type {
  NetworkHeaders,
  NetworkRequestData,
  NetworkResponseData,
  NetworkLoggingRequestObfuscationHandler,
  NetworkLoggingResponseObfuscationHandler,
} from './network-logging.types';

const Bugfender = new BugfenderClass();

export { Bugfender, LogLevel, SDKOptionsBuilder };
