import { HttpClient } from './HttpClient';
import { mockEvents, mockParticipants, mockUser } from './mockData';

export class MockHttpClient implements HttpClient {
  async get<T>(url: string): Promise<T> {
    await new Promise((resolve) => setTimeout(resolve, 200));

    if (url === '/events') {
      return mockEvents as T;
    }

    if (url.startsWith('/events/')) {
      const eventId = url.split('/')[2];
      const event = mockEvents.find((item) => item.id === eventId);

      if (!event) {
        throw new Error('Event not found');
      }

      return event as T;
    }

    if (url === '/me') {
      return mockUser as T;
    }

    if (url === '/participants') {
      return mockParticipants as T;
    }

    throw new Error(`Unhandled endpoint: ${url}`);
  }
}
