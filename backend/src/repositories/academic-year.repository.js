export class AcademicYearRepository {
  constructor(getPool) {
    this.getPool = getPool;
  }

  async findAll() {
    const [rows] = await this.getPool().execute(`
      SELECT NamHocID AS id, MaNamHoc AS code,
             DATE_FORMAT(TuNgay, '%Y-%m-%d') AS startDate,
             DATE_FORMAT(DenNgay, '%Y-%m-%d') AS endDate,
             GhiChu AS note,
             (SELECT COUNT(*) FROM HOC_KY WHERE HOC_KY.NamHocID = NAM_HOC.NamHocID) AS semesterCount
      FROM NAM_HOC
      ORDER BY TuNgay DESC, NamHocID DESC
    `);
    return rows;
  }

  async save({ code, startDate, endDate, note, semesters }, id) {
    const connection = await this.getPool().getConnection();
    try {
      await connection.beginTransaction();
      if (id) {
        const [[existing]] = await connection.execute(
          `SELECT DATE_FORMAT(TuNgay, '%Y-%m-%d') AS startDate,
                  DATE_FORMAT(DenNgay, '%Y-%m-%d') AS endDate,
                  (SELECT COUNT(*) FROM HOC_KY WHERE NamHocID = ?) AS semesterCount,
                  EXISTS(SELECT 1 FROM LOP_HOC WHERE NamHocID = ?) AS hasClasses
           FROM NAM_HOC WHERE NamHocID = ? FOR UPDATE`, [id, id, id],
        );
        if (!existing) {
          await connection.rollback();
          return null;
        }
        if ((existing.hasClasses || existing.semesterCount) &&
            (existing.startDate !== startDate || existing.endDate !== endDate)) {
          throw Object.assign(new Error('Academic year dates are in use'), {
            code: 'ACADEMIC_YEAR_DATES_IN_USE',
          });
        }
        await connection.execute(
          'UPDATE NAM_HOC SET MaNamHoc = ?, TuNgay = ?, DenNgay = ?, GhiChu = ? WHERE NamHocID = ?',
          [code, startDate, endDate, note, id],
        );
        await connection.commit();
        return { id, code, startDate, endDate, note, semesterCount: existing.semesterCount };
      }
      const [result] = await connection.execute(
        'INSERT INTO NAM_HOC (MaNamHoc, TuNgay, DenNgay, GhiChu) VALUES (?, ?, ?, ?)',
        [code, startDate, endDate, note],
      );
      for (const semester of semesters) {
        await connection.execute(
          'INSERT INTO HOC_KY (NamHocID, SoHocKy, TuNgay, DenNgay) VALUES (?, ?, ?, ?)',
          [result.insertId, semester.number, semester.startDate, semester.endDate],
        );
      }
      await connection.commit();
      return {
        id: result.insertId, code, startDate, endDate, note,
        semesterCount: semesters.length,
      };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async remove(id) {
    const connection = await this.getPool().getConnection();
    try {
      await connection.beginTransaction();
      await connection.execute('SELECT NamHocID FROM NAM_HOC WHERE NamHocID = ? FOR UPDATE', [id]);
      await connection.execute('DELETE FROM HOC_KY WHERE NamHocID = ?', [id]);
      const [result] = await connection.execute('DELETE FROM NAM_HOC WHERE NamHocID = ?', [id]);
      await connection.commit();
      return result.affectedRows > 0;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}
