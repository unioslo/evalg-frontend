# eValg

#### Build and publish new docker image:

`./update-harbor-image.sh`

## Development

### Dev quickstart:
1. `curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash`
2. `nvm install --lts`
3. `npm install`
4. `npm start`

### Configuration: Environment files

Use the `.env` files to configure the frontend. Put local overrides in e.g. `.env.development.local` or `.env.local`.

Tip: Set `BROWSER=none` in a local .env file to disable opening a browser when running `npm start`.

[Read more about environment variables](https://facebook.github.io/create-react-app/docs/adding-custom-environment-variables)

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

### Oppsett med VS Code

Installer utvidelsene TSLint og Prettier.
- TSLint linter koden med konfigurasjonen i tslint.json.
- Prettier formaterer koden med konfigurasjonen i .prettierrc (så man slipper å tenke på det, og alt blir formatert likt). Bruk innstillingen "Format on save" eller eventuelt Ctrl+Shift+I for å formatere en fil manuelt.

Andre extensions-anbefalinger: GitLens, Jest, Sass, Apollo GraphQL, et ikon-tema som Material Icon Theme.