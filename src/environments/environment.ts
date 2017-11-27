// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyACRHz0bJjFFrcEC0Ts6FCBMZdPZ0x1BKI',
    authDomain: 'conversation-analyzer.firebaseapp.com',
    databaseURL: 'https://conversation-analyzer.firebaseio.com',
    projectId: 'conversation-analyzer',
    storageBucket: 'conversation-analyzer.appspot.com',
    messagingSenderId: '861628240407'
  }
};
