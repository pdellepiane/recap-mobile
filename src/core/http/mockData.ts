import { Event, User, Participant } from '@/src/domain/models';

export const mockUser: User = {
  id: 'user-1',
  name: 'Jane Doe',
  email: 'jane.doe@example.com',
};

export const mockEvents: Event[] = [
  {
    id: 'event-1',
    title: 'React Native Meetup',
    date: '2026-03-20',
    location: 'Lima, Peru',
    description: 'Community meetup to discuss clean architecture in RN apps.',
  },
  {
    id: 'event-2',
    title: 'Expo Workshop',
    date: '2026-04-02',
    location: 'Arequipa, Peru',
    description: 'Hands-on workshop for Expo routing and modular app design.',
  },
  {
    id: 'event-3',
    title: 'Product Design Night',
    date: '2026-04-15',
    location: 'Cusco, Peru',
    description: 'Cross-functional event for mobile product teams.',
  },
];

export const mockParticipants: Participant[] = [
  {
    id: 'participant-1',
    userId: 'user-1',
    eventId: 'event-1',
    status: 'going',
  },
  {
    id: 'participant-2',
    userId: 'user-1',
    eventId: 'event-2',
    status: 'interested',
  },
];
