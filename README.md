# eValg

#### Build and publish new docker image:

`./update-harbor-image.sh`

## Development

### Dev quickstart:

1. `curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash`
2. `nvm install --lts`
3. `npm install`
4. `npm start`
5. `npm run storybook`

# Storybooks

When developing components, storybook (`npm run storybook`) can be used in
order to view updates to components automatically.

See `src/stories` for examples of how to create a story. Bear in mind that
appropriate providers must be supplied in the decorator in
`.storybook/config.js`

### Configuration: Environment files

Use the `.env` files to configure the frontend. Put local overrides in e.g. `.env.development.local` or `.env.local`.

Tip: Set `BROWSER=none` in a local .env file to disable opening a browser when running `npm start`.

[Read more about environment variables](https://facebook.github.io/create-react-app/docs/adding-custom-environment-variables)

### Configuration: Authentication

Authentication can be enabled by setting the environment variable `REACT_APP_AUTH_ENABLED` to `"true"`.

When authentication is enabled, the following must also be set:

- `REACT_APP_FEIDE_GK_API_SCOPE` contains the scope used by the Dataporten API Gateway.
- `oidcLogoutUrl` in `appConfig.ts` is set to an endpoint which will facilitate logout.
- The following structure should be present in `appConfig.ts`, with proper values for the applicable application defined in Dataporten:
  ```
  export const oidcConfig: Oidc.OidcClientSettings = {
      authority: 'https://auth.dataporten.no/',
      client_id: '<my-client-id>',
      redirect_uri: '<my-proto>://<my-hostname>/callback',
      response_type: 'id_token token',
      scope:
          feideGatekeeperScope +
          ' openid profile email groups userid userid-feide userinfo-entitlement',
  };
  ```

### Relevant dokumentasjon og opplæring

- React - https://reactjs.org/docs/
- Create React App - https://facebook.github.io/create-react-app/
- Typescript - https://www.typescriptlang.org/docs/
- Apollo Client - https://www.apollographql.com/docs/react/
- GraqhQL generelt - https://graphql.org/learn/ og https://www.howtographql.com/
- React Router - https://reacttraining.com/react-router/web/guides/quick-start
- react-i18next - https://react.i18next.com/
- React-JSS (CSS i JS) - https://cssinjs.org/react-jss
- Classnames - https://github.com/JedWatson/classnames#readme
- react-final-form - https://github.com/final-form/react-final-form#-react-final-form
- Mozilla Developer Network web docs - https://developer.mozilla.org/en-US/docs/Web (god referanse for Javascript, HTML, CSS, Web APIer, osv.)

### VS Code

Some tips for configuring VS Code for this project.

## Install and configure ESLint

CRA 3.0 provides TypeScript linting via typescript-eslint. Install the ESLint extension and enable TypeScript support in it as per [these instructions](https://github.com/facebook/create-react-app/blob/master/docusaurus/docs/setting-up-your-editor.md#displaying-lint-output-in-the-editor).

Linting rules are currently inherited from CRA and cannot be modified. Revisit [this issue](https://github.com/facebook/create-react-app/issues/6871) at some point.

## Install Prettier

Prettier can automatically format code according to our `.prettierrc`. Consider enabling "Format on save" in VS Code. Ctrl+Shift+I to manually format a document.

## Other recommended extensions

GitLens, Jest, Sass, Apollo GraphQL, Material Icon Theme
