import { ApplicationConfig, LOCALE_ID, provideBrowserGlobalErrorListeners, makeStateKey, TransferState } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideNativeDateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatPaginatorIntl } from '@angular/material/paginator';

import { routes } from './app.routes';
import { jwtInterceptor } from './core/interceptors/jwt.interceptor';
import { getPaginatorIntlPtBR } from './core/providers/paginator-intl';
import { API_URL } from './core/api-url.token';

const API_URL_KEY = makeStateKey<string>('apiUrl');

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch(), withInterceptors([jwtInterceptor])),
    provideAnimationsAsync(),
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    { provide: MatPaginatorIntl, useFactory: getPaginatorIntlPtBR },
    {
      provide: API_URL,
      useFactory: (ts: TransferState) => ts.get(API_URL_KEY, 'http://localhost:8080'),
      deps: [TransferState],
    },
  ],
};
