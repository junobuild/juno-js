// Prefix for developer-defined custom functions (query or update) and structs on the backend.
// e.g. app_hello_world (Candid), AppHelloWorldArgs (Rust struct)
// Avoids conflicts with built-in Juno features.
export const BACKEND_FUNCTION_NAMESPACE = 'App';

// Named export wrapping all generated frontend API functions.
// e.g. import {functions} from './satellite.api'; functions.helloWorld()
// The generated function names are identical to the developer's backend function names,
// so wrapping them in a namespace avoids import conflicts.
export const FRONTEND_FUNCTION_NAMESPACE = 'functions';
