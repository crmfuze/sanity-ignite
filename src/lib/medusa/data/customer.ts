/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { HttpTypes } from '@medusajs/types';
import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';

import { sdk } from '../config';
import medusaError from '@/lib/medusa/util/medusa-error';

import {
  getAuthHeaders,
  getCacheOptions,
  getCacheTag,
  getCartId,
  removeAuthToken,
  removeCartId,
  setAuthToken,
} from './cookies';
import { retrieveReplicatedSiteInfo } from './distributor';

export const retrieveCustomer = async (): Promise<HttpTypes.StoreCustomer | null> => {
  const authHeaders = await getAuthHeaders();

  if (!authHeaders) return null;

  const headers = {
    ...authHeaders,
  };

  const next = {
    ...(await getCacheOptions('customers')),
  };

  return await sdk.client
    .fetch<{ customer: HttpTypes.StoreCustomer }>(`/store/customers/me`, {
      method: 'GET',
      query: {
        fields: '*orders',
      },
      headers,
      next,
      cache: 'no-cache',
    })
    .then(({ customer }) => customer)
    .catch(() => null);
};

export const retrieveCustomerSalesChannel = async (
  customer_id: string,
): Promise<HttpTypes.AdminSalesChannel | null> => {
  const headers = {
    ...(await getAuthHeaders()),
  };

  const response = await sdk.client
    .fetch<{ sales_channel: HttpTypes.AdminSalesChannel }>(`/store/sales-channels/${customer_id}`, {
      method: 'GET',
      headers,
      cache: `no-cache`,
    })
    .then(({ sales_channel }) => sales_channel)
    .catch(() => null);

  return response;
};

export const getDefaultSalesChannel = async (): Promise<HttpTypes.AdminSalesChannel | null> => {
  const headers = {
    ...(await getAuthHeaders()),
  };

  const response = await sdk.client
    .fetch<{ default_sales_channel: HttpTypes.AdminSalesChannel }>(
      `/store/sales-channels/default`,
      {
        method: 'GET',
        headers,
        cache: 'no-cache',
      },
    )
    .then(({ default_sales_channel }) => default_sales_channel || null)
    .catch(() => null);

  return response;
};

export async function getOrSetSalesChannel() {
  const customer = await retrieveCustomer();

  // If customer exists, try to get their sales channel
  if (!customer) {
    return await getDefaultSalesChannel();
  }

  return await retrieveCustomerSalesChannel(customer.id);
}

export const updateCustomer = async (body: HttpTypes.StoreUpdateCustomer) => {
  const headers = {
    ...(await getAuthHeaders()),
  };

  const updateRes = await sdk.store.customer
    .update(body, {}, headers)
    .then(({ customer }) => customer)
    .catch(medusaError);

  const cacheTag = await getCacheTag('customers');
  revalidateTag(cacheTag);

  return updateRes;
};

export async function signup(_currentState: unknown, formData: FormData) {
  const password = formData.get('password') as string;
  const customerForm = {
    email: formData.get('email') as string,
    first_name: formData.get('first_name') as string,
    last_name: formData.get('last_name') as string,
    phone: formData.get('phone') as string,
    language: formData.get('language') as string,
  };

  try {
    const token = await sdk.auth.register('customer', 'mlmsoft-auth', {
      email: customerForm.email,
      password: password,
    });

    await setAuthToken(token as string);

    const headers = {
      ...(await getAuthHeaders()),
    };

    const { customer: createdCustomer } = await sdk.store.customer.create(
      {
        email: customerForm.email,
        first_name: customerForm.first_name,
        last_name: customerForm.last_name,
        phone: customerForm.phone,
        metadata: {
          language: customerForm.language,
        },
      },
      {},
      headers,
    );

    const loginToken = await sdk.auth.login('customer', 'mlmsoft-auth', {
      email: customerForm.email,
      password,
    });

    await setAuthToken(loginToken as string);

    const customerCacheTag = await getCacheTag('customers');
    revalidateTag(customerCacheTag);

    await transferCart();

    return createdCustomer;
  } catch (error: any) {
    return error.toString();
  }
}

export async function login(_currentState: unknown, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    await sdk.auth.login('customer', 'mlmsoft-auth', { email, password }).then(async (token) => {
      await setAuthToken(token as string);
      const customerCacheTag = await getCacheTag('customers');
      revalidateTag(customerCacheTag);
    });
  } catch (error: any) {
    return error.toString();
  }

  try {
    await transferCart();
  } catch (error: any) {
    return error.toString();
  }
}

export async function signout(countryCode: string) {
  await sdk.auth.logout();

  await removeAuthToken();

  const customerCacheTag = await getCacheTag('customers');
  revalidateTag(customerCacheTag);

  await removeCartId();

  const cartCacheTag = await getCacheTag('carts');
  revalidateTag(cartCacheTag);

  redirect(`/${countryCode}/account`);
}

export async function transferCart() {
  const cartId = await getCartId();

  if (!cartId) {
    return;
  }

  const headers = await getAuthHeaders();

  await sdk.store.cart.transferCart(cartId, {}, headers);

  const cartCacheTag = await getCacheTag('carts');
  revalidateTag(cartCacheTag);
}

export const addCustomerAddress = async (
  currentState: Record<string, unknown>,
  formData: FormData,
): Promise<any> => {
  const isDefaultBilling = (currentState.isDefaultBilling as boolean) || false;
  const isDefaultShipping = (currentState.isDefaultShipping as boolean) || false;

  const address = {
    first_name: formData.get('first_name') as string,
    last_name: formData.get('last_name') as string,
    company: formData.get('company') as string,
    address_1: formData.get('address_1') as string,
    address_2: formData.get('address_2') as string,
    city: formData.get('city') as string,
    postal_code: formData.get('postal_code') as string,
    province: formData.get('province') as string,
    country_code: formData.get('country_code') as string,
    phone: formData.get('phone') as string,
    is_default_billing: isDefaultBilling,
    is_default_shipping: isDefaultShipping,
  };

  const headers = {
    ...(await getAuthHeaders()),
  };

  return sdk.store.customer
    .createAddress(address, {}, headers)
    .then(async () => {
      const customerCacheTag = await getCacheTag('customers');
      revalidateTag(customerCacheTag);
      return { success: true, error: null };
    })
    .catch((err) => {
      return { success: false, error: err.toString() };
    });
};

export const deleteCustomerAddress = async (addressId: string): Promise<void> => {
  const headers = {
    ...(await getAuthHeaders()),
  };

  await sdk.store.customer
    .deleteAddress(addressId, headers)
    .then(async () => {
      const customerCacheTag = await getCacheTag('customers');
      revalidateTag(customerCacheTag);
      return { success: true, error: null };
    })
    .catch((err) => {
      return { success: false, error: err.toString() };
    });
};

export const updateCustomerAddress = async (
  currentState: Record<string, unknown>,
  formData: FormData,
): Promise<any> => {
  const addressId = (currentState.addressId as string) || (formData.get('addressId') as string);

  if (!addressId) {
    return { success: false, error: 'Address ID is required' };
  }

  const address = {
    first_name: formData.get('first_name') as string,
    last_name: formData.get('last_name') as string,
    company: formData.get('company') as string,
    address_1: formData.get('address_1') as string,
    address_2: formData.get('address_2') as string,
    city: formData.get('city') as string,
    postal_code: formData.get('postal_code') as string,
    province: formData.get('province') as string,
    country_code: formData.get('country_code') as string,
  } as HttpTypes.StoreUpdateCustomerAddress;

  const phone = formData.get('phone') as string;

  if (phone) {
    address.phone = phone;
  }

  const headers = {
    ...(await getAuthHeaders()),
  };

  return sdk.store.customer
    .updateAddress(addressId, address, {}, headers)
    .then(async () => {
      const customerCacheTag = await getCacheTag('customers');
      revalidateTag(customerCacheTag);
      return { success: true, error: null };
    })
    .catch((err) => {
      return { success: false, error: err.toString() };
    });
};
