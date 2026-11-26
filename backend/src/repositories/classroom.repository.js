export class ClassroomRepository {
  constructor(getPool) {
    this.getPool = getPool;
  }

  async list(yearId) {
    const [rows] = await this.getPool().execute(
      'SELECT LopHocID AS id, MaLop AS code, TenLop AS name, Khoi AS grade FROM LOP_HOC WHERE NamHocID = ? ORDER BY Khoi, MaLop',
      [yearId],
    );
    return rows;
  }

  async save(yearId, { code, name, grade }, id) {
    if (id) {
      const [result] = await this.getPool().execute(
        'UPDATE LOP_HOC SET MaLop = ?, TenLop = ?, Khoi = ? WHERE NamHocID = ? AND LopHocID = ?',
        [code, name, grade, yearId, id],
      );
      return result.affectedRows ? { id, code, name, grade } : null;
    }
    const [result] = await this.getPool().execute(
      'INSERT INTO LOP_HOC (NamHocID, MaLop, TenLop, Khoi) VALUES (?, ?, ?, ?)',
      [yearId, code, name, grade],
    );
    return { id: result.insertId, code, name, grade };
  }

  async remove(yearId, id) {
    const [result] = await this.getPool().execute(
      'DELETE FROM LOP_HOC WHERE NamHocID = ? AND LopHocID = ?', [yearId, id],
    );
    return result.affectedRows > 0;
  }
}
