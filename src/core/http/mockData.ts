import { Event, Participant } from '@/src/domain/entities';

/**
 * `true`: mock returns zero events and you get the empty home (illustration + copy).
 * `false`: uses the `mockEvents` demo list with carousels.
 */
export const MOCK_HOME_EMPTY_EVENTS = false;

/** 12 entries: [0] live hero, [1..5] my events, [6..8] plans, [9..11] past */
export const mockEvents: Event[] = [
  {
    id: 'evt-live-1',
    title: 'Boda de Pepsi&Coca',
    date: '2026-03-15',
    location: 'Convención de Gala Plutón',
    description: 'Evento en vivo.',
    coverImageUrl:
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80',
  },
  /** Second “live” / in-progress event (mock). */
  {
    id: 'evt-live-2',
    title: 'Boda Camila & Andrés',
    date: '2026-03-25',
    location: 'Jardín Los Olivos',
    description: 'Celebración en curso.',
    coverImageUrl:
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&auto=format&fit=crop&q=85',
  },
  {
    id: 'evt-1',
    title: 'Boda de Pesi &Coca K...',
    date: '2026-03-15',
    location: 'Convención de Gala Plutón',
    description: 'Celebración',
    coverImageUrl:
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'evt-2',
    title: 'Cumpleaños de Luis',
    date: '2026-04-02',
    location: 'San Isidro, Lima',
    description: 'Fiesta',
    coverImageUrl:
      'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'evt-3',
    title: 'Aniversario Maya & Leo',
    date: '2026-04-20',
    location: 'Miraflores',
    description: 'Cena',
    coverImageUrl:
      'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'evt-4',
    title: 'Despedida de soltero',
    date: '2026-05-10',
    location: 'Barranco',
    description: 'Noche',
    coverImageUrl:
      'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'evt-5',
    title: 'Conferencia Producto 2026',
    date: '2026-06-01',
    location: 'Centro de convenciones',
    description: 'Workshop',
    coverImageUrl:
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'plan-1',
    title: 'Plan Premium Anual',
    date: '2026-07-01',
    location: 'Recap App',
    description: 'Suscripción',
    coverImageUrl:
      'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'plan-2',
    title: 'Plan Familiar',
    date: '2026-07-15',
    location: 'Recap App',
    description: 'Pack',
    coverImageUrl:
      'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'plan-3',
    title: 'Plan Evento único',
    date: '2026-08-01',
    location: 'Recap App',
    description: 'Pago único',
    coverImageUrl:
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'past-1',
    title: 'Boda Ana & Carlos',
    date: '2025-11-12',
    location: 'Cieneguilla',
    description: 'Finalizado',
    coverImageUrl:
      'https://images.unsplash.com/photo-1606800052052-a74afdd8139e?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'past-2',
    title: 'Fiesta fin de año',
    date: '2025-12-31',
    location: 'Surco',
    description: 'Finalizado',
    coverImageUrl:
      'https://images.unsplash.com/photo-1467810563316-b547652558c1?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'past-3',
    title: 'Baby shower Sofía',
    date: '2025-10-05',
    location: 'La Molina',
    description: 'Finalizado',
    coverImageUrl:
      'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=800&auto=format&fit=crop&q=80',
  },
];

export const mockParticipants: Participant[] = [
  {
    id: 'participant-1',
    userId: 'user-1',
    eventId: 'evt-1',
    status: 'going',
  },
  {
    id: 'participant-2',
    userId: 'user-1',
    eventId: 'evt-2',
    status: 'interested',
  },
];
