-- Dữ liệu mẫu dành cho database phát triển.
-- Chạy toàn bộ trong Workbench hoặc dùng npm.cmd run db:seed trong backend.
-- Giữ dòng '-- seed:statement' giữa các câu lệnh để terminal chạy đúng thứ tự.

USE school_management;

-- seed:statement
START TRANSACTION;

-- seed:statement
-- Năm học 2024-2025
INSERT INTO NAM_HOC (MaNamHoc, TuNgay, DenNgay)
SELECT '2024-2025', '2024-09-05', '2025-05-31'
WHERE NOT EXISTS (SELECT 1 FROM NAM_HOC WHERE MaNamHoc = '2024-2025');

-- seed:statement
-- Năm học 2025-2026
INSERT INTO NAM_HOC (MaNamHoc, TuNgay, DenNgay)
SELECT '2025-2026', '2025-09-05', '2026-05-31'
WHERE NOT EXISTS (SELECT 1 FROM NAM_HOC WHERE MaNamHoc = '2025-2026');

-- seed:statement
SET @seed_nam_hoc_id = IF(ROW_COUNT() = 1, LAST_INSERT_ID(), NULL);

-- seed:statement
INSERT INTO HOC_KY (NamHocID, SoHocKy, TuNgay, DenNgay)
SELECT @seed_nam_hoc_id, 1, '2025-09-05', '2026-01-15' WHERE @seed_nam_hoc_id IS NOT NULL
UNION ALL
SELECT @seed_nam_hoc_id, 2, '2026-01-16', '2026-05-31' WHERE @seed_nam_hoc_id IS NOT NULL;

-- seed:statement
-- Năm học 2026-2027
INSERT INTO NAM_HOC (MaNamHoc, TuNgay, DenNgay)
SELECT '2026-2027', '2026-09-05', '2027-05-31'
WHERE NOT EXISTS (SELECT 1 FROM NAM_HOC WHERE MaNamHoc = '2026-2027');

-- seed:statement
SET @seed_nam_hoc_id = IF(ROW_COUNT() = 1, LAST_INSERT_ID(), NULL);

-- seed:statement
INSERT INTO HOC_KY (NamHocID, SoHocKy, TuNgay, DenNgay)
SELECT @seed_nam_hoc_id, 1, '2026-09-05', '2027-01-15' WHERE @seed_nam_hoc_id IS NOT NULL
UNION ALL
SELECT @seed_nam_hoc_id, 2, '2027-01-16', '2027-05-31' WHERE @seed_nam_hoc_id IS NOT NULL;

-- seed:statement
-- Năm học 2027-2028
INSERT INTO NAM_HOC (MaNamHoc, TuNgay, DenNgay)
SELECT '2027-2028', '2027-09-05', '2028-05-31'
WHERE NOT EXISTS (SELECT 1 FROM NAM_HOC WHERE MaNamHoc = '2027-2028');

-- seed:statement
SET @seed_nam_hoc_id = IF(ROW_COUNT() = 1, LAST_INSERT_ID(), NULL);

-- seed:statement
INSERT INTO HOC_KY (NamHocID, SoHocKy, TuNgay, DenNgay)
SELECT @seed_nam_hoc_id, 1, '2027-09-05', '2028-01-15' WHERE @seed_nam_hoc_id IS NOT NULL
UNION ALL
SELECT @seed_nam_hoc_id, 2, '2028-01-16', '2028-05-31' WHERE @seed_nam_hoc_id IS NOT NULL;

-- seed:statement
-- Năm học 2028-2029
INSERT INTO NAM_HOC (MaNamHoc, TuNgay, DenNgay)
SELECT '2028-2029', '2028-09-05', '2029-05-31'
WHERE NOT EXISTS (SELECT 1 FROM NAM_HOC WHERE MaNamHoc = '2028-2029');

-- seed:statement
SET @seed_nam_hoc_id = IF(ROW_COUNT() = 1, LAST_INSERT_ID(), NULL);

-- seed:statement
INSERT INTO HOC_KY (NamHocID, SoHocKy, TuNgay, DenNgay)
SELECT @seed_nam_hoc_id, 1, '2028-09-05', '2029-01-15' WHERE @seed_nam_hoc_id IS NOT NULL
UNION ALL
SELECT @seed_nam_hoc_id, 2, '2029-01-16', '2029-05-31' WHERE @seed_nam_hoc_id IS NOT NULL;

-- seed:statement
INSERT INTO LOP_HOC (NamHocID, MaLop, TenLop, Khoi)
SELECT @seed_nam_hoc_id, '10-MAU', 'Lớp 10 mẫu', 10
WHERE @seed_nam_hoc_id IS NOT NULL;

-- seed:statement
-- Năm học và ba khối dành cho kiểm thử danh sách lớp
INSERT INTO NAM_HOC (MaNamHoc, TuNgay, DenNgay)
SELECT '2029-2030', '2029-09-05', '2030-05-31'
WHERE NOT EXISTS (SELECT 1 FROM NAM_HOC WHERE MaNamHoc = '2029-2030');

-- seed:statement
SET @seed_nam_hoc_id = IF(ROW_COUNT() = 1, LAST_INSERT_ID(), NULL);

-- seed:statement
INSERT INTO LOP_HOC (NamHocID, MaLop, TenLop, Khoi)
SELECT @seed_nam_hoc_id, '10A1', 'Lớp 10A1', 10 WHERE @seed_nam_hoc_id IS NOT NULL
UNION ALL
SELECT @seed_nam_hoc_id, '11A1', 'Lớp 11A1', 11 WHERE @seed_nam_hoc_id IS NOT NULL
UNION ALL
SELECT @seed_nam_hoc_id, '12A1', 'Lớp 12A1', 12 WHERE @seed_nam_hoc_id IS NOT NULL;

-- seed:statement
-- Buổi mẫu để kiểm thử quy tắc không xóa lớp đã được tham chiếu
INSERT INTO BUOI_DIEM_DANH (LopHocID, NgayHoc, Buoi, TrangThai)
SELECT LopHocID, '2029-09-10', 'AM', 'PLANNED'
FROM LOP_HOC WHERE NamHocID = @seed_nam_hoc_id AND MaLop = '12A1';

-- seed:statement
-- 24 lớp cho kiểm thử thống kê, tìm kiếm và phân trang theo ba khối.
INSERT INTO NAM_HOC (MaNamHoc, TuNgay, DenNgay)
SELECT '2030-2031', '2030-09-05', '2031-05-31'
WHERE NOT EXISTS (SELECT 1 FROM NAM_HOC WHERE MaNamHoc = '2030-2031');

-- seed:statement
SET @seed_nam_hoc_id = IF(ROW_COUNT() = 1, LAST_INSERT_ID(), NULL);

-- seed:statement
INSERT INTO LOP_HOC (NamHocID, MaLop, TenLop, Khoi)
SELECT @seed_nam_hoc_id, CONCAT(Khoi, 'A', SoLop), CONCAT('Lớp ', Khoi, 'A', SoLop), Khoi
FROM (SELECT 10 AS Khoi UNION ALL SELECT 11 UNION ALL SELECT 12) AS KhoiMau
CROSS JOIN (
    SELECT 1 AS SoLop UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
    UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8
) AS LopMau
WHERE @seed_nam_hoc_id IS NOT NULL;

-- seed:statement
COMMIT;
