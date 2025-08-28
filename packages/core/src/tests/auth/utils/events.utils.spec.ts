/**
 * @vitest-environment jsdom
 */

import {emit} from '../../../auth/utils/events.utils';

describe('events.utils', () => {
  it('dispatches a CustomEvent with the correct message and detail', () => {
    const spy = vi.spyOn(document, 'dispatchEvent');

    const detail = {foo: 'bar'};
    emit({message: 'test-event', detail});

    expect(spy).toHaveBeenCalledTimes(1);

    const eventArg = spy.mock.calls[0][0] as CustomEvent<typeof detail>;
    expect(eventArg).toBeInstanceOf(CustomEvent);
    expect(eventArg.type).toBe('test-event');
    expect(eventArg.detail).toEqual(detail);
    expect(eventArg.bubbles).toBe(true);

    spy.mockRestore();
  });
});
