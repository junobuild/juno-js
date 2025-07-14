import {StandardSchemaV1} from '@standard-schema/spec';

export class SignInError extends Error {}
export class SignInInitError extends Error {}
export class SignInUserInterruptError extends Error {}

export class InitError extends Error {}

export class ListError extends Error {}

export class SchemaError extends Error {
  readonly issues: ReadonlyArray<StandardSchemaV1.Issue>;

  constructor(issues: ReadonlyArray<StandardSchemaV1.Issue>) {
    super(issues[0]?.message);

    this.issues = issues;
  }
}