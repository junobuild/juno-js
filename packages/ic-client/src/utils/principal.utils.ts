import {Principal} from '@dfinity/principal';

export const toPrincipal = (id: string | Principal): Principal =>
  id instanceof Principal ? id : Principal.from(id);
