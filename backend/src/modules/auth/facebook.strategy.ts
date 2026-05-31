import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-facebook';

export interface FacebookProfilePayload {
  facebookId: string;
  email: string | null;
  displayName: string;
  avatarUrl: string | null;
}

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(config: ConfigService) {
    super({
      clientID: config.get<string>('FACEBOOK_APP_ID', ''),
      clientSecret: config.get<string>('FACEBOOK_APP_SECRET', ''),
      callbackURL: config.get<string>(
        'FACEBOOK_CALLBACK_URL',
        'http://localhost:3001/api/v1/auth/facebook/callback',
      ),
      scope: ['email'],
      profileFields: ['id', 'displayName', 'emails', 'photos'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
  ): Promise<FacebookProfilePayload> {
    const email =
      Array.isArray(profile.emails) && profile.emails.length > 0
        ? profile.emails[0].value
        : null;
    const avatarUrl =
      Array.isArray(profile.photos) && profile.photos.length > 0
        ? profile.photos[0].value
        : null;

    return {
      facebookId: profile.id,
      email,
      displayName: profile.displayName || `Người dùng Facebook ${profile.id}`,
      avatarUrl,
    };
  }
}
