/* General settings */
export const cryptoVariant: string = 'nacl';
export const appTimezone: string = 'Europe/Oslo';

/* Backends */
export const graphqlBackend: string = process.env.REACT_APP_BACKEND_GRAPHQL as string;
export const restBackend: string = process.env.REACT_APP_BACKEND_REST as string;

/* Authentication */
export const authEnabled: boolean = (process.env.REACT_APP_AUTH_ENABLED === 'true');
export const feideGatekeeperScope: string = process.env.REACT_APP_FEIDE_GK_API_SCOPE as string;
export const oidcConfig: Oidc.OidcClientSettings = {
  authority: 'https://auth.dataporten.no/',
  client_id: process.env.REACT_APP_FEIDE_DP_APP_ID as string,
  redirect_uri: process.env.REACT_APP_FEIDE_DP_REDIRECT_URI as string,
  response_type: 'id_token token',
  scope: feideGatekeeperScope + ' openid profile email groups userid userid-feide userinfo-entitlement',
};
export const oidcLogoutUrl = 'https://auth.dataporten.no/logout';

/* Show warning in the footer about this being a staging/test system */
export const appStagingWarning: boolean = (process.env.REACT_APP_STAGING_WARNING === 'true');

/* Footer content */
export const appHelpLink: string = 'https://www.uio.no/for-ansatte/arbeidsstotte/arrangere-valg/';
export const appTechnicalSupportEmail: string = 'it-support@uio.no';
export const appServiceOwnerLink: string = 'https://www.usit.uio.no/om/organisasjon/bnt/usitint/';
export const appTermsAndPrivacylink: string = '#TODO';
export const appCookiesInformationLink: string = '#TODO';
