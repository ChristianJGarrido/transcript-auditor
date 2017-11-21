// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyBRwPGyxSlnlDWeFhTtROmvFjp9aF5o6wA',
    authDomain: 'transcript-auditor.firebaseapp.com',
    databaseURL: 'https://transcript-auditor.firebaseio.com',
    projectId: 'transcript-auditor',
    storageBucket: 'transcript-auditor.appspot.com',
    messagingSenderId: '941457543276'
  }
};
