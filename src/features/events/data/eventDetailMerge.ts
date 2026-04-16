import type { Event as DomainEvent } from '@/src/domain/entities';

/** Merges remote detail into local/home snapshot; remote fields win when defined. */
export function mergeEventPreferRemote(local: DomainEvent, remote: DomainEvent): DomainEvent {
  const patch: Record<string, unknown> = {};
  for (const key of Object.keys(remote) as (keyof DomainEvent)[]) {
    const v = remote[key];
    if (v !== undefined) {
      patch[key as string] = v;
    }
  }
  return { ...local, ...patch } as DomainEvent;
}
