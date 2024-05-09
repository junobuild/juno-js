import {isNullish} from '@junobuild/utils';

export const warningNonNullish = <T>(value: T, message: string) => {
  if (isNullish(value)) {
    console.warn(message);
  }
};
