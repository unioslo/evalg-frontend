declare global {
  /* tslint:disable */
  interface Window {
    ENV: any;
  }
}

/* Locate the client environment */
const isProduction = process.env.NODE_ENV === 'production';
const env = isProduction ? window.ENV : process.env;

/* General settings */
export const cryptoVariant: string = 'nacl';
export const appTimezone: string = 'Europe/Oslo';

/* Backend */
export const graphqlBackend: string = env.REACT_APP_BACKEND_GRAPHQL as string;

/* Authentication */
export const authEnabled: boolean = env.REACT_APP_AUTH_ENABLED === 'true';
export const feideGatekeeperScope: string = env.REACT_APP_FEIDE_GK_API_SCOPE as string;
export const oidcConfig: Oidc.OidcClientSettings = {
  authority: 'https://auth.dataporten.no/',
  client_id: env.REACT_APP_FEIDE_DP_APP_ID as string,
  redirect_uri: env.REACT_APP_FEIDE_DP_REDIRECT_URI as string,
  response_type: 'id_token token',
  scope:
    feideGatekeeperScope +
    ' openid profile email groups userid userid-feide userinfo-entitlement',
};
export const oidcLogoutUrl = 'https://auth.dataporten.no/logout';

/* Show warning in the footer about this being a staging/test system */
export const appStagingWarning: boolean =
  env.REACT_APP_STAGING_WARNING === 'true';

/* Footer content */
export const appHelpLink: string =
  'https://www.uio.no/for-ansatte/arbeidsstotte/arrangere-valg/';
export const appTechnicalSupportEmail: string = 'it-support@uio.no';
export const appServiceOwnerLink: string =
  'https://www.usit.uio.no/om/organisasjon/bnt/usitint/';
export const appTermsAndPrivacylink: string = '#TODO';
export const appCookiesInformationLink: string = '#TODO';

/* Feature toggles */
export const appMobileVotingStepperVariant: 'simple' | 'circles' = 'circles';
export const sectionBottomBorderStyle: 'original' | 'stylish' = 'stylish';
