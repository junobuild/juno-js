import type {baseObjectInputType, baseObjectOutputType, ZodObject, ZodTypeAny} from 'zod';
import * as z from 'zod';
import {CollectionSchema, KeySchema} from '../../../schemas/satellite';
import {HookContextSchema} from '../context';
import {DocAssertSetSchema, DocUpsertSchema} from './payload';

/**
 * @see DocContext
 */
export const DocContextSchema = <T extends z.ZodTypeAny>(dataSchema: T) => {
  const schemaShape = {
    /**
     * The name of the collection where the document is stored.
     */
    collection: CollectionSchema,

    /**
     * The unique key identifying the document within the collection.
     */
    key: KeySchema,

    /**
     * The data associated with the document operation.
     */
    data: dataSchema
  };

  // TODO: workaround for https://github.com/colinhacks/zod/issues/3998
  return z.object(schemaShape).strict() as ZodObject<
    typeof schemaShape,
    'strict',
    ZodTypeAny,
    baseObjectOutputType<typeof schemaShape>,
    baseObjectInputType<typeof schemaShape>
  >;
};

/**
 * Represents the context of a document operation within a collection.
 *
 * @template T - The type of data associated with the document.
 */
export type DocContext<T extends z.ZodTypeAny> = z.infer<ReturnType<typeof DocContextSchema<T>>>;

/**
 * @see OnSetDocContext
 */
export const OnSetDocContextSchema = HookContextSchema(DocContextSchema(DocUpsertSchema));

/**
 * The context provided to the `onSetDoc` hook.
 *
 * This context contains information about the document being created or updated,
 * along with details about the user who triggered the operation.
 */
export type OnSetDocContext = z.infer<typeof OnSetDocContextSchema>;

/**
 * @see AssertSetDocContext
 */
export const AssertSetDocContextSchema = HookContextSchema(DocContextSchema(DocAssertSetSchema));

/**
 * The context provided to the `assertSetDoc` hook.
 *
 * This context contains information about the document being validated before
 * it is created or updated. If validation fails, the developer should throw an error.
 */
export type AssertSetDocContext = z.infer<typeof AssertSetDocContextSchema>;
