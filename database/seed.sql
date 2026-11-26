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
COMMIT;
