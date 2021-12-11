import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
} from "remix";
import { useState } from "react";
import type { LinksFunction } from "remix";
import {
  ChakraProvider,
  extendTheme,
  Heading,
  Flex,
  Container,
  Input,
  NumberInput,
  NumberInputField,
  InputGroup,
  InputLeftElement,
  Box,
  Button,
} from "@chakra-ui/react";

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
  ];
};

const theme = extendTheme({ colors: { "brand.900": "#fd0" } });

// https://remix.run/api/conventions#default-export
// https://remix.run/api/conventions#route-filenames
export default function App() {
  const [busNumberInput, setBusNumberInput] = useState<number | string>("");
  return (
    <Document>
      <ChakraProvider theme={theme}>
        <Flex
          as="header"
          position="fixed"
          w="100%"
          top="0"
          zIndex="200"
          backgroundColor="#fff"
          padding={2}
          boxSizing="border-box"
          boxShadow="lg"
        >
          <InputGroup size="lg">
            <NumberInput width="100%">
              <NumberInputField
                placeholder="Enter bus stop number"
                value={busNumberInput?.toString()}
                onChange={(e) => {
                  setBusNumberInput(e.target.value);
                }}
                onBlur={(e) => {
                  setBusNumberInput(parseInt(e.target.value) || "");
                }}
                autoFocus
              />
            </NumberInput>
            <Button
              ml={2}
              onClick={() => {
                window.location.pathname = `/stop/${busNumberInput}`;
              }}
            >
              Go
            </Button>
          </InputGroup>
        </Flex>
        <Container mt={24} pb={24} as="main">
          <Outlet />
        </Container>
      </ChakraProvider>
    </Document>
  );
}
export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <Document title="Error!">
      <ChakraProvider theme={theme}>
        <Box>
          <Heading as={"h1"}>There was an error</Heading>
        </Box>
      </ChakraProvider>
    </Document>
  );
}

export function CatchBoundary() {
  let caught = useCatch();

  return (
    <Document title={`${caught.status} ${caught.statusText}`}>
      <ChakraProvider theme={theme}>
        <Box>
          <Heading as={"h1"}>
            {caught.status} {caught.statusText}
          </Heading>
        </Box>
      </ChakraProvider>
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
        <meta name="viewport" content="width=device-width,initial-scale=1" />
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
