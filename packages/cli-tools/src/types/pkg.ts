export interface PackageJson {
  name?: string;
  version?: string;
  juno?: PackageJsonJuno;
  dependencies?: Record<string, string>;
}

export interface PackageJsonJuno {
  functions?: PackageJsonJunoFunctions;
}

export interface PackageJsonJunoFunctions {
  name?: string;
  version?: string;
}
