import { ScrollViewStyleReset } from "expo-router/html";
import type { PropsWithChildren } from "react";

export default function Html({ children }: PropsWithChildren) {
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover"
                />
                <title>FixAm</title>
                <meta
                    name="description"
                    content="Book trusted artisans in Lagos — plumbers, electricians, AC techs and more."
                />
                <ScrollViewStyleReset />
                <link
                    rel="stylesheet"
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
                />
                <style
                    dangerouslySetInnerHTML={{
                        __html: `
              html, body, #root { height: 100%; background: #0B1220; }
              body { overflow: hidden; }
              * { font-family: Inter, ui-sans-serif, system-ui, -apple-system, sans-serif; }
            `,
                    }}
                />
            </head>
            <body>{children}</body>
        </html>
    );
}
