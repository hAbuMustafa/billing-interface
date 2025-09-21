import { patients } from '$lib/server/db/seed/data/patients';

export function load({
  url,
  depends,
  fetch,
  params,
  parent,
  route,
  setHeaders,
  untrack,
  cookies,
  getClientAddress,
  isDataRequest,
  isSubRequest,
  locals,
  platform,
  request,
}) {
  return {
    patients,
  };
}
