import { HttpClient } from '@/src/core/http/HttpClient';
import { User } from '@/src/domain/models';

export class ProfileRepository {
  constructor(private readonly httpClient: HttpClient) {}

  async getProfile(): Promise<User> {
    return this.httpClient.get<User>('/me');
  }
}
