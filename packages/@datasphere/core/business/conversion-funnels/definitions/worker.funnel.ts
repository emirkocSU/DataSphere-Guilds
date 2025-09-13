
/**
 * @file packages/@datasphere/core/business/conversion-funnels/definitions/worker.funnel.ts
 * @version 2.0.0
 * @description Defines the primary conversion funnel for a new worker, from signup to first payout.
 */

import { FunnelDefinition } from '../types';
import { FunnelName, FunnelStepEvent } from '../constants';

export const CoreWorkerOnboardingFunnel: FunnelDefinition = {
  funnelName: FunnelName.CORE_WORKER_ONBOARDING,
  description: 'Tracks the complete user journey from initial signup to receiving the first payment.',
  steps: [
    {
      stepId: 'signup',
      stepName: 'User Signed Up',
      completionEvent: FunnelStepEvent.USER_SIGNED_UP,
    },
    {
      stepId: 'onboarding_start',
      stepName: 'Onboarding Started',
      completionEvent: FunnelStepEvent.ONBOARDING_STARTED,
    },
    {
      stepId: 'profile_complete',
      stepName: 'Profile Completed',
      completionEvent: FunnelStepEvent.PROFILE_COMPLETED,
    },
    {
      stepId: 'task_viewed',
      stepName: 'First Task Viewed',
      completionEvent: FunnelStepEvent.FIRST_TASK_VIEWED,
    },
    {
      stepId: 'task_claimed',
      stepName: 'First Task Claimed',
      completionEvent: FunnelStepEvent.FIRST_TASK_CLAIMED,
    },
    {
      stepId: 'task_submitted',
      stepName: 'First Task Submitted',
      completionEvent: FunnelStepEvent.FIRST_TASK_SUBMITTED,
    },
    {
      stepId: 'task_approved',
      stepName: 'First Task Approved',
      completionEvent: FunnelStepEvent.FIRST_TASK_APPROVED,
    },
    {
      stepId: 'payout_configured',
      stepName: 'Payout Method Configured',
      completionEvent: FunnelStepEvent.PAYOUT_METHOD_CONFIGURED,
    },
    {
      stepId: 'payout_requested',
      stepName: 'First Payout Requested',
      completionEvent: FunnelStepEvent.FIRST_PAYOUT_REQUESTED,
    },
  ],
};
