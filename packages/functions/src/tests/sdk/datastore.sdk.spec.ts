import {Principal} from '@dfinity/principal';
import {ZodError} from 'zod';
import {SetDocStoreParams} from '../../hooks/sdk';
import {setDocStore} from '../../sdk/datastore.sdk';

vi.stubGlobal('__juno_satellite_datastore_set_doc_store', vi.fn());

describe('datastore.sdk', () => {
  const validParams: SetDocStoreParams = {
    caller: Principal.anonymous().toUint8Array(),
    collection: 'users',
    key: 'user123',
    data: new Uint8Array([4, 5, 6]),
    description: 'Test document',
    version: BigInt(1)
  };

  it('should call __juno_satellite_datastore_set_doc_store with correct parameters', () => {
    setDocStore(validParams);

    expect(global.__juno_satellite_datastore_set_doc_store).toHaveBeenCalledWith(
      validParams.caller,
      validParams.collection,
      validParams.key,
      {
        data: validParams.data,
        description: validParams.description,
        version: validParams.version
      }
    );
  });

  it('should throw ZodError if params are invalid', () => {
    const invalidParams = {...validParams, collection: 123} as unknown as SetDocStoreParams;

    expect(() => setDocStore(invalidParams)).toThrow(ZodError);
  });

  it('should throw an error if the Satellite validation fails', () => {
    vi.mocked(global.__juno_satellite_datastore_set_doc_store).mockImplementation(() => {
      throw new Error('Satellite validation failed');
    });

    expect(() => setDocStore(validParams)).toThrowError('Satellite validation failed');
  });
});
