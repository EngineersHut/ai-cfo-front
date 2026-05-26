import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-facebook';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor() {
    super({
      clientID: process.env.FACEBOOK_APP_ID || 'dummy_id',
      clientSecret: process.env.FACEBOOK_APP_SECRET || 'dummy_secret',
      callbackURL: 'http://localhost:3001/api/user/facebook/callback',
      scope: ['email'],
      profileFields: ['emails', 'name'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ) {
    const { name, emails, id } = profile;
    const email = emails?.[0]?.value || `${id}@facebook.com`;
    const displayName = name 
      ? `${name.givenName || ''} ${name.familyName || ''}`.trim() 
      : profile.displayName || 'Facebook User';

    return {
      email,
      name: displayName,
      provider: 'facebook',
      providerId: id,
    };
  }
}
