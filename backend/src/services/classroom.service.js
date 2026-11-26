import { recordError } from './record-error.js';

export class ClassroomService {
  constructor(repository) {
    this.repository = repository;
  }

  list(yearId) {
    return this.repository.list(yearId);
  }

  async save(yearId, input, id) {
    const { code, name, grade } = input ?? {};
    const cleanCode = typeof code === 'string' ? code.trim() : '';
    const cleanName = typeof name === 'string' ? name.trim() : '';
    if (!cleanCode || [...cleanCode].length > 20 || !cleanName || [...cleanName].length > 60 ||
        ![10, 11, 12].includes(grade)) {
      throw recordError(400, 'Nhập mã lớp tối đa 20 ký tự, tên lớp tối đa 60 ký tự và chọn khối 10, 11 hoặc 12.');
    }
    try {
      const record = await this.repository.save(yearId, { code: cleanCode, name: cleanName, grade }, id);
      if (!record) throw recordError(404, 'Không tìm thấy lớp học trong năm đã chọn.');
      return record;
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') throw recordError(409, 'Mã lớp đã tồn tại trong năm học.');
      if (['ER_NO_REFERENCED_ROW', 'ER_NO_REFERENCED_ROW_2'].includes(error.code)) {
        throw recordError(404, 'Không tìm thấy năm học.');
      }
      throw error;
    }
  }

  async remove(yearId, id) {
    try {
      if (!await this.repository.remove(yearId, id)) {
        throw recordError(404, 'Không tìm thấy lớp học trong năm đã chọn.');
      }
    } catch (error) {
      if (['ER_ROW_IS_REFERENCED', 'ER_ROW_IS_REFERENCED_2'].includes(error.code)) {
        throw recordError(409, 'Không thể xóa lớp đã có dữ liệu liên quan.');
      }
      throw error;
    }
  }
}
