import * as z from 'zod';
import {RawPrincipalSchema} from '../../schemas/candid';
import {
  type RawUserId,
  type Timestamp,
  type UserId,
  RawUserIdSchema,
  TimestampSchema,
  UserIdSchema
} from '../../schemas/satellite';

/**
 * @see ControllerScopeSchema
 */
export const ControllerScopeSchema = z.enum(['write', 'admin', 'automation']);

/**
 * Represents the permission scope of a controller.
 */
export type ControllerScope = z.infer<typeof ControllerScopeSchema>;

/**
 * @see MetadataSchema
 */
export const MetadataSchema = z.tuple([z.string(), z.string()]);

/**
 * Represents a single metadata entry as a key-value tuple.
 */
export type Metadata = z.infer<typeof MetadataSchema>;

/**
 * @see ControllerSchema
 */
export const ControllerSchema = z
  .object({
    metadata: z.array(MetadataSchema),
    created_at: TimestampSchema,
    updated_at: TimestampSchema,
    expires_at: TimestampSchema.optional(),
    scope: ControllerScopeSchema
  })
  .strict();

/**
 * Represents a controller with access scope and associated metadata.
 */
export interface Controller {
  /**
   * A list of key-value metadata pairs associated with the controller.
   */
  metadata: Metadata[];

  /**
   * The timestamp when the controller was created.
   */
  created_at: Timestamp;

  /**
   * The timestamp when the controller was last updated.
   */
  updated_at: Timestamp;

  /**
   * Optional expiration timestamp for the controller.
   * 👉 It's a placeholder for future implementation.
   */
  expires_at?: Timestamp;

  /**
   * The scope assigned to the controller.
   */
  scope: ControllerScope;
}

/**
 * @see ControllerRecordSchema
 */
export const ControllerRecordSchema = z.tuple([RawPrincipalSchema, ControllerSchema]);

/**
 * Represents a tuple containing the principal ID and associated controller data.
 */
export type ControllerRecord = z.infer<typeof ControllerRecordSchema>;

/**
 * @see ControllersSchema
 */
export const ControllersSchema = z.array(ControllerRecordSchema);

/**
 * Represents a list of controllers.
 */
export type Controllers = z.infer<typeof ControllersSchema>;

/**
 * @see ControllerCheckParamsSchema
 */
export const ControllerCheckParamsSchema = z.object({
  caller: RawUserIdSchema.or(UserIdSchema),
  controllers: ControllersSchema
});

/**
 * Represents the parameters required to perform controller checks.
 */
export interface ControllerCheckParams {
  /**
   * The identity of the caller to verify against the controller list.
   */
  caller: RawUserId | UserId;

  /**
   * The list of controllers to check against.
   */
  controllers: Controllers;
}
