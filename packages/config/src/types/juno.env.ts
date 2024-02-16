export type JunoConfigMode = 'production' | 'development' | string;

export interface JunoConfigEnv {
  mode: JunoConfigMode;
}
