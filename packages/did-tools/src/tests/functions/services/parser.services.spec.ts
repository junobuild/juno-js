import {PrincipalSchema} from '@junobuild/functions';
import * as z from 'zod';
import {parseFunctions} from '../../../functions/services/parser.services';

const DERIVES = '#[derive(CandidType, Serialize, Deserialize, Clone, JsonData)]';

describe('parseFunctions', () => {
  describe('query', () => {
    it('should generate a sync query with no args and no result', () => {
      const result = parseFunctions({
        queries: [['helloWorld', {handler: () => {}}]],
        updates: []
      });

      expect(result).toContain('#[ic_cdk::query]');
      expect(result).toContain('fn hello_world()');
      expect(result).toContain(
        'execute_sync_function::<NoArgs, NoResult>("helloWorld", None).unwrap_or_trap();'
      );
    });

    it('should generate an async query with no args and no result', () => {
      const result = parseFunctions({
        queries: [['helloWorld', {handler: async () => {}}]],
        updates: []
      });

      expect(result).toContain('#[ic_cdk::query]');
      expect(result).toContain('async fn hello_world()');
      expect(result).toContain('execute_async_function::<NoArgs, NoResult>("helloWorld", None)');
    });

    it('should generate a sync query with args and result', () => {
      const ArgsSchema = z.object({value: z.string()});
      const ResultSchema = z.object({text: z.string()});

      const result = parseFunctions({
        queries: [
          [
            'helloWorld',
            {
              args: ArgsSchema,
              result: ResultSchema,
              handler: (_args: any) => ({text: 'hello'})
            }
          ]
        ],
        updates: []
      });

      expect(result).toContain('#[ic_cdk::query]');
      expect(result).toContain('fn hello_world(args: HelloWorldArgs) -> HelloWorldResult');
      expect(result).toContain('execute_sync_function("helloWorld", Some(args))');
      expect(result).toContain(
        `${DERIVES}\npub struct HelloWorldArgs {\n    pub value: String,\n}`
      );
      expect(result).toContain(
        `${DERIVES}\npub struct HelloWorldResult {\n    pub text: String,\n}`
      );
    });

    it('should generate an async query with args and result', () => {
      const ArgsSchema = z.object({value: z.string()});
      const ResultSchema = z.object({text: z.string()});

      const result = parseFunctions({
        queries: [
          [
            'helloWorld',
            {
              args: ArgsSchema,
              result: ResultSchema,
              handler: async (_args: any) => ({text: 'hello'})
            }
          ]
        ],
        updates: []
      });

      expect(result).toContain('#[ic_cdk::query]');
      expect(result).toContain('async fn hello_world(args: HelloWorldArgs) -> HelloWorldResult');
      expect(result).toContain('execute_async_function("helloWorld", Some(args))');
      expect(result).toContain(
        `${DERIVES}\npub struct HelloWorldArgs {\n    pub value: String,\n}`
      );
      expect(result).toContain(
        `${DERIVES}\npub struct HelloWorldResult {\n    pub text: String,\n}`
      );
    });

    it('should generate a sync query with result only', () => {
      const ResultSchema = z.object({text: z.string()});

      const result = parseFunctions({
        queries: [
          [
            'helloWorld',
            {
              result: ResultSchema,
              handler: () => ({text: 'hello'})
            }
          ]
        ],
        updates: []
      });

      expect(result).toContain('fn hello_world() -> HelloWorldResult');
      expect(result).toContain(
        'execute_sync_function::<NoArgs, HelloWorldResult>("helloWorld", None)'
      );
    });

    it('should generate an async query with result only', () => {
      const ResultSchema = z.object({text: z.string()});

      const result = parseFunctions({
        queries: [
          [
            'helloWorld',
            {
              result: ResultSchema,
              handler: async () => ({text: 'hello'})
            }
          ]
        ],
        updates: []
      });

      expect(result).toContain('async fn hello_world() -> HelloWorldResult');
      expect(result).toContain(
        'execute_async_function::<NoArgs, HelloWorldResult>("helloWorld", None)'
      );
    });
  });

  describe('update', () => {
    it('should generate a sync update with no args and no result', () => {
      const result = parseFunctions({
        queries: [],
        updates: [['yolo', {handler: () => {}}]]
      });

      expect(result).toContain('#[ic_cdk::update]');
      expect(result).toContain('fn yolo()');
      expect(result).toContain(
        'execute_sync_function::<NoArgs, NoResult>("yolo", None).unwrap_or_trap();'
      );
    });

    it('should generate an async update with no args and no result', () => {
      const result = parseFunctions({
        queries: [],
        updates: [['yolo', {handler: async () => {}}]]
      });

      expect(result).toContain('#[ic_cdk::update]');
      expect(result).toContain('async fn yolo()');
      expect(result).toContain('execute_async_function::<NoArgs, NoResult>("yolo", None)');
    });

    it('should generate a sync update with args and result', () => {
      const ArgsSchema = z.object({value: z.string()});
      const ResultSchema = z.object({caller: PrincipalSchema});

      const result = parseFunctions({
        queries: [],
        updates: [
          [
            'welcome',
            {
              args: ArgsSchema,
              result: ResultSchema,
              handler: (_args: any) => ({caller: {} as any})
            }
          ]
        ]
      });

      expect(result).toContain('#[ic_cdk::update]');
      expect(result).toContain('fn welcome(args: WelcomeArgs) -> WelcomeResult');
      expect(result).toContain('execute_sync_function("welcome", Some(args))');
      expect(result).toContain(`${DERIVES}\npub struct WelcomeArgs {\n    pub value: String,\n}`);
      expect(result).toContain('pub caller: Principal');
    });

    it('should generate an async update with args and result', () => {
      const ArgsSchema = z.object({value: z.string()});
      const ResultSchema = z.object({caller: PrincipalSchema});

      const result = parseFunctions({
        queries: [],
        updates: [
          [
            'welcome',
            {
              args: ArgsSchema,
              result: ResultSchema,
              handler: async (_args: any) => ({caller: {} as any})
            }
          ]
        ]
      });

      expect(result).toContain('#[ic_cdk::update]');
      expect(result).toContain('async fn welcome(args: WelcomeArgs) -> WelcomeResult');
      expect(result).toContain('execute_async_function("welcome", Some(args))');
      expect(result).toContain(`${DERIVES}\npub struct WelcomeArgs {\n    pub value: String,\n}`);
      expect(result).toContain('pub caller: Principal');
    });

    it('should generate a sync update with result only', () => {
      const ResultSchema = z.object({value: z.bigint()});

      const result = parseFunctions({
        queries: [],
        updates: [
          [
            'welcome_without_args',
            {
              result: ResultSchema,
              handler: () => ({value: 123n})
            }
          ]
        ]
      });

      expect(result).toContain('fn welcome_without_args() -> Welcome_without_argsResult');
      expect(result).toContain(
        'execute_sync_function::<NoArgs, Welcome_without_argsResult>("welcome_without_args", None)'
      );
    });

    it('should generate an async update with result only', () => {
      const ResultSchema = z.object({value: z.bigint()});

      const result = parseFunctions({
        queries: [],
        updates: [
          [
            'welcome_without_args',
            {
              result: ResultSchema,
              handler: async () => ({value: 123n})
            }
          ]
        ]
      });

      expect(result).toContain('async fn welcome_without_args() -> Welcome_without_argsResult');
      expect(result).toContain(
        'execute_async_function::<NoArgs, Welcome_without_argsResult>("welcome_without_args", None)'
      );
    });
  });

  describe('convertCamelToSnake', () => {
    it('should convert camelCase to snake_case via generated fn name', () => {
      const result = parseFunctions({
        queries: [['helloWorld', {handler: () => {}}]],
        updates: []
      });
      expect(result).toContain('fn hello_world()');
    });

    it('should keep already snake_case names as is', () => {
      const result = parseFunctions({
        queries: [],
        updates: [['welcome_without_args', {handler: async () => {}}]]
      });
      expect(result).toContain('fn welcome_without_args()');
    });
  });
});
