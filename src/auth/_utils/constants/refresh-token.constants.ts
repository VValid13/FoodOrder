import { CookieOptions } from 'express';

export const REFRESH_COOKIE = 'refresh-token';

export const getRefreshCookieOptions = (secure: boolean): CookieOptions => ({
  httpOnly: true,
  sameSite: 'strict',
  secure,
});
