import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
} from "remix";
import type { LinksFunction } from "remix";

import { ChakraProvider, extendTheme, Heading, Box } from "@chakra-ui/react";

// https://remix.run/api/app#links
export let links: LinksFunction = () => {
  return [
    {
      rel: "shortcut icon",
      href: "/favicon.png",
    },
    {
      rel: "apple-touch-icon",
      href: "/favicon.png",
    },
    {
      rel: "icon",
      href: "/favicon.png",
    },

    {
      rel: "manifest",
      href: "/manifest.json",
    },
  ];
};

const theme = extendTheme({ colors: { "brand.900": "#fd0" } });

// https://remix.run/api/conventions#default-export
// https://remix.run/api/conventions#route-filenames
export default function App() {
  return (
    <Document>
      <ChakraProvider theme={theme}>
        <Outlet />
      </ChakraProvider>
    </Document>
  );
}
export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <Document title="Error!">
      <Box>
        <Heading as={"h1"}>There was an error</Heading>
      </Box>
    </Document>
  );
}

export function CatchBoundary() {
  let caught = useCatch();

  return (
    <Document title={`${caught.status} ${caught.statusText}`}>
      <Box>
        <Heading as={"h1"}>
          {caught.status} {caught.statusText}
        </Heading>
      </Box>
    </Document>
  );
}

function Document({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="application-name" content="Busket" />
        <meta name="apple-mobile-web-app-title" content="Busket" />
        <meta name="theme-color" content="#f5a623" />
        <meta name="msapplication-navbutton-color" content="#f5a623" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="msapplication-starturl" content="https://busket.wtf" />
        <meta name="viewport" content="initial-scale=1,  width=device-width" />
        {title ? <title>{title}</title> : null}
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
}
