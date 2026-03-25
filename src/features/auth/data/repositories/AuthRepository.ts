import { HttpClient } from '@/src/core/http/HttpClient';
import { User } from '@/src/domain/models';

export class AuthRepository {
  constructor(private readonly httpClient: HttpClient) {}

  async login(_email: string, _password: string): Promise<User> {
    return this.httpClient.get<User>('/me');
  }

  async signUp(_name: string, _email: string, _password: string): Promise<User> {
    return this.httpClient.get<User>('/me');
  }
}
