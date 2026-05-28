import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-apple';

@Injectable()
export class AppleStrategy extends PassportStrategy(Strategy, 'apple') {
  constructor() {
    super({
      clientID: process.env.APPLE_CLIENT_ID || 'dummy_client_id',
      teamID: process.env.APPLE_TEAM_ID || 'dummy_team_id',
      keyID: process.env.APPLE_KEY_ID || 'dummy_key_id',
      privateKeyString: process.env.APPLE_PRIVATE_KEY
        ? process.env.APPLE_PRIVATE_KEY.replace(/\\n/g, '\n')
        : 'dummy_private_key',
      callbackURL: 'http://localhost:3001/api/user/apple/callback',
      scope: ['email', 'name'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    idToken: string,
    profile: any,
  ) {
    // passport-apple decodes the ID token claims and passes them as the profile.
    let email = profile?.email;
    let providerId = profile?.sub;
    let name = 'Apple User';

    if (profile?.name) {
      name = `${profile.name.firstName || ''} ${profile.name.lastName || ''}`.trim();
    }

    // In case passport-apple profile does not automatically contain the sub/email, decode idToken manually
    if ((!email || !providerId) && idToken) {
      try {
        const parts = idToken.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8'));
          email = email || payload.email;
          providerId = providerId || payload.sub;
        }
      } catch (err) {
        // Fallback or ignore decoding error
      }
    }

    return {
      email: email || '',
      name: name || 'Apple User',
      provider: 'apple',
      providerId: providerId || '',
    };
  }
}
