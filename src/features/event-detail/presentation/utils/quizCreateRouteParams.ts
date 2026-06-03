export function firstRouteParam(v: string | string[] | undefined): string | undefined {
  if (v === undefined) {
    return undefined;
  }
  return Array.isArray(v) ? v[0] : v;
}

/** Remote challenge id from `challengeId` query or `edit-{id}` draft question id. */
export function resolveEditRemoteChallengeId(opts: {
  challengeId?: string;
  questionId?: string;
}): string | undefined {
  const fromQuery = opts.challengeId?.trim();
  if (fromQuery) {
    return fromQuery;
  }
  const qid = opts.questionId?.trim();
  if (!qid?.startsWith('edit-')) {
    return undefined;
  }
  const remote = qid.slice('edit-'.length).trim();
  return remote.length > 0 ? remote : undefined;
}
