import type { HttpClient, HttpPostOptions } from './HttpClient';
import { MOCK_HOME_EMPTY_EVENTS, mockEvents, mockParticipants } from './mockData';

export class MockHttpClient implements HttpClient {
  async get<T>(url: string): Promise<T> {
    await new Promise((resolve) => setTimeout(resolve, 200));

    if (url === '/events') {
      return (MOCK_HOME_EMPTY_EVENTS ? [] : mockEvents) as T;
    }

    if (url.startsWith('/events/')) {
      const eventId = url.split('/')[2];
      const list = MOCK_HOME_EMPTY_EVENTS ? [] : mockEvents;
      const event = list.find((item) => item.id === eventId);

      if (!event) {
        throw new Error('Event not found');
      }

      return event as T;
    }

    if (url === '/participants') {
      return mockParticipants as T;
    }

    throw new Error(`Unhandled GET ${url}`);
  }

  async post<T>(_url: string, _body: object, _options?: HttpPostOptions): Promise<T> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    throw new Error('MockHttpClient does not handle POST; auth uses FetchHttpClient.');
  }
}
