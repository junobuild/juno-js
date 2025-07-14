import {nonNullish} from '@dfinity/utils';
import type {StandardSchemaV1} from '@standard-schema/spec';
import {SchemaError} from '../types/errors';

export const assertDataSchema = async <T extends StandardSchemaV1>({
  input,
  schema
}: {
  input: StandardSchemaV1.InferInput<T>;
  schema?: T;
}): Promise<void> => {
  const withSchema =
    nonNullish(schema) && nonNullish(schema['~standard']) && 'validate' in schema['~standard'];

  if (withSchema) {
    await validateSchema({input, schema});
  }
};

const validateSchema = async <T extends StandardSchemaV1>({
  input,
  schema
}: {
  input: StandardSchemaV1.InferInput<T>;
  schema: T;
}): Promise<StandardSchemaV1.InferOutput<T>> => {
  const validate = async (): Promise<StandardSchemaV1.Result<unknown>> => {
    const result = schema['~standard'].validate(input);

    if (result instanceof Promise) {
      return await result;
    }

    return result;
  };

  const {issues, ...value} = await validate();

  if (issues !== undefined) {
    throw new SchemaError(issues);
  }

  return value;
};
