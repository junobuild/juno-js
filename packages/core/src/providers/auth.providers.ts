export class InternetIdentityProvider {
  #domain?: 'internetcomputer.org' | 'ic0.app';

  constructor({domain}: {domain?: 'internetcomputer.org' | 'ic0.app'}) {
    this.#domain = domain;
  }

  get domain() {
    return this.#domain;
  }
}

export class NFIDProvider {
  #appName: string;
  #logoUrl: string;

  constructor({appName, logoUrl}: {appName: string; logoUrl: string}) {
    this.#appName = appName;
    this.#logoUrl = logoUrl;
  }

  get appName() {
    return this.#appName;
  }

  get logoUrl() {
    return this.#logoUrl;
  }
}
