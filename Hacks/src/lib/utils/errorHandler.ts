export const sanitizeErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message.replace(/[<>]/g, '');
  }
  return 'An unknown error occurred';
};

export const logError = (error: unknown, context?: string): void => {
  const sanitizedMessage = sanitizeErrorMessage(error);
  const logMessage = context ? `[${context}] ${sanitizedMessage}` : sanitizedMessage;
  console.error(logMessage);
};