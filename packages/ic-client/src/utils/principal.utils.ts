import {Principal} from '@icp-sdk/core/principal';

export const toPrincipal = (id: string | Principal): Principal =>
  id instanceof Principal ? id : Principal.from(id);
