export const mockMethodSignatures = [
  {name: 'build_version', paramsType: [], returnType: 'string'},
  {
    name: 'hello_world_world',
    paramsType: ['Hello', 'string', 'bigint'],
    returnType: 'Result'
  },
  {
    name: 'world',
    paramsType: ['Hello', 'string'],
    returnType: 'string'
  },
  {name: 'yolo', paramsType: ['Hello'], returnType: 'string'},
  {
    name: 'delete_errors',
    paramsType: ['Array<string>'],
    returnType: 'Result'
  }
];

export const mockImports = ['Hello', 'Result'];
