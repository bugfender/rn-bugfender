import type { UserFeedbackOptions as BaseUserFeebackOptions } from '@bugfender/common';

/**
 * Options object for `Bugfender.getUserFeedback` with customised modal strings.
 */
export interface UserFeedbackOptions extends BaseUserFeebackOptions {
  /** Default `Please insert your feedback here and click send`. */
  hint?: string;
  /** Default: `Close`. This attribute is only used on iOS */
  closeLabel?: string;
}

export class DefaultUserFeedbackOptions implements Required<UserFeedbackOptions> {
  public title = 'Feedback';
  public hint = 'Please insert your feedback here and click send';
  public subjectPlaceholder = 'Subject…';
  public feedbackPlaceholder = 'Your feedback…';
  public submitLabel = 'Send';
  public closeLabel = 'Close';
}
