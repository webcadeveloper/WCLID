// lib/db.ts
import { Pool } from 'pg';

// Crea la conexión a la base de datos con la URL proporcionada
const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:3pYifFQzv4Wg@ep-green-shadow-a612icip.us-west-2.aws.neon.tech/neondb?sslmode=require',
});

// Promisificar las consultas para usar async/await
const query = async (text: string, params?: any[]) => {
  const client = await pool.connect();
  try {
    const res = await client.query(text, params);
    return res;
  } finally {
    client.release();
  }
};

export default query;
