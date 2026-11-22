-- Thay mật khẩu mẫu trong Workbench và đóng tab mà không lưu thay đổi.
-- Nếu tài khoản đã tồn tại, bỏ qua CREATE USER và chạy từ GRANT.
CREATE USER 'school_app'@'localhost'
  IDENTIFIED BY 'THAY_BANG_MAT_KHAU_RIENG';

GRANT SELECT, INSERT, UPDATE, DELETE
  ON school_management.* TO 'school_app'@'localhost';

SHOW GRANTS FOR 'school_app'@'localhost';
