import { mergeApplicationConfig, ApplicationConfig, APP_INITIALIZER, makeStateKey, TransferState } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';

const API_URL_KEY = makeStateKey<string>('apiUrl');

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    {
      provide: APP_INITIALIZER,
      useFactory: (ts: TransferState) => () => {
        ts.set(API_URL_KEY, process.env['API_URL'] || 'http://localhost:8080');
      },
      deps: [TransferState],
      multi: true,
    },
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
