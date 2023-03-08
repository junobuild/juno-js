// How long the delegation identity should remain valid?
// e.g. BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000) = 7 days in nanoseconds
// For Juno: 4 hours
export const delegationIdentityExpiration = BigInt(4 * 60 * 60 * 1000 * 1000 * 1000);

export const popupWidth = 576;
export const popupHeight = 576;

// Worker
export const AUTH_TIMER_INTERVAL = 1000;
