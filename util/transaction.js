const pool = require('./database');

exports.runInTransaction = async (callback) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const result = await callback(connection);

    await connection.commit();
    connection.release();
    return result;
  } catch (err) {
    try {
      await connection.rollback();
    } catch (rollbackErr) {
      console.error('Error al hacer rollback:', rollbackErr);
    }
    connection.release();
    throw err;
  }
};