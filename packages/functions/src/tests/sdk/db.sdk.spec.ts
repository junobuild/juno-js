import {Principal} from '@dfinity/principal';
import {ZodError} from 'zod/v4';
import {
  countCollectionDocsStore,
  countDocsStore,
  deleteDocsStore,
  deleteDocStore,
  deleteFilteredDocsStore,
  getDocStore,
  listDocsStore,
  setDocStore
} from '../../sdk/db.sdk';
import {
  CountCollectionDocsStoreParams,
  CountDocsStoreParams,
  DeleteDocsStoreParams,
  DeleteDocStoreParams,
  DeleteFilteredDocsStoreParams,
  GetDocStoreParams,
  ListDocsStoreParams,
  SetDocStoreParams
} from '../../sdk/schemas/db';

const mockSetDocResult = {
  key: 'mock-key',
  collection: 'mock-collection',
  data: {
    before: undefined,
    after: {
      data: new Uint8Array([1, 2, 3]),
      description: 'mock-doc',
      version: BigInt(1)
    }
  }
};

vi.stubGlobal(
  '__juno_satellite_datastore_set_doc_store',
  vi.fn(() => mockSetDocResult)
);

const mockDeleteDocResult = {
  key: 'mock-key',
  collection: 'mock-collection',
  data: {
    data: {
      data: new Uint8Array([1, 2, 3]),
      description: 'mock-deleted-doc',
      version: BigInt(1)
    }
  }
};

vi.stubGlobal(
  '__juno_satellite_datastore_delete_doc_store',
  vi.fn(() => mockDeleteDocResult)
);

vi.stubGlobal('__juno_satellite_datastore_get_doc_store', vi.fn());

const mockListResult = {
  items: [
    [
      'doc1',
      {
        owner: new Uint8Array([1, 2, 3]),
        data: new Uint8Array([10, 20, 30]),
        created_at: 1700000000000000n,
        updated_at: 1700000000000001n,
        description: 'Test doc',
        version: 1n
      }
    ]
  ],
  items_length: 1n,
  items_page: 1n,
  matches_length: 1n,
  matches_pages: 1n
};

vi.stubGlobal(
  '__juno_satellite_datastore_list_docs_store',
  vi.fn(() => mockListResult)
);

const mockCount = 42n;

vi.stubGlobal(
  '__juno_satellite_datastore_count_collection_docs_store',
  vi.fn(() => mockCount)
);
vi.stubGlobal(
  '__juno_satellite_datastore_count_docs_store',
  vi.fn(() => mockCount)
);

vi.stubGlobal('__juno_satellite_datastore_delete_docs_store', vi.fn());

const mockDeleteFilteredDocsResult = [
  {
    key: 'mock-key',
    collection: 'mock-collection',
    data: {
      data: {
        data: new Uint8Array([1, 2, 3]),
        description: 'mock-deleted-doc',
        version: BigInt(1)
      }
    }
  }
];

vi.stubGlobal(
  '__juno_satellite_datastore_delete_filtered_docs_store',
  vi.fn(() => mockDeleteFilteredDocsResult)
);

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

    it('should return the DocContext from the Satellite', () => {
      const result = setDocStore(validParamsWithUint8Array);
      expect(result).toEqual(mockSetDocResult);
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

    it('should return the DocContext from the Satellite', () => {
      const result = deleteDocStore(validParamsWithUint8Array);
      expect(result).toEqual(mockDeleteDocResult);
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

  describe('getDocStore', () => {
    const baseParamsWithUint8Array: GetDocStoreParams = {
      caller: Principal.anonymous().toUint8Array(),
      collection,
      key
    };

    const baseParamsWithPrincipal: GetDocStoreParams = {
      caller: Principal.anonymous(),
      collection,
      key
    };

    const doc = {
      data: new Uint8Array([1, 2, 3]),
      description: 'A sample doc',
      version: BigInt(1)
    };

    it('should call __juno_satellite_datastore_get_doc_store with correct parameters when caller is Uint8Array', () => {
      vi.mocked(global.__juno_satellite_datastore_get_doc_store).mockReturnValue(doc);

      const result = getDocStore(baseParamsWithUint8Array);

      expect(global.__juno_satellite_datastore_get_doc_store).toHaveBeenCalledWith(
        baseParamsWithUint8Array.caller,
        baseParamsWithUint8Array.collection,
        baseParamsWithUint8Array.key
      );

      expect(result).toEqual(doc);
    });

    it('should call __juno_satellite_datastore_get_doc_store with caller converted to Uint8Array when caller is Principal', () => {
      vi.mocked(global.__juno_satellite_datastore_get_doc_store).mockReturnValue(doc);

      const result = getDocStore(baseParamsWithPrincipal);

      expect(global.__juno_satellite_datastore_get_doc_store).toHaveBeenCalledWith(
        (baseParamsWithPrincipal.caller as Principal).toUint8Array(),
        baseParamsWithPrincipal.collection,
        baseParamsWithPrincipal.key
      );

      expect(result).toEqual(doc);
    });

    it('should return undefined if no document is found', () => {
      vi.mocked(global.__juno_satellite_datastore_get_doc_store).mockReturnValue(undefined);

      const result = getDocStore(baseParamsWithPrincipal);

      expect(result).toBeUndefined();
    });

    it('should throw ZodError if params are invalid', () => {
      const invalidParams = {
        ...baseParamsWithUint8Array,
        collection: 123
      } as unknown as GetDocStoreParams;

      expect(() => getDocStore(invalidParams)).toThrow(ZodError);
    });

    it('should throw an error if the Satellite retrieval fails', () => {
      vi.mocked(global.__juno_satellite_datastore_get_doc_store).mockImplementation(() => {
        throw new Error('Datastore failure');
      });

      expect(() => getDocStore(baseParamsWithUint8Array)).toThrowError('Datastore failure');
    });
  });

  describe('listDocsStore', () => {
    const collection = 'notes';

    const baseParamsWithUint8Array: ListDocsStoreParams = {
      caller: Principal.anonymous().toUint8Array(),
      collection,
      params: {}
    };

    const baseParamsWithPrincipal: ListDocsStoreParams = {
      caller: Principal.anonymous(),
      collection,
      params: {}
    };

    it('should call __juno_satellite_datastore_list_docs_store with correct parameters (Uint8Array)', () => {
      const result = listDocsStore(baseParamsWithUint8Array);

      expect(global.__juno_satellite_datastore_list_docs_store).toHaveBeenCalledWith(
        baseParamsWithUint8Array.caller,
        collection,
        {}
      );
      expect(result).toEqual(mockListResult);
    });

    it('should call __juno_satellite_datastore_list_docs_store with caller converted to Uint8Array (Principal)', () => {
      const result = listDocsStore(baseParamsWithPrincipal);

      expect(global.__juno_satellite_datastore_list_docs_store).toHaveBeenCalledWith(
        (baseParamsWithPrincipal.caller as Principal).toUint8Array(),
        collection,
        {}
      );
      expect(result).toEqual(mockListResult);
    });

    it('should throw ZodError if input is invalid', () => {
      const invalidParams = {
        caller: 1234,
        collection,
        params: {}
      } as unknown as ListDocsStoreParams;

      expect(() => listDocsStore(invalidParams)).toThrow(ZodError);
    });

    it('should throw if Satellite throws an error', () => {
      vi.mocked(global.__juno_satellite_datastore_list_docs_store).mockImplementation(() => {
        throw new Error('Unexpected Satellite error');
      });

      expect(() => listDocsStore(baseParamsWithUint8Array)).toThrow('Unexpected Satellite error');
    });
  });

  describe('countCollectionDocsStore', () => {
    const validParams: CountCollectionDocsStoreParams = {
      collection
    };

    it('should call __juno_satellite_datastore_count_collection_docs_store with correct params', () => {
      const result = countCollectionDocsStore(validParams);

      expect(global.__juno_satellite_datastore_count_collection_docs_store).toHaveBeenCalledWith(
        validParams.collection
      );
      expect(result).toBe(mockCount);
    });

    it('should throw ZodError if params are invalid', () => {
      const invalid = {
        collection: 123
      } as unknown as CountCollectionDocsStoreParams;

      expect(() => countCollectionDocsStore(invalid)).toThrow(ZodError);
    });

    it('should throw if Satellite throws', () => {
      vi.mocked(global.__juno_satellite_datastore_count_collection_docs_store).mockImplementation(
        () => {
          throw new Error('Satellite count failure');
        }
      );

      expect(() => countCollectionDocsStore(validParams)).toThrow('Satellite count failure');
    });
  });

  describe('countDocsStore', () => {
    const baseParamsWithUint8Array: CountDocsStoreParams = {
      caller: Principal.anonymous().toUint8Array(),
      collection,
      params: {}
    };

    const baseParamsWithPrincipal: CountDocsStoreParams = {
      caller: Principal.anonymous(),
      collection,
      params: {}
    };

    it('should call __juno_satellite_datastore_count_docs_store with correct params (Uint8Array)', () => {
      const result = countDocsStore(baseParamsWithUint8Array);

      expect(global.__juno_satellite_datastore_count_docs_store).toHaveBeenCalledWith(
        baseParamsWithUint8Array.caller,
        collection,
        {}
      );
      expect(result).toBe(mockCount);
    });

    it('should call __juno_satellite_datastore_count_docs_store with caller converted to Uint8Array (Principal)', () => {
      const result = countDocsStore(baseParamsWithPrincipal);

      expect(global.__juno_satellite_datastore_count_docs_store).toHaveBeenCalledWith(
        (baseParamsWithPrincipal.caller as Principal).toUint8Array(),
        collection,
        {}
      );
      expect(result).toBe(mockCount);
    });

    it('should throw ZodError if input is invalid', () => {
      const invalidParams = {
        caller: 42,
        collection,
        params: {}
      } as unknown as CountDocsStoreParams;

      expect(() => countDocsStore(invalidParams)).toThrow(ZodError);
    });

    it('should throw if Satellite throws', () => {
      vi.mocked(global.__juno_satellite_datastore_count_docs_store).mockImplementation(() => {
        throw new Error('Satellite filtered count error');
      });

      expect(() => countDocsStore(baseParamsWithUint8Array)).toThrow(
        'Satellite filtered count error'
      );
    });
  });

  describe('deleteDocsStore', () => {
    const validParams: DeleteDocsStoreParams = {
      collection
    };

    it('should call __juno_satellite_datastore_delete_docs_store with correct parameters', () => {
      deleteDocsStore(validParams);

      expect(global.__juno_satellite_datastore_delete_docs_store).toHaveBeenCalledWith(
        validParams.collection
      );
    });

    it('should throw ZodError if params are invalid', () => {
      const invalidParams = {
        collection: 123
      } as unknown as DeleteDocsStoreParams;

      expect(() => deleteDocsStore(invalidParams)).toThrow(ZodError);
    });

    it('should throw an error if the Satellite operation fails', () => {
      vi.mocked(global.__juno_satellite_datastore_delete_docs_store).mockImplementation(() => {
        throw new Error('Satellite bulk delete error');
      });

      expect(() => deleteDocsStore(validParams)).toThrow('Satellite bulk delete error');
    });
  });

  describe('deleteFilteredDocsStore', () => {
    const baseParamsWithUint8Array: DeleteFilteredDocsStoreParams = {
      caller: Principal.anonymous().toUint8Array(),
      collection,
      params: {}
    };

    const baseParamsWithPrincipal: DeleteFilteredDocsStoreParams = {
      caller: Principal.anonymous(),
      collection,
      params: {}
    };

    it('should call __juno_satellite_datastore_delete_filtered_docs_store with correct parameters (Uint8Array)', () => {
      const result = deleteFilteredDocsStore(baseParamsWithUint8Array);

      expect(global.__juno_satellite_datastore_delete_filtered_docs_store).toHaveBeenCalledWith(
        baseParamsWithUint8Array.caller,
        baseParamsWithUint8Array.collection,
        baseParamsWithUint8Array.params
      );

      expect(result).toEqual(mockDeleteFilteredDocsResult);
    });

    it('should call __juno_satellite_datastore_delete_filtered_docs_store with caller converted to Uint8Array (Principal)', () => {
      const result = deleteFilteredDocsStore(baseParamsWithPrincipal);

      expect(global.__juno_satellite_datastore_delete_filtered_docs_store).toHaveBeenCalledWith(
        (baseParamsWithPrincipal.caller as Principal).toUint8Array(),
        baseParamsWithPrincipal.collection,
        baseParamsWithPrincipal.params
      );

      expect(result).toEqual(mockDeleteFilteredDocsResult);
    });

    it('should throw ZodError if input is invalid', () => {
      const invalidParams = {
        caller: 1234,
        collection,
        params: {}
      } as unknown as DeleteFilteredDocsStoreParams;

      expect(() => deleteFilteredDocsStore(invalidParams)).toThrow(ZodError);
    });

    it('should throw if Satellite throws an error', () => {
      vi.mocked(global.__juno_satellite_datastore_delete_filtered_docs_store).mockImplementation(
        () => {
          throw new Error('Satellite filtered delete error');
        }
      );

      expect(() => deleteFilteredDocsStore(baseParamsWithUint8Array)).toThrow(
        'Satellite filtered delete error'
      );
    });
  });
});
