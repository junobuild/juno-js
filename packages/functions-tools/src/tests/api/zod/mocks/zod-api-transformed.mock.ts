export const mockTsNoArgsNoResult = `export const helloWorld = async (): Promise<void> => {
  const {app_hello_world} = await getSatelliteExtendedActor<SatelliteActor>({idlFactory});
  await app_hello_world();
};`;

export const mockTsWithArgsNoResult = `const AppHelloWorldArgsSchema = z.strictObject({name: z.string()});

export const helloWorld = async (args: z.infer<typeof AppHelloWorldArgsSchema>): Promise<void> => {
  const parsedArgs = AppHelloWorldArgsSchema.parse(args);
  const idlArgs = recursiveToNullable({schema: AppHelloWorldArgsSchema, value: parsedArgs});

  const {app_hello_world} = await getSatelliteExtendedActor<SatelliteActor>({idlFactory});
  await app_hello_world(idlArgs);
};`;

export const mockTsNoArgsWithResult = `const AppHelloWorldResultSchema = z.strictObject({value: z.string()});

export const helloWorld = async (): Promise<z.infer<typeof AppHelloWorldResultSchema>> => {
  const {app_hello_world} = await getSatelliteExtendedActor<SatelliteActor>({idlFactory});
  const idlResult = await app_hello_world();

  const result = recursiveFromNullable({schema: AppHelloWorldResultSchema, value: idlResult});
  return AppHelloWorldResultSchema.parse(result);
};`;

export const mockTsWithArgsWithResult = `const AppHelloWorldArgsSchema = z.strictObject({name: z.string(), age: z.optional(z.int())});
const AppHelloWorldResultSchema = z.strictObject({value: z.string(), count: z.bigint()});

export const helloWorld = async (args: z.infer<typeof AppHelloWorldArgsSchema>): Promise<z.infer<typeof AppHelloWorldResultSchema>> => {
  const parsedArgs = AppHelloWorldArgsSchema.parse(args);
  const idlArgs = recursiveToNullable({schema: AppHelloWorldArgsSchema, value: parsedArgs});

  const {app_hello_world} = await getSatelliteExtendedActor<SatelliteActor>({idlFactory});
  const idlResult = await app_hello_world(idlArgs);

  const result = recursiveFromNullable({schema: AppHelloWorldResultSchema, value: idlResult});
  return AppHelloWorldResultSchema.parse(result);
};`;

export const mockJsNoArgsNoResult = `export const helloWorld = async () => {
  const {app_hello_world} = await getSatelliteExtendedActor({idlFactory});
  await app_hello_world();
};`;

export const mockJsWithArgsNoResult = `const AppHelloWorldArgsSchema = z.strictObject({name: z.string()});

export const helloWorld = async (args) => {
  const parsedArgs = AppHelloWorldArgsSchema.parse(args);
  const idlArgs = recursiveToNullable({schema: AppHelloWorldArgsSchema, value: parsedArgs});

  const {app_hello_world} = await getSatelliteExtendedActor({idlFactory});
  await app_hello_world(idlArgs);
};`;

export const mockJsNoArgsWithResult = `const AppHelloWorldResultSchema = z.strictObject({value: z.string()});

export const helloWorld = async () => {
  const {app_hello_world} = await getSatelliteExtendedActor({idlFactory});
  const idlResult = await app_hello_world();

  const result = recursiveFromNullable({schema: AppHelloWorldResultSchema, value: idlResult});
  return AppHelloWorldResultSchema.parse(result);
};`;

export const mockJsWithArgsWithResult = `const AppHelloWorldArgsSchema = z.strictObject({name: z.string(), age: z.optional(z.int())});
const AppHelloWorldResultSchema = z.strictObject({value: z.string(), count: z.bigint()});

export const helloWorld = async (args) => {
  const parsedArgs = AppHelloWorldArgsSchema.parse(args);
  const idlArgs = recursiveToNullable({schema: AppHelloWorldArgsSchema, value: parsedArgs});

  const {app_hello_world} = await getSatelliteExtendedActor({idlFactory});
  const idlResult = await app_hello_world(idlArgs);

  const result = recursiveFromNullable({schema: AppHelloWorldResultSchema, value: idlResult});
  return AppHelloWorldResultSchema.parse(result);
};`;
