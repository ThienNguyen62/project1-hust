-- Chạy bằng tài khoản quản trị MySQL.
CREATE DATABASE IF NOT EXISTS school_management
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE school_management;

CREATE TABLE IF NOT EXISTS VAI_TRO (
    MaVaiTro VARCHAR(12) NOT NULL,
    TenVaiTro VARCHAR(50) NOT NULL,
    PRIMARY KEY (MaVaiTro)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS TAI_KHOAN (
    TaiKhoanID INT NOT NULL AUTO_INCREMENT,
    MaVaiTro VARCHAR(12) NOT NULL,
    TenDangNhap VARCHAR(100) NOT NULL,
    MatKhauBam VARCHAR(255) NOT NULL,
    TrangThai VARCHAR(12) NOT NULL,
    PRIMARY KEY (TaiKhoanID),
    CONSTRAINT uq_tai_khoan_ten_dang_nhap UNIQUE (TenDangNhap),
    CONSTRAINT fk_tai_khoan_vai_tro FOREIGN KEY (MaVaiTro)
        REFERENCES VAI_TRO (MaVaiTro) ON DELETE RESTRICT,
    CONSTRAINT chk_tai_khoan_trang_thai CHECK (BINARY TrangThai IN ('ACTIVE', 'LOCKED'))
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS GIAO_VIEN (
    GiaoVienID INT NOT NULL AUTO_INCREMENT,
    TaiKhoanID INT NULL,
    MaGiaoVien VARCHAR(20) NOT NULL,
    HoTen VARCHAR(100) NOT NULL,
    Email VARCHAR(254) NULL,
    SoDienThoai VARCHAR(20) NULL,
    PRIMARY KEY (GiaoVienID),
    CONSTRAINT uq_giao_vien_ma UNIQUE (MaGiaoVien),
    CONSTRAINT uq_giao_vien_tai_khoan UNIQUE (TaiKhoanID),
    CONSTRAINT fk_giao_vien_tai_khoan FOREIGN KEY (TaiKhoanID)
        REFERENCES TAI_KHOAN (TaiKhoanID) ON DELETE RESTRICT
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS NAM_HOC (
    NamHocID INT NOT NULL AUTO_INCREMENT,
    MaNamHoc CHAR(9) NOT NULL,
    TuNgay DATE NOT NULL,
    DenNgay DATE NOT NULL,
    HienHanh BOOLEAN NOT NULL DEFAULT FALSE,
    GhiChu VARCHAR(500) NULL,
    NamHocHienHanhUQ TINYINT GENERATED ALWAYS AS (
        CASE WHEN HienHanh = 1 THEN 1 ELSE NULL END
    ) STORED,
    PRIMARY KEY (NamHocID),
    CONSTRAINT uq_nam_hoc_ma UNIQUE (MaNamHoc),
    CONSTRAINT uq_nam_hoc_hien_hanh UNIQUE (NamHocHienHanhUQ),
    CONSTRAINT chk_nam_hoc_ngay CHECK (TuNgay < DenNgay),
    CONSTRAINT chk_nam_hoc_hien_hanh CHECK (HienHanh IN (0, 1))
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS HOC_KY (
    HocKyID INT NOT NULL AUTO_INCREMENT,
    NamHocID INT NOT NULL,
    SoHocKy TINYINT NOT NULL,
    TuNgay DATE NOT NULL,
    DenNgay DATE NOT NULL,
    PRIMARY KEY (HocKyID),
    CONSTRAINT uq_hoc_ky_nam_so UNIQUE (NamHocID, SoHocKy),
    CONSTRAINT fk_hoc_ky_nam_hoc FOREIGN KEY (NamHocID)
        REFERENCES NAM_HOC (NamHocID) ON DELETE RESTRICT,
    CONSTRAINT chk_hoc_ky_so CHECK (SoHocKy IN (1, 2)),
    CONSTRAINT chk_hoc_ky_ngay CHECK (TuNgay <= DenNgay)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS LOP_HOC (
    LopHocID INT NOT NULL AUTO_INCREMENT,
    NamHocID INT NOT NULL,
    MaLop VARCHAR(20) NOT NULL,
    TenLop VARCHAR(60) NOT NULL,
    Khoi TINYINT NOT NULL,
    PRIMARY KEY (LopHocID),
    CONSTRAINT uq_lop_hoc_nam_ma UNIQUE (NamHocID, MaLop),
    CONSTRAINT fk_lop_hoc_nam_hoc FOREIGN KEY (NamHocID)
        REFERENCES NAM_HOC (NamHocID) ON DELETE RESTRICT,
    CONSTRAINT chk_lop_hoc_khoi CHECK (Khoi IN (10, 11, 12))
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS HOC_SINH (
    HocSinhID INT NOT NULL AUTO_INCREMENT,
    MaHocSinh VARCHAR(20) NOT NULL,
    HoTen VARCHAR(100) NOT NULL,
    NgaySinh DATE NOT NULL,
    GioiTinh VARCHAR(20) NOT NULL,
    DiaChi VARCHAR(250) NULL,
    PRIMARY KEY (HocSinhID),
    CONSTRAINT uq_hoc_sinh_ma UNIQUE (MaHocSinh)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS XEP_LOP (
    XepLopID INT NOT NULL AUTO_INCREMENT,
    HocSinhID INT NOT NULL,
    LopHocID INT NOT NULL,
    TuNgay DATE NOT NULL,
    DenNgay DATE NULL,
    PRIMARY KEY (XepLopID),
    KEY ix_xep_lop_hoc_sinh_ngay (HocSinhID, TuNgay),
    KEY ix_xep_lop_lop_ngay (LopHocID, TuNgay),
    CONSTRAINT fk_xep_lop_hoc_sinh FOREIGN KEY (HocSinhID)
        REFERENCES HOC_SINH (HocSinhID) ON DELETE RESTRICT,
    CONSTRAINT fk_xep_lop_lop_hoc FOREIGN KEY (LopHocID)
        REFERENCES LOP_HOC (LopHocID) ON DELETE RESTRICT,
    CONSTRAINT chk_xep_lop_ngay CHECK (DenNgay IS NULL OR TuNgay < DenNgay)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS PHAN_CONG_CHU_NHIEM (
    PhanCongID INT NOT NULL AUTO_INCREMENT,
    GiaoVienID INT NOT NULL,
    LopHocID INT NOT NULL,
    TuNgay DATE NOT NULL,
    DenNgay DATE NULL,
    PRIMARY KEY (PhanCongID),
    KEY ix_phan_cong_lop_ngay (LopHocID, TuNgay),
    CONSTRAINT fk_phan_cong_giao_vien FOREIGN KEY (GiaoVienID)
        REFERENCES GIAO_VIEN (GiaoVienID) ON DELETE RESTRICT,
    CONSTRAINT fk_phan_cong_lop_hoc FOREIGN KEY (LopHocID)
        REFERENCES LOP_HOC (LopHocID) ON DELETE RESTRICT,
    CONSTRAINT chk_phan_cong_ngay CHECK (DenNgay IS NULL OR TuNgay < DenNgay)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS BUOI_DIEM_DANH (
    BuoiDiemDanhID INT NOT NULL AUTO_INCREMENT,
    LopHocID INT NOT NULL,
    NgayHoc DATE NOT NULL,
    Buoi CHAR(2) NOT NULL,
    TrangThai VARCHAR(12) NOT NULL,
    PRIMARY KEY (BuoiDiemDanhID),
    CONSTRAINT uq_buoi_diem_danh_lop_ngay_buoi UNIQUE (LopHocID, NgayHoc, Buoi),
    CONSTRAINT fk_buoi_diem_danh_lop_hoc FOREIGN KEY (LopHocID)
        REFERENCES LOP_HOC (LopHocID) ON DELETE RESTRICT,
    CONSTRAINT chk_buoi_diem_danh_buoi CHECK (BINARY Buoi IN ('AM', 'PM')),
    CONSTRAINT chk_buoi_diem_danh_trang_thai
        CHECK (BINARY TrangThai IN ('PLANNED', 'OPEN', 'LOCKED', 'CANCELLED'))
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS CHI_TIET_DIEM_DANH (
    BuoiDiemDanhID INT NOT NULL,
    XepLopID INT NOT NULL,
    TrangThai CHAR(1) NOT NULL,
    GhiChu VARCHAR(500) NULL,
    PRIMARY KEY (BuoiDiemDanhID, XepLopID),
    CONSTRAINT fk_chi_tiet_diem_danh_buoi FOREIGN KEY (BuoiDiemDanhID)
        REFERENCES BUOI_DIEM_DANH (BuoiDiemDanhID) ON DELETE RESTRICT,
    CONSTRAINT fk_chi_tiet_diem_danh_xep_lop FOREIGN KEY (XepLopID)
        REFERENCES XEP_LOP (XepLopID) ON DELETE RESTRICT,
    CONSTRAINT chk_chi_tiet_diem_danh_trang_thai CHECK (BINARY TrangThai IN ('P', 'E', 'U'))
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS NHAT_KY_THAO_TAC (
    NhatKyID BIGINT NOT NULL AUTO_INCREMENT,
    TaiKhoanID INT NOT NULL,
    ThoiDiem DATETIME(3) NOT NULL,
    HanhDong VARCHAR(32) NOT NULL,
    LoaiDoiTuong VARCHAR(32) NOT NULL,
    KhoaDoiTuong VARCHAR(120) NOT NULL,
    DuLieuTruoc JSON NULL,
    DuLieuSau JSON NULL,
    PRIMARY KEY (NhatKyID),
    CONSTRAINT fk_nhat_ky_tai_khoan FOREIGN KEY (TaiKhoanID)
        REFERENCES TAI_KHOAN (TaiKhoanID) ON DELETE RESTRICT
) ENGINE = InnoDB;

INSERT INTO VAI_TRO (MaVaiTro, TenVaiTro)
VALUES ('ADMIN', 'Quản trị viên'), ('GVCN', 'Giáo viên chủ nhiệm')
ON DUPLICATE KEY UPDATE TenVaiTro = VAI_TRO.TenVaiTro;
