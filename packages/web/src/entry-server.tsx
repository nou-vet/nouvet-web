// @refresh reload
import { createHandler, StartServer } from '@solidjs/start/server';

export default createHandler((ctx) => {
  let { locale } = ctx.locals as { locale: Intl.Locale };
  if (!locale) {
    console.error('Probably HMR, defaulting to en');
    locale = new Intl.Locale('en');
  }
  return (
    <StartServer
      document={({ assets, children, scripts }) => (
        <html
          lang={locale.baseName}
          dir={
            'textInfo' in locale
              ? // @ts-expect-error Chrome has this
                locale.textInfo.direction
              : 'getTextInfo' in locale
                ? // @ts-expect-error Worker has this?
                  locale.getTextInfo().direction
                : 'ltr'
          }
        >
          <head>
            <meta charset="utf-8" />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
            <link rel="icon" href="/icons/favicon.ico" sizes="32x32" />
            <link
              rel="icon"
              href="/icons/icon.svg"
              sizes="32x32"
              type="image/svg+xml"
            />
            <link rel="apple-touch-icon" href="/icons/icon-apple.png" />
            <link rel="manifest" href="/manifest.webmanifest" />
            {assets}
          </head>
          <body>
            <div id="app">{children}</div>
            {scripts}
          </body>
        </html>
      )}
    />
  );
});
