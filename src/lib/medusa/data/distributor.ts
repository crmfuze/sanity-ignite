'use server';

import { sdk } from '../config';
import { AdminMlmsoftResponse, StoreMlmsoftSearchByInviteCodeResponse } from '@/types/mlmsoft';
import { getAuthHeaders, getTrackingId } from './cookies';

export const retrieveReplicatedSiteInfo =
  async (): Promise<StoreMlmsoftSearchByInviteCodeResponse | null> => {
    const authHeaders = await getAuthHeaders();
    const inviteCode = await getTrackingId();

    if (!inviteCode) return null;

    if (!authHeaders) return null;

    const headers = {
      ...authHeaders,
    };

    const query = {
      ...inviteCode,
    };

    return await sdk.client
      .fetch<AdminMlmsoftResponse & { payload: StoreMlmsoftSearchByInviteCodeResponse | null }>(
        `/store/mlmsoft/accounts/search/by-invite-code`,
        {
          method: 'GET',
          query: {
            inviteCode: query.tracking_id,
          },
          headers,
          cache: `no-cache`,
        },
      )
      .then(({ payload }) => payload)
      .catch(() => null);
  };

