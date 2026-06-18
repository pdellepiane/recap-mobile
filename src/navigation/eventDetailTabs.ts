export enum EventDetailTab {
  Overview = 'overview',
  Challenges = 'challenges',
  Ranking = 'ranking',
  Album = 'album',
}

export const FULL_DETAIL_TABS: readonly EventDetailTab[] = [
  EventDetailTab.Overview,
  EventDetailTab.Challenges,
  EventDetailTab.Ranking,
  EventDetailTab.Album,
];

/**
 * Antes del día del evento (invitado): Detalle + Álbum — sin ranking ni desafíos.
 * Producto: invitado ve ranking y desafíos desde el día del evento (24h) en adelante.
 */
export const GUEST_PRE_EVENT_DAY_TABS: readonly EventDetailTab[] = [
  EventDetailTab.Overview,
  EventDetailTab.Album,
];

/**
 * Antes del día del evento (anfitrión): Detalle + Desafíos + Álbum — desafíos visibles siempre;
 * ranking solo desde el día del evento.
 */
export const HOST_PRE_EVENT_DAY_TABS: readonly EventDetailTab[] = FULL_DETAIL_TABS;
