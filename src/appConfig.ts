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
export const appTimezone: string = 'Europe/Oslo';

/* Version */
export const appVersion: string = process.env.REACT_APP_VERSION as string;
export const appName: string = process.env.REACT_APP_NAME as string;

/* Institution */
export const appInst: string = env.REACT_APP_INST as string;

/* Sentry */
const sentryPublicKey: string = env.REACT_APP_SENTRY_PUBLIC_KEY as string;
const sentryProjectId: string = env.REACT_APP_SENTRY_PROJECT_ID as string;
const sentryHost: string = env.REACT_APP_SENTRY_HOST as string;
export const sentryEnabled: boolean = sentryHost !== undefined ? true : false;
export const sentryDsn: string = `https://${sentryPublicKey}@${sentryHost}/${sentryProjectId}`;
export const sentryEnvironment: string = env.REACT_APP_SENTRY_ENVIRONMENT as string;

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
  env.REACT_APP_HELP_LINK ? env.REACT_APP_HELP_LINK as string :
  'https://www.uio.no/for-ansatte/arbeidsstotte/arrangere-valg/';

export const appTechnicalSupportLink: string = env.REACT_APP_SUPPORT_URL as string;
export const appTechnicalSupportMail: string = env.REACT_APP_SUPPORT_MAIL as string;

export const appServiceOwnerLink: string =
  'https://www.usit.uio.no/om/organisasjon/bnt/usitint/';
export const appPrivacyPolicylink = {
  nb:
    'https://www.uio.no/tjenester/it/applikasjoner/e-valg/personvern/info.html',
  en:
    'https://www.uio.no/tjenester/it/applikasjoner/e-valg/personvern/info.html',
};
export const appCookiesInformationLink = {
  nb:
    'https://www.uio.no/tjenester/it/applikasjoner/e-valg/personvern/cookies.html',
  en:
    'https://www.uio.no/english/services/it/adm-services/evalg/privacy/cookies.html',
};

/* User feedback url */
export const feedbackUrl: string = env.REACT_APP_FEEDBACK_URL as string;

/* Feature toggles */
export const appCandOrder: string = env.REACT_APP_CANDIDATE_ORDERING as string;
export const appMobileVotingStepperVariant: 'simple' | 'circles' = 'circles';
export const sectionBottomBorderStyle: 'original' | 'stylish' = 'stylish';
export const showGenerateVotesTestingComponent = false;
export const enableAnnounceElectionGroup = false;
// Show the content of loginpage.message as a msgbox on the frontpage
export const showUserMsg = false;
