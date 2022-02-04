import Layout from "../../components/layout";
import Cookies from "cookies";
import {getUserFromToken, tokenMiddleWare} from "../../lib/token";
import Link from "next/link";
import Error from "../../components/error";
import {useState} from "react";

export default function Admin({redirectToLogin, user}) {
    if (redirectToLogin) {
        const button = <Link href="/user/login">
            <a className="btn btn-danger">Login</a>
        </Link>

        return <Error title="ERROR" message="You are not authorized to access this page." customTag={button}/>
    }

    const [onLive, setLive] = useState(false)

    return <Layout user={user}>
        <div className="card bg-white">
            <h5 className="card-header text-center">Start real-time monitoring</h5>
            <div className="card-body row align-items-center justify-content-center">
                <div className="col-auto">
                    <label>Hull Number</label>
                </div>
                <div className="col-auto">
                    <input type="number" className="form-control" />
                </div>
                <div className="col-auto">
                    <button onClick={() => setLive(!onLive)} className={`btn ${onLive ? 'btn-secondary' : 'btn-warning'}`}>
                        {onLive ? 'Stop' : 'Start'}
                    </button>
                </div>
            </div>
        </div>
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

    if (user.ROLE !== 'admin') {
        cookies.set('accessToken', null)
        cookies.set('refreshToken', null)
        return {
            props: {redirectToLogin: true}
        }
    }

    return {
        props: {user}
    }
}