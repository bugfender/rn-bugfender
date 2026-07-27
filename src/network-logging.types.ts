export type NetworkHeaders = Record<string, string>;

/**
 * Obfuscated request fields returned by a request obfuscation handler.
 */
export type NetworkRequestData = {
  url: string;
  headers: NetworkHeaders;
  body: string | null;
};

/**
 * Obfuscated response fields returned by a response obfuscation handler.
 */
export type NetworkResponseData = {
  headers: NetworkHeaders;
  body: string | null;
};

/**
 * Request obfuscation: receive URL, headers, and body; return possibly redacted values.
 */
export type NetworkLoggingRequestObfuscationHandler = (
  url: string,
  headers: NetworkHeaders,
  body: string | null
) => NetworkRequestData;

/**
 * Response obfuscation: receive headers and body; return possibly redacted values.
 */
export type NetworkLoggingResponseObfuscationHandler = (
  headers: NetworkHeaders,
  body: string | null
) => NetworkResponseData;
