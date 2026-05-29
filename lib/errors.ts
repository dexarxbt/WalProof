export class IntegrationError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly retryable = true
  ) {
    super(message);
    this.name = "IntegrationError";
  }
}

export function errorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return "Unexpected error";
}
