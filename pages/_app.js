import { RecoilRoot } from "recoil";
import { ApolloProvider} from "@apollo/client";
import client from "./apollo-client";
import 'bootstrap/dist/css/bootstrap.css'
import '../styles/global.css'
import {useEffect} from "react";

export default function App({ Component, pageProps }) {
    useEffect(() => {
        import("bootstrap/dist/js/bootstrap");
    }, []);

    return (
        <ApolloProvider client={client}><Component {...pageProps} /></ApolloProvider>
    )
}