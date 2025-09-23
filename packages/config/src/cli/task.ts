import * as z from 'zod/v4';
import {createFunctionSchema} from '../utils/zod.utils';
import {type OnTask, OnRunContextSchema, OnTaskSchema} from './task.context';
import type {OnTaskEnv} from './task.env';

export const TaskFnSchema = z.function({
  input: z.tuple([OnRunContextSchema]),
  output: OnTaskSchema
});
export type TaskFn = (context: OnTaskEnv) => OnTask;

export const TaskFnOrObjectSchema = z.union([OnTaskSchema, createFunctionSchema(TaskFnSchema)]);
export type TaskFnOrObject = OnTask | TaskFn;

export function defineTask(task: OnTask): OnTask;
export function defineTask(task: TaskFn): TaskFn;
export function defineTask(task: TaskFnOrObject): TaskFnOrObject;
export function defineTask(task: TaskFnOrObject): TaskFnOrObject {
  return task;
}
