'use server';

import type { HttpTypes } from '@medusajs/types';
import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';

import { sdk } from '../config';
import medusaError from '../util/medusa-error';

import {
  getAuthHeaders,
  getCacheOptions,
  getCacheTag,
  getSalesChannelId,
  setSalesChannelId,
} from './cookies';

export async function getOrSetSalesChannel(salesChannelId: string) {}
