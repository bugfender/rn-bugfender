/**
 * Options object for `Bugfender.getUserFeedback` with customised modal strings.
 */
export interface UserFeedbackOptions {
  /** Default: `Feedback`. */
  title?: string;
  /** Default `Please insert your feedback here and click send`. */
  hint?: string;
  /** Default: `Subject…`. */
  subjectPlaceholder?: string;
  /** Default: `Your feedback…`. */
  feedbackPlaceholder?: string;
  /** Default: `Send`. */
  submitLabel?: string;
  /** Default: `Close`. This attribute is only used on iOS */
  closeLabel?: string;
}

export class DefaultUserFeedbackOptions implements Required<UserFeedbackOptions> {
  constructor() {
    this.title = 'Feedback';
    this.hint = 'Please insert your feedback here and click send';
    this.subjectPlaceholder = 'Subject…';
    this.feedbackPlaceholder = 'Your feedback…';
    this.submitLabel = 'Send';
    this.closeLabel = 'Close';
  }

  feedbackPlaceholder: string;
  hint: string;
  subjectPlaceholder: string;
  submitLabel: string;
  title: string;
  closeLabel: string;
}

export interface UserFeedbackResult {
  /** `true` if the user has sent the feedback. `false` if she has closed the modal without sending it. */
  isSent: boolean;
  /** If the feedback was sent this will contain the Bugfender URL for the feedback. */
  feedbackURL?: string;
}
