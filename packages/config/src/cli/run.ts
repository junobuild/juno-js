import * as z from 'zod';
import {createFunctionSchema} from '../utils/zod.utils';
import {type OnRun, OnRunContextSchema, OnRunSchema} from './run.context';
import type {OnRunEnv} from './run.env';

export const RunFnSchema = z.function({
  input: z.tuple([OnRunContextSchema]),
  output: OnRunSchema
});
export type RunFn = (context: OnRunEnv) => OnRun;

export const RunFnOrObjectSchema = z.union([OnRunSchema, createFunctionSchema(RunFnSchema)]);
export type RunFnOrObject = OnRun | RunFn;

export function defineRun(run: OnRun): OnRun;
export function defineRun(run: RunFn): RunFn;
export function defineRun(run: RunFnOrObject): RunFnOrObject;
export function defineRun(run: RunFnOrObject): RunFnOrObject {
  return run;
}
