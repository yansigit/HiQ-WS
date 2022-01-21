import IconLogin from "../../public/icon_login.png"
import Image from "next/image";
import styles from "./login.module.css"
import Link from "next/link";
import {gql} from "@apollo/client";
import client from '../apollo-client'
import {useRef} from "react";
import {useRouter} from "next/router";

export default function Login() {
    const [userID, userPW] = [useRef(), useRef()]
    const router = useRouter()

    async function login(userId, password) {
        const { data: {login} } = await client.query({
            query: gql`
                query($userId: String!, $password: String!) {
                    login(userId: $userId, password: $password)
                }
            `,
            variables: {userId, password}
        });

        if (login.length < 2) {
            alert("로그인에 실패하였습니다")
            return;
        }
        await router.push("/")
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
                <section className="col p-5 d-flex flex-column justify-content-center">
                    <div className={`${styles.typelogo} row justify-content-center align-items-center`}>
                        <Image src={IconLogin} />
                    </div>
                    <div className="input-group">
                    <input type="text" className="rounded-0 w-100 m-1 border" ref={userID}/>
                    <input type="password" className="rounded-0 w-100 m-1 border" ref={userPW} />
                    <button className="btn btn-danger text-white rounded-0 w-100 m-1" onClick={() => login(userID.current.value, userPW.current.value)}>로그인</button>
                    </div>
                </section>
            </main>
            <footer className="row justify-content-center p-3 bg-dark text-white text-center">
                <small>Copyright © 2022. HYUNDAI WELDING Ltd. All rights Reserved.</small>
            </footer>
            </div>
        </body>
    )
}