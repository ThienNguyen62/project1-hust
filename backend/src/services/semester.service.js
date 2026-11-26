import { recordError } from './record-error.js';
import { isValidDate } from './academic-year.service.js';

export class SemesterService {
  constructor(repository) {
    this.repository = repository;
  }

  list(yearId) {
    return this.repository.list(yearId);
  }

  save(yearId, input, id) {
    const { number, startDate, endDate } = input ?? {};
    if (![1, 2].includes(number) || !isValidDate(startDate) ||
        !isValidDate(endDate) || startDate > endDate) {
      throw recordError(400, 'Chọn học kỳ I hoặc II và nhập khoảng ngày hợp lệ.');
    }
    return this.repository.withYear(yearId, async (connection, year) => {
      if (!year) throw recordError(404, 'Không tìm thấy năm học.');
      if (startDate < year.startDate || endDate > year.endDate) {
        throw recordError(400, 'Ngày học kỳ phải nằm trong khoảng ngày của năm học.');
      }
      const semesters = await this.repository.list(yearId, connection);
      if (id && !semesters.some((item) => item.id === id)) {
        throw recordError(404, 'Không tìm thấy học kỳ.');
      }
      const remaining = semesters.filter((item) => item.id !== id);
      if (remaining.some((item) => item.number === number)) {
        throw recordError(409, 'Số học kỳ đã tồn tại trong năm học.');
      }
      const [other] = remaining;
      if (other && (number === 1 ? endDate >= other.startDate : startDate <= other.endDate)) {
        throw recordError(409, 'Học kỳ I phải kết thúc trước ngày bắt đầu học kỳ II.');
      }
      return this.repository.save(connection, yearId, { number, startDate, endDate }, id);
    });
  }

  remove(yearId, id) {
    return this.repository.withYear(yearId, async (connection) => {
      if (!await this.repository.remove(connection, yearId, id)) {
        throw recordError(404, 'Không tìm thấy học kỳ.');
      }
    });
  }
}
