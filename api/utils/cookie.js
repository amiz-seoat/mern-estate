const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: SEVEN_DAYS_MS,
};

export function setTokenCookie(res, token) {
  res.cookie("access_token", token, COOKIE_OPTIONS);
}

export function clearTokenCookie(res) {
  res.clearCookie("access_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });
}
