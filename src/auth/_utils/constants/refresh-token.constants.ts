import { CookieOptions } from 'express';

export const REFRESH_COOKIE = 'refresh-token';

export const getRefreshCookieOptions = (secure: boolean): CookieOptions => ({
  httpOnly: true,
  sameSite: 'strict',
  maxAge: 1000 * 60 * 60 * 24 * 30, //One month in ms?
  path: '/auth/*', //Not sure if it work, need more test
  secure,
});
