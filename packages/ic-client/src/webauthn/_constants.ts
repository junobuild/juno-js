// See https://www.iana.org/assignments/cose/cose.xhtml#algorithms for a complete
// list of these algorithms. We only list the ones we support here.
//
// According Google tutorial, https://web.dev/articles/passkey-registration, specifying
// support for ECDSA with P-256 (-7) and RSA PKCS#1 (-257) gives complete coverage.
export const PUBLIC_KEY_COSE_ALGORITHMS = {
  ECDSA_WITH_SHA256: -7,
  RSA_WITH_SHA256: -257
};

export const AUTHENTICATOR_ABORT_TIMEOUT = 60000;
