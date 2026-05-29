

export function oauthRedirect(
  res: any,
  result: any,
) {
  const frontendUrl =
    process.env.FRONTEND_URL ||
    'http://localhost:3035';

  if (result.success && result.data?.token) {
    return res.redirect(
      `${frontendUrl}/auth/callback?token=${result.data.token}&id=${result.data.id}&name=${encodeURIComponent(result.data.name)}&email=${result.data.email}`,
    );
  }

  return res.redirect(
    `${frontendUrl}/login?error=${encodeURIComponent(result.message)}`,
  );
}