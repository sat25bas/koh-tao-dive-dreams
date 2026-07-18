import { randomUUID } from 'crypto';
import {
  getDbProvider,
  isSupabaseProvider,
  isMySqlProvider,
  isWordPressProvider,
  listSupabaseBookings,
  insertSupabaseBooking,
} from './_lib/supabase-bookings.js';
import { listMySqlBookings, insertMySqlBooking } from './_lib/mysql-bookings.js';
import { listWordPressBookings, insertWordPressBooking } from './_lib/wordpress-bookings.js';

function parseJsonBody(req) {
  if (req.body == null) return {};
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  return req.body;
}

async function listBookings() {
  if (isSupabaseProvider()) {
    return listSupabaseBookings();
  }
  if (isMySqlProvider()) {
    return listMySqlBookings();
  }
  if (isWordPressProvider()) {
    return listWordPressBookings();
  }
  throw new Error(`Unsupported booking DB provider: ${getDbProvider()}`);
}

async function createBooking(payload) {
  const bookingPayload = {
    ...payload,
    id: String(payload?.id || randomUUID()),
  };

  if (isSupabaseProvider()) {
    return insertSupabaseBooking(bookingPayload);
  }
  if (isMySqlProvider()) {
    return insertMySqlBooking(bookingPayload);
  }
  if (isWordPressProvider()) {
    return insertWordPressBooking(bookingPayload);
  }
  throw new Error(`Unsupported booking DB provider: ${getDbProvider()}`);
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      const bookings = await listBookings();
      return res.status(200).json(bookings);
    }

    if (req.method === 'POST') {
      const body = parseJsonBody(req);
      const booking = await createBooking(body);
      return res.status(201).json(booking);
    }

    res.setHeader('Allow', ['GET', 'POST', 'OPTIONS']);
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Booking API error:', error?.message || error);
    return res.status(500).json({ error: error instanceof Error ? error.message : 'Internal server error' });
  }
}
