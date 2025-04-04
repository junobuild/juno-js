export interface PackageJson {
  version?: string;
  juno?: PackageJsonJuno;
  dependencies?: Record<string, string>;
}

export interface PackageJsonJuno {
  functions?: PackageJsonJunoFunctions;
}

export interface PackageJsonJunoFunctions {
  version?: string;
}
