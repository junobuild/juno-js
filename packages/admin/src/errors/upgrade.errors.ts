export class UpgradeCodeUnchangedError extends Error {
  constructor() {
    super(
      'The Wasm code for the upgrade is identical to the code currently installed. No upgrade is necessary.'
    );
  }
}
