/**
 * Represents the state of a sign-in or sign-up progress step.
 * - `in_progress`: The step is currently being executed.
 * - `success`: The step completed successfully.
 * - `error`: The step failed.
 */
export type SignProgressState = 'in_progress' | 'success' | 'error';

/**
 * Progress event emitted during a sign-in or sign-up flow.
 */
export interface SignProgress<Step> {
  /** Current step in the flow */
  step: Step;
  /** State of the current step */
  state: SignProgressState;
}

/**
 * Callback type for receiving progress updates during the sign-in or sign-up process.
 */
export type SignProgressFn<Step> = (progress: SignProgress<Step>) => void;