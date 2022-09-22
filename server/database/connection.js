require('dotenv').config()

const sql = require('mssql')

const dbSettings = {
  user : process.env.DB_USERNAME,
  password : process.env.DB_PASSWORD,
  server : process.env.DB_HOST,
  database : process.env.DB_NAME,
  options: {
    encrypt: true, // for azure
    trustServerCertificate: true // change to true for local dev / self-signed certs
  }
}

const getConnection = async () => {
  try{
    const pool = await sql.connect(dbSettings)
    return pool;
  }catch (err) {
    console.error('ERROR FATAL DE CONEXION');
  }
}

module.exports = getConnection;

