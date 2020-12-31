// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: 'http://192.168.87.250:3000/api/',
  socketUrl: 'http://192.168.87.250:3000',
  // apiUrl: 'http://127.0.0.1:3000/api/',
  // socketUrl: 'http://127.0.0.1:3000',
  imageServer: 'http://192.168.87.250:888/',
  wechatServer: 'http://timebox.i234.me/wechat/',
  bypassPayment: true,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
