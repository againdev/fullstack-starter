"use client";

import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { ApolloProvider as Provider } from "@apollo/client/react";
import { useState } from "react";

function makeClient() {
  const uri =
    typeof window === "undefined"
      ? (process.env.NEXT_PUBLIC_GRAPHQL_URL ?? "http://127.0.0.1:4000/graphql")
      : "/graphql";

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri,
      credentials: "include",
    }),
  });
}

export function ApolloProvider({ children }: { children: React.ReactNode }) {
  const [client] = useState(makeClient);
  return <Provider client={client}>{children}</Provider>;
}
