/**
 * Generates a pseudo-random number using the Satellite's internal RNG.
 *
 * ⚠️ This function is not suitable for use cases requiring cryptographically secure or perfectly unpredictable randomness,
 * such as lotteries or gambling dApps.
 *
 * @returns {number} A pseudo-random 32-bit integer.
 *
 * @throws {Error} If the RNG has not been initialized.
 */
export const random = (): number => __juno_satellite_random();
