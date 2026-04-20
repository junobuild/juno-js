import type {Query} from '@junobuild/functions';
import {PrincipalSchema, Uint8ArraySchema} from '@junobuild/schema';
import * as z from 'zod';

export const mockQueryNoArgsNoResult: Query = {
  handler: () => {}
};

export const mockQueryWithArgsNoResult: Query = {
  args: z.object({name: z.string()}),
  handler: () => {}
};

export const mockQueryNoArgsWithResult: Query = {
  result: z.object({value: z.string()}),
  handler: () => ({value: 'hello'})
};

export const mockQueryWithArgsWithResult: Query = {
  args: z.object({name: z.string(), age: z.int().optional()}),
  result: z.object({value: z.string(), count: z.bigint()}),
  handler: () => ({value: 'hello', count: 42n})
};

export const mockQueryWithPrincipal: Query = {
  args: z.object({id: PrincipalSchema, name: z.string()}),
  result: z.object({owner: PrincipalSchema.optional()}),
  handler: () => ({owner: undefined})
};

export const mockQueryWithUint8Array: Query = {
  args: z.object({data: Uint8ArraySchema}),
  result: z.object({hash: Uint8ArraySchema.optional()}),
  handler: () => ({hash: undefined})
};

export const mockQueryWithArray: Query = {
  args: z.object({tags: z.array(z.string())}),
  result: z.object({items: z.array(z.object({id: z.bigint(), label: z.string()}))}),
  handler: () => ({items: []})
};

export const mockQueryWithEnum: Query = {
  args: z.object({status: z.enum(['active', 'inactive'])}),
  result: z.object({status: z.enum(['active', 'inactive'])}),
  handler: () => ({status: 'active' as const})
};

export const mockQueryWithNestedObject: Query = {
  args: z.object({address: z.object({street: z.string(), city: z.string().optional()})}),
  result: z.object({location: z.object({lat: z.number(), lng: z.number()})}),
  handler: () => ({location: {lat: 0, lng: 0}})
};
