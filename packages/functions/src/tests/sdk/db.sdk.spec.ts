import {Principal} from '@dfinity/principal';
import {ZodError} from 'zod';
import {deleteDocStore, setDocStore} from '../../sdk/db.sdk';
import {DeleteDocStoreParams, SetDocStoreParams} from '../../sdk/schemas/db';

vi.stubGlobal('__juno_satellite_datastore_set_doc_store', vi.fn());
vi.stubGlobal('__juno_satellite_datastore_delete_doc_store', vi.fn());

describe('db.sdk', () => {
  const key = 'user123';
  const collection = 'users';

  describe('setDocStore', () => {
    const baseDoc = {
      data: new Uint8Array([4, 5, 6]),
      description: 'Test document',
      version: BigInt(1)
    };

    const validParamsWithUint8Array: SetDocStoreParams = {
      caller: Principal.anonymous().toUint8Array(),
      collection,
      key,
      doc: baseDoc
    };

    const validParamsWithPrincipal: SetDocStoreParams = {
      caller: Principal.anonymous(),
      collection,
      key,
      doc: baseDoc
    };

    it('should call __juno_satellite_datastore_set_doc_store with correct parameters when caller is Uint8Array', () => {
      setDocStore(validParamsWithUint8Array);

      expect(global.__juno_satellite_datastore_set_doc_store).toHaveBeenCalledWith(
        validParamsWithUint8Array.caller,
        validParamsWithUint8Array.collection,
        validParamsWithUint8Array.key,
        {
          data: validParamsWithUint8Array.doc.data,
          description: validParamsWithUint8Array.doc.description,
          version: validParamsWithUint8Array.doc.version
        }
      );
    });

    it('should call __juno_satellite_datastore_set_doc_store with caller converted to Uint8Array when caller is Principal', () => {
      setDocStore(validParamsWithPrincipal);

      expect(global.__juno_satellite_datastore_set_doc_store).toHaveBeenCalledWith(
        (validParamsWithPrincipal.caller as Principal).toUint8Array(),
        validParamsWithPrincipal.collection,
        validParamsWithPrincipal.key,
        {
          data: validParamsWithPrincipal.doc.data,
          description: validParamsWithPrincipal.doc.description,
          version: validParamsWithPrincipal.doc.version
        }
      );
    });

    it('should throw ZodError if params are invalid', () => {
      const invalidParams = {
        ...validParamsWithUint8Array,
        collection: 123
      } as unknown as SetDocStoreParams;

      expect(() => setDocStore(invalidParams)).toThrow(ZodError);
    });

    it('should throw an error if the Satellite validation fails', () => {
      vi.mocked(global.__juno_satellite_datastore_set_doc_store).mockImplementation(() => {
        throw new Error('Satellite validation failed');
      });

      expect(() => setDocStore(validParamsWithUint8Array)).toThrowError(
        'Satellite validation failed'
      );
    });
  });

  describe('deleteDocStore', () => {
    const baseDoc = {
      version: BigInt(1)
    };

    const validParamsWithUint8Array: DeleteDocStoreParams = {
      caller: Principal.anonymous().toUint8Array(),
      collection,
      key,
      doc: baseDoc
    };

    const validParamsWithPrincipal: DeleteDocStoreParams = {
      caller: Principal.anonymous(),
      collection,
      key,
      doc: baseDoc
    };

    it('should call __juno_satellite_datastore_delete_doc_store with correct parameters when caller is Uint8Array', () => {
      deleteDocStore(validParamsWithUint8Array);

      expect(global.__juno_satellite_datastore_delete_doc_store).toHaveBeenCalledWith(
        validParamsWithUint8Array.caller,
        validParamsWithUint8Array.collection,
        validParamsWithUint8Array.key,
        {
          version: validParamsWithUint8Array.doc.version
        }
      );
    });

    it('should call __juno_satellite_datastore_delete_doc_store with caller converted to Uint8Array when caller is Principal', () => {
      deleteDocStore(validParamsWithPrincipal);

      expect(global.__juno_satellite_datastore_delete_doc_store).toHaveBeenCalledWith(
        (validParamsWithPrincipal.caller as Principal).toUint8Array(),
        validParamsWithPrincipal.collection,
        validParamsWithPrincipal.key,
        {
          version: validParamsWithPrincipal.doc.version
        }
      );
    });

    it('should throw ZodError if params are invalid', () => {
      const invalidParams = {
        ...validParamsWithUint8Array,
        collection: 123
      } as unknown as DeleteDocStoreParams;

      expect(() => deleteDocStore(invalidParams)).toThrow(ZodError);
    });

    it('should throw an error if the Satellite validation fails', () => {
      vi.mocked(global.__juno_satellite_datastore_delete_doc_store).mockImplementation(() => {
        throw new Error('Satellite validation failed');
      });

      expect(() => deleteDocStore(validParamsWithUint8Array)).toThrowError(
        'Satellite validation failed'
      );
    });
  });
});
