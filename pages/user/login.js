import IconLogin from "../../public/icon_login.png"
import Image from "next/image";
import styles from "./login.module.css"
import {useEffect, useRef} from "react";
import {useRouter} from "next/router";
import {useForm} from "react-hook-form";
import {inspectToken} from "../../lib/token";

export default function Login({redirectToDashboard}) {
    const [userID, userPW] = [useRef(), useRef()]
    const router = useRouter()
    const { handleSubmit } = useForm()

    useEffect(async () => {
        if (redirectToDashboard)
            await router.replace("/")
    }, [])

    async function login(e) {
        const {success, error} = await (await fetch('/api/login', {
            method: 'POST',
            body: JSON.stringify({id: userID.current.value, password: userPW.current.value})
        })).json()

        if (success) {
            await router.push("/")
        } else {
            alert(error)
        }
    }

    return (
        <body className={`d-flex align-content-center justify-content-center ${styles.body}`}>
            <div className="container align-self-center">
            <header className="row justify-content-center p-3">
                {/*<Image src={HWLogo} />*/}
            </header>
            <main className="row border border-dark">
                {/* 이미지 */}
                <section className={`col p-0 ${styles.image_section}`}>
                </section>
                {/* 로그인 폼 */}
                <form onSubmit={handleSubmit(login)} className="col p-5 d-flex flex-column justify-content-center">
                    <div className={`${styles.typelogo} row justify-content-center align-items-center`}>
                        <Image src={IconLogin} />
                    </div>
                    <div className="input-group">
                    <input type="text" name="userID" className="rounded-0 w-100 m-1 border" ref={userID}/>
                    <input type="password" name="userPW" className="rounded-0 w-100 m-1 border" ref={userPW} />
                    <button className="btn btn-danger text-white rounded-0 w-100 m-1">로그인</button>
                    </div>
                </form>
            </main>
            <footer className="row justify-content-center p-3 bg-dark text-white text-center">
                <small>Copyright © 2022. HYUNDAI WELDING Ltd. All rights Reserved.</small>
            </footer>
            </div>
        </body>
    )
}

export async function getServerSideProps({req: {cookies: {accessToken, refreshToken}}}) {

    // 이미 로그인되어 있다면 대시보드로 이동
    if (accessToken) {
        inspectToken(accessToken)
        return {
            props: {redirectToDashboard: true}
        }
    }

    return {
        props: {}
    }
}