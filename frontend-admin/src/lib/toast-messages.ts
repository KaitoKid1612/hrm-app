/**
 * Centralized Toast Messages
 * Consistent, reusable success/error messages
 * Easier to maintain and translate
 */

type EntityType =
  | 'user'
  | 'company'
  | 'job'
  | 'application'
  | 'category'
  | 'skill'
  | 'interview'
  | 'setting';

type ActionType =
  | 'create'
  | 'update'
  | 'delete'
  | 'close'
  | 'reopen'
  | 'accept'
  | 'reject'
  | 'approve'
  | 'suspend'
  | 'activate';

/**
 * Generate consistent success message
 */
export const successMessage = (entity: EntityType, action: ActionType): string => {
  const entityLabels: Record<EntityType, string> = {
    user: 'User',
    company: 'Company',
    job: 'Job',
    application: 'Application',
    category: 'Category',
    skill: 'Skill',
    interview: 'Interview',
    setting: 'Settings',
  };

  const actionLabels: Record<ActionType, string> = {
    create: 'created',
    update: 'updated',
    delete: 'deleted',
    close: 'closed',
    reopen: 'reopened',
    accept: 'accepted',
    reject: 'rejected',
    approve: 'approved',
    suspend: 'suspended',
    activate: 'activated',
  };

  return `${entityLabels[entity]} ${actionLabels[action]} successfully`;
};

/**
 * Generate consistent error message
 */
export const errorMessage = (entity: EntityType, action: ActionType): string => {
  const entityLabels: Record<EntityType, string> = {
    user: 'user',
    company: 'company',
    job: 'job',
    application: 'application',
    category: 'category',
    skill: 'skill',
    interview: 'interview',
    setting: 'settings',
  };

  const actionLabels: Record<ActionType, string> = {
    create: 'create',
    update: 'update',
    delete: 'delete',
    close: 'close',
    reopen: 'reopen',
    accept: 'accept',
    reject: 'reject',
    approve: 'approve',
    suspend: 'suspend',
    activate: 'activate',
  };

  return `Failed to ${actionLabels[action]} ${entityLabels[entity]}`;
};

/**
 * Common toast messages
 */
export const MESSAGES = {
  // Generic
  LOADING: 'Loading...',
  SAVING: 'Saving...',
  DELETING: 'Deleting...',

  // Success
  SAVED: 'Saved successfully',
  DELETED: 'Deleted successfully',
  COPIED: 'Copied to clipboard',
  EXPORTED: 'Exported successfully',

  // Errors
  ERROR: 'An error occurred',
  NOT_FOUND: 'Resource not found',
  UNAUTHORIZED: 'You are not authorized to perform this action',
  NETWORK_ERROR: 'Network error. Please check your connection',

  // Confirmations
  CONFIRM_DELETE: 'Are you sure you want to delete this?',
  CONFIRM_BULK_DELETE: 'Are you sure you want to delete selected items?',
  CONFIRM_CLOSE: 'Are you sure you want to close this?',

  // Cache
  CACHE_CLEARED: 'Cache cleared successfully',

  // Email
  EMAIL_SENT: 'Email sent successfully',
  EMAIL_TEST_SUCCESS: 'Email connection test successful',
} as const;

/**
 * Extract error message from API error
 */
export const getApiErrorMessage = (error: unknown): string => {
  if (error && typeof error === 'object') {
    const err = error as {
      response?: {
        data?: {
          message?: string;
          error?: string;
        };
        status?: number;
      };
      message?: string;
    };

    // Try response.data.message
    if (err.response?.data?.message) {
      return err.response.data.message;
    }

    // Try response.data.error
    if (err.response?.data?.error) {
      return err.response.data.error;
    }

    // Try error.message
    if (err.message) {
      return err.message;
    }

    // Status-based messages
    if (err.response?.status === 401) {
      return MESSAGES.UNAUTHORIZED;
    }
    if (err.response?.status === 404) {
      return MESSAGES.NOT_FOUND;
    }
    if (err.response?.status === 500) {
      return 'Server error. Please try again later';
    }
  }

  return MESSAGES.ERROR;
};
