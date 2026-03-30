import { HttpClient } from '@/src/core/http/HttpClient';
import { Event } from '@/src/domain/entities';

export class EventRepository {
  constructor(private readonly httpClient: HttpClient) {}

  async getEvents(): Promise<Event[]> {
    return this.httpClient.get<Event[]>('/events');
  }

  async getEventById(eventId: string): Promise<Event> {
    return this.httpClient.get<Event>(`/events/${eventId}`);
  }
}
