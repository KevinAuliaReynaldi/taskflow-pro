import mysql from 'mysql2/promise'

const dbConfig = {
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '3306'),
  database: process.env.DATABASE_NAME,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
}

const pool = mysql.createPool(dbConfig)

/**
 * Menjalankan query SQL ke database.
 * 
 * @param sql String query SQL
 * @param values Array nilai untuk placeholder query
 * @returns Hasil query
 */
export async function query(sql: string, values?: any[]) {
  try {
    const [results] = await pool.execute(sql, values)
    return results
  } catch (error) {
    console.error('Kesalahan query database:', error)
    throw error
  }
}

/**
 * Mendapatkan koneksi tunggal dari pool database.
 * 
 * @returns Koneksi database
 */
export async function getConnection() {
  return await pool.getConnection()
}

export default pool