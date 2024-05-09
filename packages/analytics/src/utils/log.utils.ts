import {isNullish} from '@junobuild/utils/src';

export const warningNonNullish = <T>(value: T, message: string) => {
  if (isNullish(value)) {
    console.warn(message);
  }
};
