import { knex } from "knex"

export class BaseDatabase{
    //public connection = knex({
    protected static connection = knex ({
        client: "sqlite3",
        connection: {
            filename: "./src/database/exercicios.db",
        },
        useNullAsDefault: true,
        pool: { 
            min: 0,
            max: 1,
            afterCreate: (conn: any, cb: any) => {
                conn.run("PRAGMA foreign_keys = ON", cb)
            }
        }
    })
}

// abstract deixa não instanciavel
//vai dar erro => 
//const baseDatabase = new BaseDatabase()
//baseDatabase.connection()

//static faz o dado não ser acessado via instância
//BaseDatabase.connection()