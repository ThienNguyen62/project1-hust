const yearSelect = `SELECT DATE_FORMAT(TuNgay, '%Y-%m-%d') AS startDate,
  DATE_FORMAT(DenNgay, '%Y-%m-%d') AS endDate FROM NAM_HOC WHERE NamHocID = ?`;

export class SemesterRepository {
  constructor(getPool) {
    this.getPool = getPool;
  }

  async list(yearId, connection = this.getPool()) {
    const [rows] = await connection.execute(`
      SELECT HocKyID AS id, SoHocKy AS number,
             DATE_FORMAT(TuNgay, '%Y-%m-%d') AS startDate,
             DATE_FORMAT(DenNgay, '%Y-%m-%d') AS endDate
      FROM HOC_KY WHERE NamHocID = ? ORDER BY SoHocKy`, [yearId]);
    return rows;
  }

  async withYear(yearId, operation) {
    const connection = await this.getPool().getConnection();
    try {
      await connection.beginTransaction();
      const [[year]] = await connection.execute(yearSelect + ' FOR UPDATE', [yearId]);
      const result = await operation(connection, year);
      await connection.commit();
      return result;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async save(connection, yearId, { number, startDate, endDate }, id) {
    if (id) {
      await connection.execute('UPDATE HOC_KY SET SoHocKy = ?, TuNgay = ?, DenNgay = ? WHERE HocKyID = ? AND NamHocID = ?',
        [number, startDate, endDate, id, yearId]);
      return { id, number, startDate, endDate };
    }
    const [result] = await connection.execute('INSERT INTO HOC_KY (SoHocKy, TuNgay, DenNgay, NamHocID) VALUES (?, ?, ?, ?)',
      [number, startDate, endDate, yearId]);
    return { id: result.insertId, number, startDate, endDate };
  }

  async remove(connection, yearId, id) {
    const [result] = await connection.execute('DELETE FROM HOC_KY WHERE NamHocID = ? AND HocKyID = ?', [yearId, id]);
    return result.affectedRows > 0;
  }
}
