import pool from "../utils/db";
export default async function teste( ){
let teste = await pool.query("select * from usuarios")
console.log(teste)
}
teste()