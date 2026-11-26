export function isValidDate(value) {
  if (typeof value !== 'string' || !/^[1-9]\d{3}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export class AcademicYearService {
  constructor(repository) {
    this.repository = repository;
  }

  list() {
    return this.repository.findAll();
  }

  async save(input, id) {
    const { code, startDate, endDate, note = '', createSemesters = false } = input ?? {};
    const normalizedCode = typeof code === 'string' ? code.trim() : '';
    if (!/^[1-9]\d{3}-[1-9]\d{3}$/.test(normalizedCode)) {
      return { status: 400, message: 'Mã năm học phải có dạng 2026-2027.' };
    }
    if (!isValidDate(startDate) || !isValidDate(endDate)) {
      return { status: 400, message: 'Vui lòng nhập ngày bắt đầu và ngày kết thúc hợp lệ.' };
    }
    if (startDate >= endDate) {
      return { status: 400, message: 'Ngày kết thúc phải sau ngày bắt đầu.' };
    }
    if (typeof note !== 'string' || [...note.trim()].length > 500 ||
        typeof createSemesters !== 'boolean') {
      return { status: 400, message: 'Ghi chú tối đa 500 ký tự và tùy chọn học kỳ phải hợp lệ.' };
    }

    const semesters = [];
    if (createSemesters) {
      const first = Date.parse(startDate);
      const last = Date.parse(endDate);
      const day = 86_400_000;
      const midpoint = first + Math.floor((last - first) / day / 2) * day;
      semesters.push(
        { number: 1, startDate, endDate: new Date(midpoint).toISOString().slice(0, 10) },
        { number: 2, startDate: new Date(midpoint + day).toISOString().slice(0, 10), endDate },
      );
    }

    try {
      const data = await this.repository.save({
        code: normalizedCode, startDate, endDate, note: note.trim() || null, semesters,
      }, id);
      if (!data) return { status: 404, message: 'Không tìm thấy năm học.' };
      return { status: id ? 200 : 201, data };
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        return { status: 409, message: 'Mã năm học đã tồn tại.' };
      }
      if (error.code === 'ACADEMIC_YEAR_DATES_IN_USE') {
        return { status: 409, message: 'Năm học đã có học kỳ hoặc lớp. Hãy giữ nguyên khoảng ngày.' };
      }
      throw error;
    }
  }

  async remove(id) {
    try {
      if (await this.repository.remove(id)) return { status: 200, data: { id } };
      return { status: 404, message: 'Không tìm thấy năm học.' };
    } catch (error) {
      if (['ER_ROW_IS_REFERENCED', 'ER_ROW_IS_REFERENCED_2'].includes(error.code)) {
        return { status: 409, message: 'Không thể xóa năm học đã có lớp hoặc dữ liệu liên quan.' };
      }
      throw error;
    }
  }
}
