import type { HomeEventGuestItem, LoginCodeLanguagePayload } from '@/src/core/api/types';

const MOCK_TS = '2026-01-15T12:00:00.000000Z';

const LANG_ES_PE: LoginCodeLanguagePayload = {
  id: 1,
  code: 'es',
  region: 'PE',
  locale: 'es_PE',
  name: 'Español',
};

function mkGuest(
  base: Pick<HomeEventGuestItem, 'id' | 'name' | 'email'> &
    Partial<
      Pick<
        HomeEventGuestItem,
        'full_phone' | 'has_responded' | 'will_attend' | 'has_couple' | 'response_date'
      >
    >,
): HomeEventGuestItem {
  return {
    full_phone: '+51 999 000 000',
    has_responded: 1,
    will_attend: 1,
    has_couple: 0,
    response_date: '2026-01-08T10:00:00Z',
    language_id: 1,
    language: LANG_ES_PE,
    created_at: MOCK_TS,
    updated_at: MOCK_TS,
    ...base,
  };
}

/** Varied RSVP flags so mapped `guestsRespondedCount` / `guestsAttendingCount` look realistic. */
function mockGuestsBulk(
  startId: number,
  count: number,
  emailPrefix: string,
): HomeEventGuestItem[] {
  return Array.from({ length: count }, (_, i) => {
    const n = i + 1;
    const hasResponded = i % 5 !== 0 ? 1 : 0;
    const willAttend = hasResponded !== 0 && i % 6 !== 0 ? 1 : 0;
    return mkGuest({
      id: startId + i,
      name: `Invitado ${String(n)}`,
      email: `${emailPrefix}-${String(n)}@demo.recap.test`,
      full_phone: `+51 987 ${String(100000 + i).slice(-6)}`,
      has_responded: hasResponded,
      will_attend: willAttend,
      has_couple: i % 11 === 0 ? 1 : 0,
    });
  });
}

/** 12 invitados — boda mock. */
export const GUESTS_WEDDING_11001: HomeEventGuestItem[] = [
  mkGuest({
    id: 50001,
    name: 'Paola Quispe',
    email: 'paola.quispe@gmail.com',
    full_phone: '+51 987 654 321',
    has_responded: 1,
    will_attend: 1,
    has_couple: 1,
  }),
  mkGuest({
    id: 50002,
    name: 'Ricardo Salas',
    email: 'ricardo.salas@outlook.com',
    has_responded: 1,
    will_attend: 1,
  }),
  mkGuest({
    id: 50003,
    name: 'Lucía Fernández',
    email: 'lucia.f@yahoo.com',
    has_responded: 1,
    will_attend: 0,
  }),
  mkGuest({
    id: 50004,
    name: 'Diego Montes',
    email: 'dmontes@empresa.pe',
    full_phone: '+51 956 111 222',
    has_responded: 0,
    will_attend: 0,
  }),
  mkGuest({
    id: 50005,
    name: 'Andrea Chuquimarca',
    email: 'andrea.ch@gmail.com',
    has_responded: 1,
    will_attend: 1,
    has_couple: 1,
  }),
  mkGuest({
    id: 50006,
    name: 'Marcos Vela',
    email: 'mvela@icloud.com',
    has_responded: 1,
    will_attend: 1,
  }),
  mkGuest({
    id: 50007,
    name: 'Valeria Ortiz',
    email: 'vortiz@hotmail.com',
    has_responded: 0,
    will_attend: 0,
  }),
  mkGuest({
    id: 50008,
    name: 'José María Campos',
    email: 'jmcampos@gmail.com',
    has_responded: 1,
    will_attend: 1,
  }),
  mkGuest({
    id: 50009,
    name: 'Carmen de la Cruz',
    email: 'carmen.dlc@outlook.com',
    has_responded: 1,
    will_attend: 1,
  }),
  mkGuest({
    id: 50010,
    name: 'Felipe Rojas',
    email: 'frojas@recap.test',
    has_responded: 1,
    will_attend: 1,
  }),
  mkGuest({
    id: 50011,
    name: 'Gabriela Núñez',
    email: 'gnunez@gmail.com',
    has_responded: 0,
    will_attend: 0,
  }),
  mkGuest({
    id: 50012,
    name: 'Santiago Paredes',
    email: 'sparedes@yahoo.com',
    has_responded: 1,
    will_attend: 1,
  }),
];

/** 2 invitados. */
export const GUESTS_ANNIVERSARY_11002: HomeEventGuestItem[] = [
  mkGuest({
    id: 51001,
    name: 'Elena Prado',
    email: 'elena.prado@gmail.com',
    has_responded: 1,
    will_attend: 1,
  }),
  mkGuest({
    id: 51002,
    name: 'Tomás Ibáñez',
    email: 'tibanez@outlook.com',
    has_responded: 0,
    will_attend: 0,
  }),
];

/** 18 invitados. */
export const GUESTS_BABY_SHOWER_12001 = mockGuestsBulk(52000, 18, 'babyshower');

/** 47 invitados — lista larga tipo promoción. */
export const GUESTS_GRAD_12002 = mockGuestsBulk(53000, 47, 'grad2021');

/** Host mock 11003–11008: distintos tamaños. */
export const GUESTS_DESPEDIDA_11003 = mockGuestsBulk(54000, 9, 'despedida');
export const GUESTS_CENA_11004 = mockGuestsBulk(54100, 6, 'cena');
export const GUESTS_WORKSHOP_11005 = mockGuestsBulk(54200, 15, 'workshop');
export const GUESTS_CUMPLE_11006 = mockGuestsBulk(54300, 24, 'cumple');
export const GUESTS_BAUTIZO_11007 = mockGuestsBulk(54400, 11, 'bautizo');
export const GUESTS_RETIRO_11008 = mockGuestsBulk(54500, 32, 'retiro');

/** 8 invitados — evento “hoy” en {@link MOCK_HOME_HOST_EVENTS}. */
export const GUESTS_TODAY_11009 = mockGuestsBulk(54600, 8, 'brunch-hoy');
