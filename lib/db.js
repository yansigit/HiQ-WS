import knex from "knex";
import 'dotenv/config'

class DBConnector {
    static DB

    static get getInstance() {
        if (!this.DB) {
            this.DB = knex({
                client: 'oracledb',
                connection: {
                    host: process.env.DB_HOST,
                    port: process.env.DB_PORT,
                    user: process.env.DB_USER,
                    password: process.env.DB_PASS,
                    database: process.env.DATABASE
                },
                pool: {min: 0, max: 20}
            })
            // TEST
            this.DB.select('EMAIL').from('USERS').then(e => {
                console.log("DB SUCCESSFULLY CONNECTED")
            }, e => {
                console.log(e)
            })
        }
        return this.DB
    }
}

export default DBConnector
