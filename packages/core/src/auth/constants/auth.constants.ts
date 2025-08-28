// How long the delegation identity should remain valid?
// e.g. BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000) = 7 days in nanoseconds
// For Juno: 4 hours
export const DELEGATION_IDENTITY_EXPIRATION = BigInt(4 * 60 * 60 * 1000 * 1000 * 1000);

// We consider PIN authentication as "insecure" because users can easily lose their PIN if they do not register a passphrase, especially since Safari clears the browser cache every two weeks in cases of inactivity.
// That's why we disable it by default.
export const ALLOW_PIN_AUTHENTICATION = false;

export const II_POPUP: {width: number; height: number} = {width: 576, height: 576};
export const NFID_POPUP: {width: number; height: number} = {width: 505, height: 705};

export const INTERNET_COMPUTER_ORG = 'internetcomputer.org';

// Worker
export const AUTH_TIMER_INTERVAL = 1000;
