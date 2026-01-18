/**
 * Utility to format AI service errors into user-friendly messages
 */

export function formatAIError(error: any): string {
  const errorMessage = error?.message || error?.toString() || '';
  const errorString = errorMessage.toLowerCase();

  // Check for quota/rate limit errors
  if (
    errorString.includes('quota') ||
    errorString.includes('resource_exhausted') ||
    errorString.includes('rate limit') ||
    errorString.includes('429') ||
    errorString.includes('too many requests')
  ) {
    return 'Our AI services are overloaded at the moment. Please try again later.';
  }

  // Check for API key errors
  if (
    errorString.includes('api key') ||
    errorString.includes('unauthorized') ||
    errorString.includes('401') ||
    errorString.includes('403')
  ) {
    return 'AI service authentication failed. Please contact support.';
  }

  // Check for network errors
  if (
    errorString.includes('network') ||
    errorString.includes('timeout') ||
    errorString.includes('econnrefused') ||
    errorString.includes('fetch failed')
  ) {
    return 'Network error connecting to AI services. Please check your connection and try again.';
  }

  // Check for service unavailable
  if (
    errorString.includes('503') ||
    errorString.includes('service unavailable') ||
    errorString.includes('temporarily unavailable')
  ) {
    return 'AI services are temporarily unavailable. Please try again in a few minutes.';
  }

  // Generic fallback
  if (errorString.includes('ai') || errorString.includes('gemini')) {
    return 'AI processing failed. Please try again or contact support if the issue persists.';
  }

  // Return original message if no pattern matches
  return errorMessage || 'An unexpected error occurred. Please try again.';
}

/**
 * Check if an error is related to AI quota/rate limits
 */
export function isAIQuotaError(error: any): boolean {
  const errorMessage = error?.message || error?.toString() || '';
  const errorString = errorMessage.toLowerCase();

  return (
    errorString.includes('quota') ||
    errorString.includes('resource_exhausted') ||
    errorString.includes('rate limit') ||
    errorString.includes('429') ||
    errorString.includes('too many requests')
  );
}
