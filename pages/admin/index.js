import Layout from "../../components/layout";
import Cookies from "cookies";
import {getUserFromToken, tokenMiddleWare} from "../../lib/token";
import Link from "next/link";
import Error from "../../components/error";

export default function Admin({redirectToLogin, user}) {
    if (redirectToLogin) {
        const button = <Link href="/user/login">
            <a className="btn btn-danger">Login</a>
        </Link>

        return <Error title="ERROR" message="You are not authorized to access this page." customTag={button}/>
    }

    return <Layout user={user}>
        <h1>test</h1>
    </Layout>
}

export async function getServerSideProps({req, res}) {
    const {cookies: {accessToken, refreshToken}} = req

    if (!accessToken) {
        return {
            props: {redirectToLogin: true}
        }
    }

    const cookies = new Cookies(req, res)
    const newAccessToken = tokenMiddleWare(accessToken, refreshToken, cookies)
    const user = getUserFromToken(newAccessToken);

    return {
        props: {user}
    }
}