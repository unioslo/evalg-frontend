export const authEnabled = false;
export const cryptoVariant = 'nacl';
export const appTimezone = "Europe/Oslo";

/* Enable or dissable a simple test warning message */
export const testWarning = false;

export const oidcConfig = {
  authority: 'https://auth.dataporten.no/',
  client_id: '48f63358-9eee-429f-bd79-381fb12fbf6b',
  redirect_uri: 'http://localhost:3000/callback',
  response_type: 'id_token token',
  scope: 'openid',
};
export const oidcLogoutUrl = 'https://auth.dataporten.no/logout';

export const graphqlBackend = 'http://localhost:5000/graphql';
export const restBackend = 'http://localhost:5000/';
