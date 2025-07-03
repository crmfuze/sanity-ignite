'use server';

import { sdk } from '../config';
import { AdminMlmsoftResponse, StoreMlmsoftSearchByInviteCodeResponse } from '@/types/mlmsoft';
import { getAuthHeaders, getCacheTag, getTrackingId, setAuthToken } from './cookies';
import { revalidateTag } from 'next/cache';
import { transferCart } from './customer';

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

// Check if email exists in ERP
export async function checkEmailExists(email: string) {
  try {
    const response = await fetch('https://ambrosia.mlmsoft.cloud/api3/account/check-exists', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      return { success: false, error: 'Failed to check email existence' };
    }

    const data = await response.json();
    return { success: true, exists: data.payload?.exists || false };
  } catch (error: any) {
    return { success: false, error: error.toString() };
  }
}

// Check if invite code is unique (available)
export async function checkInviteCodeAvailable(inviteCode: string) {
  try {
    const response = await fetch(
      `https://ambrosia.mlmsoft.cloud/api3/account/search/by-invite-code?inviteCode=${encodeURIComponent(inviteCode)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    const data = await response.json();

    // If success is true, invite code is taken (not available)
    if (data.success) {
      return { success: true, available: false };
    }

    // If success is false, invite code is not taken (available)
    if (!data.success) {
      return { success: true, available: true };
    }

    // Other errors
    return { success: false, error: data.error?.description || 'Failed to check invite code' };
  } catch (error: any) {
    return { success: false, error: error.toString() };
  }
}

// OTP request to ERP
export async function requestOTP(email: string, language: string) {
  try {
    const response = await fetch('https://ambrosia.mlmsoft.cloud/api3/otp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        language,
        codeLength: 4,
      }),
    });

    const data = await response.json();

    return data;
  } catch (error: any) {
    return { success: false, error: error.toString() };
  }
}

// OTP verification function
export async function verifyOTP(requestId: string, otpCode: string) {
  try {
    const response = await fetch('https://ambrosia.mlmsoft.cloud/api3/otp/check', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        otp_type: 'email_confirm',
        requestId,
        code: otpCode,
      }),
    });

    const data = await response.json();
    return data;
  } catch (error: any) {
    return { success: false, error: 'OTP Verify: ' + error.toString() };
  }
}

// Distributor signup with OTP verification
export async function distributorSignup(_currentState: unknown, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const otpCode = formData.get('otp_code') as string;
  const requestId = formData.get('request_id') as string;
  const language = formData.get('language') as string;
  const inviteCode = formData.get('invite_code') as string;

  const replicated_site_info = await retrieveReplicatedSiteInfo();

  const sponsor_id = replicated_site_info ? replicated_site_info.id : 174;

  try {
    // Step 1: Verify OTP before proceeding with signup
    const otpVerification = await verifyOTP(requestId, otpCode);

    if (!otpVerification.success || !otpVerification.payload?.verified) {
      const errorMessage =
        otpVerification.error?.description ||
        otpVerification.error?.data?.message ||
        'OTP verification failed';
      return typeof errorMessage === 'string' ? errorMessage : 'OTP verification failed';
    }

    // Step 2: Register with ERP using OTP verification
    const erpResponse = await fetch('https://ambrosia.mlmsoft.cloud/api3/account/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-otp-check': `email_confirm:${requestId}:${otpCode}`,
      },
      body: JSON.stringify({
        login: email,
        sponsorId: sponsor_id,
        password,
        profile: {
          email,
          firstname: formData.get('first_name') as string,
          lastname: formData.get('last_name') as string,
          phone: formData.get('phone') as string,
          language_id: language,
          invite_code: inviteCode,
        },
      }),
    });

    const erpResult: AdminMlmsoftResponse = await erpResponse.json();

    if (!erpResult.success) {
      const errorMessage =
        erpResult.error?.description ||
        erpResult.error?.data?.message ||
        erpResult.error ||
        'Registration failed';
      return typeof errorMessage === 'string' ? errorMessage : 'Registration failed';
    }

    const distributor = erpResult.payload?.info.account;

    // Step 3: Login with Medusa SDK after successful ERP registration
    const loginToken = await sdk.auth.login('customer', 'mlmsoft-auth', {
      email,
      password,
    });

    await setAuthToken(loginToken as string);

    const headers = {
      ...(await getAuthHeaders()),
    };

    const { customer: createdDistributor, activation } = await sdk.client.fetch<{
      customer: any;
      activation: AdminMlmsoftResponse;
    }>('/store/distributors', {
      method: 'POST',
      body: {
        email: formData.get('email') as string,
        first_name: formData.get('first_name') as string,
        last_name: formData.get('last_name') as string,
        phone: formData.get('phone') as string,
        metadata: {
          mlmsoft_account_id: distributor.id,
        },
      },
      headers: headers,
    });

    console.log(createdDistributor, activation);

    const customerCacheTag = await getCacheTag('customers');
    revalidateTag(customerCacheTag);

    await transferCart();

    return null; // Success case - no error message
  } catch (error: any) {
    return typeof error === 'string' ? error : error.toString();
  }
}
