export class AutomationError extends Error {}

export class GenerateJwtError extends Error {
  constructor(options?: ErrorOptions) {
    super('Jwt generation failed', options);
  }
}
