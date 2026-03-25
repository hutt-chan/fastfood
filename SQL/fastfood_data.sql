-- ============================================================
-- SEED DATA — FastFood Chain Hà Nội
-- 10 chi nhánh, ~200 bản ghi thực tế
-- ============================================================

USE fastfood_db;
SET FOREIGN_KEY_CHECKS = 0;
SET NAMES utf8mb4;

-- ============================================================
-- 1. NGUOIDUNG — 40 tài khoản
--    password_hash = bcrypt('Password@123')
-- ============================================================
INSERT INTO NguoiDung (user_id, full_name, email, phone, password_hash, role, status, created_at) VALUES
-- System Admin (1)
(1,  'Nguyễn Minh Tuấn',   'admin@fastfood.vn',           '0901000001', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVyMAABBWi', 'admin',          'active', '2024-01-01 08:00:00'),

-- Branch Managers (2-11)
(2,  'Trần Thị Lan',        'manager.hoankiem@fastfood.vn','0901000002', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVyMAABBWi', 'branch_manager', 'active', '2024-01-05 08:00:00'),
(3,  'Lê Văn Hùng',         'manager.dongda@fastfood.vn',  '0901000003', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVyMAABBWi', 'branch_manager', 'active', '2024-01-05 08:00:00'),
(4,  'Phạm Thị Hương',      'manager.bading@fastfood.vn',  '0901000004', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVyMAABBWi', 'branch_manager', 'active', '2024-01-05 08:00:00'),
(5,  'Nguyễn Văn Đức',      'manager.tayho@fastfood.vn',   '0901000005', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVyMAABBWi', 'branch_manager', 'active', '2024-01-05 08:00:00'),
(6,  'Hoàng Thị Mai',       'manager.caugiay@fastfood.vn', '0901000006', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVyMAABBWi', 'branch_manager', 'active', '2024-01-05 08:00:00'),
(7,  'Vũ Minh Khoa',        'manager.thanhxuan@fastfood.vn','0901000007','$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVyMAABBWi', 'branch_manager', 'active', '2024-01-05 08:00:00'),
(8,  'Đặng Thị Thu',        'manager.hadong@fastfood.vn',  '0901000008', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVyMAABBWi', 'branch_manager', 'active', '2024-01-05 08:00:00'),
(9,  'Bùi Quang Vinh',      'manager.longbien@fastfood.vn','0901000009', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVyMAABBWi', 'branch_manager', 'active', '2024-01-05 08:00:00'),
(10, 'Lý Thị Ngọc',         'manager.haibatrung@fastfood.vn','0901000010','$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVyMAABBWi','branch_manager', 'active', '2024-01-05 08:00:00'),
(11, 'Trương Văn Nam',      'manager.hoangmai@fastfood.vn','0901000011', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVyMAABBWi', 'branch_manager', 'active', '2024-01-05 08:00:00'),

-- Kitchen Staff (12-21)
(12, 'Ngô Văn Cường',       'kitchen01@fastfood.vn',       '0902000012', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVyMAABBWi', 'kitchen',        'active', '2024-01-10 08:00:00'),
(13, 'Đinh Thị Hoa',        'kitchen02@fastfood.vn',       '0902000013', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVyMAABBWi', 'kitchen',        'active', '2024-01-10 08:00:00'),
(14, 'Phan Văn Long',        'kitchen03@fastfood.vn',       '0902000014', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVyMAABBWi', 'kitchen',        'active', '2024-01-10 08:00:00'),
(15, 'Trần Minh Đạt',       'kitchen04@fastfood.vn',       '0902000015', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVyMAABBWi', 'kitchen',        'active', '2024-01-10 08:00:00'),
(16, 'Nguyễn Thị Thảo',    'kitchen05@fastfood.vn',       '0902000016', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVyMAABBWi', 'kitchen',        'active', '2024-01-10 08:00:00'),
(17, 'Lê Quốc Bảo',         'kitchen06@fastfood.vn',       '0902000017', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVyMAABBWi', 'kitchen',        'active', '2024-01-10 08:00:00'),
(18, 'Phạm Văn Tú',         'kitchen07@fastfood.vn',       '0902000018', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVyMAABBWi', 'kitchen',        'active', '2024-01-10 08:00:00'),
(19, 'Hoàng Văn Kiên',      'kitchen08@fastfood.vn',       '0902000019', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVyMAABBWi', 'kitchen',        'active', '2024-01-10 08:00:00'),
(20, 'Vũ Thị Linh',         'kitchen09@fastfood.vn',       '0902000020', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVyMAABBWi', 'kitchen',        'active', '2024-01-10 08:00:00'),
(21, 'Đỗ Văn Hải',          'kitchen10@fastfood.vn',       '0902000021', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVyMAABBWi', 'kitchen',        'active', '2024-01-10 08:00:00'),

-- Delivery Staff (22-31)
(22, 'Trần Văn Thắng',      'ship01@fastfood.vn',          '0903000022', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVyMAABBWi', 'delivery',       'active', '2024-01-10 08:00:00'),
(23, 'Nguyễn Đình Phúc',   'ship02@fastfood.vn',          '0903000023', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVyMAABBWi', 'delivery',       'active', '2024-01-10 08:00:00'),
(24, 'Lê Thị Kim Anh',      'ship03@fastfood.vn',          '0903000024', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVyMAABBWi', 'delivery',       'active', '2024-01-10 08:00:00'),
(25, 'Phạm Quang Hải',      'ship04@fastfood.vn',          '0903000025', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVyMAABBWi', 'delivery',       'active', '2024-01-10 08:00:00'),
(26, 'Bùi Thị Nhung',       'ship05@fastfood.vn',          '0903000026', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVyMAABBWi', 'delivery',       'active', '2024-01-10 08:00:00'),
(27, 'Đinh Văn Sơn',        'ship06@fastfood.vn',          '0903000027', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVyMAABBWi', 'delivery',       'active', '2024-01-10 08:00:00'),
(28, 'Ngô Thị Hằng',        'ship07@fastfood.vn',          '0903000028', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVyMAABBWi', 'delivery',       'active', '2024-01-10 08:00:00'),
(29, 'Vũ Văn Lộc',          'ship08@fastfood.vn',          '0903000029', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVyMAABBWi', 'delivery',       'active', '2024-01-10 08:00:00'),
(30, 'Hoàng Minh Tuấn',    'ship09@fastfood.vn',          '0903000030', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVyMAABBWi', 'delivery',       'active', '2024-01-10 08:00:00'),
(31, 'Trần Thị Phương',    'ship10@fastfood.vn',          '0903000031', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVyMAABBWi', 'delivery',       'active', '2024-01-10 08:00:00'),

-- Warehouse Managers (32-41)
(32, 'Nguyễn Văn Khải',     'wh01@fastfood.vn',            '0904000032', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVyMAABBWi', 'warehouse',      'active', '2024-01-10 08:00:00'),
(33, 'Lê Thị Xuân',         'wh02@fastfood.vn',            '0904000033', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVyMAABBWi', 'warehouse',      'active', '2024-01-10 08:00:00'),
(34, 'Phạm Đình Hiếu',      'wh03@fastfood.vn',            '0904000034', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVyMAABBWi', 'warehouse',      'active', '2024-01-10 08:00:00'),
(35, 'Trần Quốc Việt',      'wh04@fastfood.vn',            '0904000035', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVyMAABBWi', 'warehouse',      'active', '2024-01-10 08:00:00'),
(36, 'Ngô Thị Bích',        'wh05@fastfood.vn',            '0904000036', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVyMAABBWi', 'warehouse',      'active', '2024-01-10 08:00:00'),
(37, 'Đinh Văn Quân',       'wh06@fastfood.vn',            '0904000037', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVyMAABBWi', 'warehouse',      'active', '2024-01-10 08:00:00'),
(38, 'Bùi Minh Hiếu',       'wh07@fastfood.vn',            '0904000038', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVyMAABBWi', 'warehouse',      'active', '2024-01-10 08:00:00'),
(39, 'Vũ Thị Hải Yến',     'wh08@fastfood.vn',            '0904000039', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVyMAABBWi', 'warehouse',      'active', '2024-01-10 08:00:00'),
(40, 'Lý Văn Toàn',         'wh09@fastfood.vn',            '0904000040', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVyMAABBWi', 'warehouse',      'active', '2024-01-10 08:00:00'),
(41, 'Phan Thị Dung',       'wh10@fastfood.vn',            '0904000041', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVyMAABBWi', 'warehouse',      'active', '2024-01-10 08:00:00'),

-- Customers (42-61)
(42, 'Nguyễn Thị Bảo Châu','customer01@gmail.com',        '0905000042', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVyMAABBWi', 'customer',       'active', '2024-02-01 10:00:00'),
(43, 'Trần Minh Khoa',      'customer02@gmail.com',        '0905000043', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVyMAABBWi', 'customer',       'active', '2024-02-03 11:00:00'),
(44, 'Lê Thị Thu Hà',       'customer03@gmail.com',        '0905000044', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVyMAABBWi', 'customer',       'active', '2024-02-05 09:30:00'),
(45, 'Phạm Quang Minh',     'customer04@gmail.com',        '0905000045', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVyMAABBWi', 'customer',       'active', '2024-02-10 14:00:00'),
(46, 'Hoàng Thị Lan Anh',  'customer05@gmail.com',        '0905000046', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVyMAABBWi', 'customer',       'active', '2024-02-12 16:00:00'),
(47, 'Vũ Tiến Dũng',        'customer06@gmail.com',        '0905000047', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVyMAABBWi', 'customer',       'active', '2024-02-15 08:30:00'),
(48, 'Đặng Thị Mỹ Linh',   'customer07@gmail.com',        '0905000048', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVyMAABBWi', 'customer',       'active', '2024-02-18 19:00:00'),
(49, 'Ngô Anh Tú',           'customer08@gmail.com',        '0905000049', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVyMAABBWi', 'customer',       'active', '2024-02-20 10:15:00'),
(50, 'Bùi Thị Nguyệt',     'customer09@gmail.com',        '0905000050', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVyMAABBWi', 'customer',       'active', '2024-02-22 12:00:00'),
(51, 'Đinh Quang Huy',      'customer10@gmail.com',        '0905000051', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVyMAABBWi', 'customer',       'active', '2024-03-01 09:00:00'),
(52, 'Trương Thị Khánh',   'customer11@gmail.com',        '0905000052', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVyMAABBWi', 'customer',       'active', '2024-03-05 11:30:00'),
(53, 'Lý Văn Phong',        'customer12@gmail.com',        '0905000053', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVyMAABBWi', 'customer',       'active', '2024-03-08 14:45:00'),
(54, 'Phan Thị Hồng',       'customer13@gmail.com',        '0905000054', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVyMAABBWi', 'customer',       'active', '2024-03-10 17:00:00'),
(55, 'Nguyễn Văn Trường',  'customer14@gmail.com',        '0905000055', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVyMAABBWi', 'customer',       'active', '2024-03-12 08:00:00'),
(56, 'Trần Thị Diệu Linh', 'customer15@gmail.com',        '0905000056', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVyMAABBWi', 'customer',       'active', '2024-03-15 13:00:00'),
(57, 'Lê Hoàng Nam',        'customer16@gmail.com',        '0905000057', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVyMAABBWi', 'customer',       'active', '2024-03-18 20:00:00'),
(58, 'Phạm Thị Quỳnh Như', 'customer17@gmail.com',        '0905000058', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVyMAABBWi', 'customer',       'active', '2024-03-20 09:30:00'),
(59, 'Hoàng Đình Tuấn',    'customer18@gmail.com',        '0905000059', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVyMAABBWi', 'customer',       'active', '2024-03-22 15:00:00'),
(60, 'Vũ Thị Thanh Huyền', 'customer19@gmail.com',        '0905000060', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVyMAABBWi', 'customer',       'active', '2024-03-25 10:00:00'),
(61, 'Đỗ Quang Vinh',       'customer20@gmail.com',        '0905000061', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVyMAABBWi', 'customer',       'active', '2024-03-28 11:00:00');


-- ============================================================
-- 2. CỬA HÀNG — 10 chi nhánh Hà Nội (chưa có manager_id, set sau)
-- ============================================================
INSERT INTO CuaHang (store_id, store_name, address, district, city, latitude, longitude, phone, open_time, close_time, delivery_radius_km, status) VALUES
(1,  'FastFood Hoàn Kiếm',   '15 Đinh Tiên Hoàng, Hàng Bạc',     'Hoàn Kiếm',   'Hà Nội', 21.03048, 105.85497, '024 3825 1001', '07:00:00', '22:30:00', 10.00, 'active'),
(2,  'FastFood Đống Đa',     '78 Tôn Đức Thắng, Ô Chợ Dừa',      'Đống Đa',     'Hà Nội', 21.02300, 105.84100, '024 3825 1002', '07:00:00', '22:30:00', 10.00, 'active'),
(3,  'FastFood Ba Đình',     '22 Đội Cấn, Đội Cấn',               'Ba Đình',     'Hà Nội', 21.03600, 105.83800, '024 3825 1003', '07:00:00', '22:30:00', 10.00, 'active'),
(4,  'FastFood Tây Hồ',      '168 Lạc Long Quân, Nhật Tân',       'Tây Hồ',      'Hà Nội', 21.07500, 105.83500, '024 3825 1004', '07:00:00', '22:00:00', 10.00, 'active'),
(5,  'FastFood Cầu Giấy',    '45 Trần Thái Tông, Dịch Vọng Hậu', 'Cầu Giấy',    'Hà Nội', 21.03200, 105.79800, '024 3825 1005', '07:00:00', '22:30:00', 10.00, 'active'),
(6,  'FastFood Thanh Xuân',  '102 Nguyễn Trãi, Thanh Xuân Trung', 'Thanh Xuân',  'Hà Nội', 20.99500, 105.81700, '024 3825 1006', '07:00:00', '22:30:00', 10.00, 'active'),
(7,  'FastFood Hà Đông',     '55 Quang Trung, Quang Trung',        'Hà Đông',     'Hà Nội', 20.97100, 105.77700, '024 3825 1007', '07:00:00', '22:00:00', 10.00, 'active'),
(8,  'FastFood Long Biên',   '200 Nguyễn Văn Cừ, Bồ Đề',          'Long Biên',   'Hà Nội', 21.04400, 105.87700, '024 3825 1008', '07:00:00', '22:00:00', 10.00, 'active'),
(9,  'FastFood Hai Bà Trưng','30 Bà Triệu, Nguyễn Du',             'Hai Bà Trưng','Hà Nội', 21.01400, 105.85200, '024 3825 1009', '07:00:00', '22:30:00', 10.00, 'active'),
(10, 'FastFood Hoàng Mai',   '89 Trương Định, Tương Mai',           'Hoàng Mai',   'Hà Nội', 20.98300, 105.85900, '024 3825 1010', '07:00:00', '22:00:00', 10.00, 'active');


-- ============================================================
-- 3. NHANVIEN — gán mỗi loại nhân viên vào chi nhánh
-- ============================================================
INSERT INTO NhanVien (employee_id, store_id, position, hire_date, salary, is_available, employee_code) VALUES
-- Branch Managers
(2,  1,  'branch_manager', '2024-01-06', 18000000, TRUE, 'BM-HK-001'),
(3,  2,  'branch_manager', '2024-01-06', 18000000, TRUE, 'BM-DD-001'),
(4,  3,  'branch_manager', '2024-01-06', 18000000, TRUE, 'BM-BD-001'),
(5,  4,  'branch_manager', '2024-01-06', 18000000, TRUE, 'BM-TH-001'),
(6,  5,  'branch_manager', '2024-01-06', 18000000, TRUE, 'BM-CG-001'),
(7,  6,  'branch_manager', '2024-01-06', 18000000, TRUE, 'BM-TX-001'),
(8,  7,  'branch_manager', '2024-01-06', 18000000, TRUE, 'BM-HD-001'),
(9,  8,  'branch_manager', '2024-01-06', 18000000, TRUE, 'BM-LB-001'),
(10, 9,  'branch_manager', '2024-01-06', 18000000, TRUE, 'BM-HBT-001'),
(11, 10, 'branch_manager', '2024-01-06', 18000000, TRUE, 'BM-HM-001'),
-- Kitchen Staff (phân đều 2 người / 5 chi nhánh đầu)
(12, 1,  'kitchen', '2024-01-11', 9000000, TRUE, 'KT-HK-001'),
(13, 2,  'kitchen', '2024-01-11', 9000000, TRUE, 'KT-DD-001'),
(14, 3,  'kitchen', '2024-01-11', 9000000, TRUE, 'KT-BD-001'),
(15, 4,  'kitchen', '2024-01-11', 9000000, TRUE, 'KT-TH-001'),
(16, 5,  'kitchen', '2024-01-11', 9000000, TRUE, 'KT-CG-001'),
(17, 6,  'kitchen', '2024-01-11', 9000000, TRUE, 'KT-TX-001'),
(18, 7,  'kitchen', '2024-01-11', 9000000, TRUE, 'KT-HD-001'),
(19, 8,  'kitchen', '2024-01-11', 9000000, TRUE, 'KT-LB-001'),
(20, 9,  'kitchen', '2024-01-11', 9000000, TRUE, 'KT-HBT-001'),
(21, 10, 'kitchen', '2024-01-11', 9000000, TRUE, 'KT-HM-001'),
-- Delivery Staff
(22, 1,  'delivery', '2024-01-11', 8500000, TRUE, 'DL-HK-001'),
(23, 2,  'delivery', '2024-01-11', 8500000, TRUE, 'DL-DD-001'),
(24, 3,  'delivery', '2024-01-11', 8500000, TRUE, 'DL-BD-001'),
(25, 4,  'delivery', '2024-01-11', 8500000, TRUE, 'DL-TH-001'),
(26, 5,  'delivery', '2024-01-11', 8500000, TRUE, 'DL-CG-001'),
(27, 6,  'delivery', '2024-01-11', 8500000, TRUE, 'DL-TX-001'),
(28, 7,  'delivery', '2024-01-11', 8500000, TRUE, 'DL-HD-001'),
(29, 8,  'delivery', '2024-01-11', 8500000, TRUE, 'DL-LB-001'),
(30, 9,  'delivery', '2024-01-11', 8500000, TRUE, 'DL-HBT-001'),
(31, 10, 'delivery', '2024-01-11', 8500000, TRUE, 'DL-HM-001'),
-- Warehouse
(32, 1,  'warehouse', '2024-01-11', 9500000, TRUE, 'WH-HK-001'),
(33, 2,  'warehouse', '2024-01-11', 9500000, TRUE, 'WH-DD-001'),
(34, 3,  'warehouse', '2024-01-11', 9500000, TRUE, 'WH-BD-001'),
(35, 4,  'warehouse', '2024-01-11', 9500000, TRUE, 'WH-TH-001'),
(36, 5,  'warehouse', '2024-01-11', 9500000, TRUE, 'WH-CG-001'),
(37, 6,  'warehouse', '2024-01-11', 9500000, TRUE, 'WH-TX-001'),
(38, 7,  'warehouse', '2024-01-11', 9500000, TRUE, 'WH-HD-001'),
(39, 8,  'warehouse', '2024-01-11', 9500000, TRUE, 'WH-LB-001'),
(40, 9,  'warehouse', '2024-01-11', 9500000, TRUE, 'WH-HBT-001'),
(41, 10, 'warehouse', '2024-01-11', 9500000, TRUE, 'WH-HM-001');

-- Gán manager_id cho CuaHang
UPDATE CuaHang SET manager_id = 2  WHERE store_id = 1;
UPDATE CuaHang SET manager_id = 3  WHERE store_id = 2;
UPDATE CuaHang SET manager_id = 4  WHERE store_id = 3;
UPDATE CuaHang SET manager_id = 5  WHERE store_id = 4;
UPDATE CuaHang SET manager_id = 6  WHERE store_id = 5;
UPDATE CuaHang SET manager_id = 7  WHERE store_id = 6;
UPDATE CuaHang SET manager_id = 8  WHERE store_id = 7;
UPDATE CuaHang SET manager_id = 9  WHERE store_id = 8;
UPDATE CuaHang SET manager_id = 10 WHERE store_id = 9;
UPDATE CuaHang SET manager_id = 11 WHERE store_id = 10;


-- ============================================================
-- 4. KHACHHANG — profile 20 khách
-- ============================================================
INSERT INTO KhachHang (customer_id, date_of_birth, gender, loyalty_points, membership_tier, registered_at) VALUES
(42, '1995-03-15', 'female', 1250, 'silver',   '2024-02-01 10:00:00'),
(43, '1992-07-22', 'male',   3400, 'gold',     '2024-02-03 11:00:00'),
(44, '1998-11-08', 'female',  320, 'bronze',   '2024-02-05 09:30:00'),
(45, '1990-05-30', 'male',   2100, 'silver',   '2024-02-10 14:00:00'),
(46, '1997-01-17', 'female', 5800, 'platinum', '2024-02-12 16:00:00'),
(47, '1993-09-25', 'male',    780, 'bronze',   '2024-02-15 08:30:00'),
(48, '1999-12-03', 'female', 1600, 'silver',   '2024-02-18 19:00:00'),
(49, '1996-04-19', 'male',   4200, 'gold',     '2024-02-20 10:15:00'),
(50, '1994-08-11', 'female',  150, 'bronze',   '2024-02-22 12:00:00'),
(51, '1991-02-28', 'male',   2900, 'silver',   '2024-03-01 09:00:00'),
(52, '2000-06-14', 'female', 6700, 'platinum', '2024-03-05 11:30:00'),
(53, '1988-10-07', 'male',    430, 'bronze',   '2024-03-08 14:45:00'),
(54, '2001-03-23', 'female', 1900, 'silver',   '2024-03-10 17:00:00'),
(55, '1987-07-16', 'male',   3100, 'gold',     '2024-03-12 08:00:00'),
(56, '1996-11-29', 'female',  880, 'bronze',   '2024-03-15 13:00:00'),
(57, '1993-01-05', 'male',   2400, 'silver',   '2024-03-18 20:00:00'),
(58, '1999-05-20', 'female', 7200, 'platinum', '2024-03-20 09:30:00'),
(59, '1985-09-12', 'male',    560, 'bronze',   '2024-03-22 15:00:00'),
(60, '2002-02-08', 'female', 1150, 'silver',   '2024-03-25 10:00:00'),
(61, '1990-12-31', 'male',   3700, 'gold',     '2024-03-28 11:00:00');


-- ============================================================
-- 5. DANHMUC — 6 danh mục
-- ============================================================
INSERT INTO DanhMuc (category_id, category_name, description, sort_order, is_active) VALUES
(1, 'Burger',        'Các loại bánh burger thơm ngon, nhân đa dạng',           1, TRUE),
(2, 'Gà Rán',        'Gà rán giòn, sốt đặc biệt của FastFood',                2, TRUE),
(3, 'Pizza',         'Pizza đế mỏng kiểu Ý và đế dày kiểu Mỹ',               3, TRUE),
(4, 'Đồ Uống',       'Nước ngọt, trà sữa, nước ép tươi',                      4, TRUE),
(5, 'Khoai Chiên & Phụ', 'Khoai tây chiên, onion rings, mozzarella sticks',   5, TRUE),
(6, 'Tráng Miệng',   'Kem, bánh ngọt, sundae',                                 6, TRUE);


-- ============================================================
-- 6. SANPHAM — 30 sản phẩm
-- ============================================================
INSERT INTO SanPham (product_id, product_name, description, base_price, cost_price, calories, is_active, is_featured, category_id) VALUES
-- Burger (1-8)
(1,  'Classic Beef Burger',    'Thịt bò 100%, rau xà lách, cà chua, sốt đặc biệt',           59000,  22000, 520, TRUE,  TRUE,  1),
(2,  'Double Cheese Burger',   'Hai lớp thịt bò, phô mai cheddar tan chảy',                   79000,  30000, 720, TRUE,  TRUE,  1),
(3,  'Spicy Chicken Burger',   'Gà giòn cay, sốt sriracha, dưa chuột muối',                   65000,  24000, 580, TRUE,  FALSE, 1),
(4,  'BBQ Bacon Burger',       'Thịt bò, thịt xông khói, sốt BBQ đặc trưng',                  85000,  33000, 750, TRUE,  TRUE,  1),
(5,  'Mushroom Swiss Burger',  'Thịt bò, nấm sốt bơ, phô mai Swiss',                          75000,  28000, 640, TRUE,  FALSE, 1),
(6,  'Veggie Burger',          'Bánh patty rau củ, sốt mayo thảo mộc',                        55000,  20000, 420, TRUE,  FALSE, 1),
(7,  'Fish Fillet Burger',     'Cá phi lê giòn, sốt tartar, rau xà lách',                     62000,  23000, 490, TRUE,  FALSE, 1),
(8,  'Tower Mega Burger',      'Ba lớp thịt bò, trứng ốp, bacon, phô mai — siêu to',         119000, 47000, 980, TRUE,  TRUE,  1),

-- Gà rán (9-14)
(9,  'Gà Rán Giòn Cay',       'Gà tươi ướp 24h, áo bột giòn, vị cay nồng',                  45000,  16000, 380, TRUE,  TRUE,  2),
(10, 'Gà Rán Original',       'Công thức bí truyền 11 loại gia vị',                           42000,  15000, 360, TRUE,  FALSE, 2),
(11, 'Gà Rán Phô Mai',        'Gà giòn phủ phô mai cheddar chảy',                            52000,  19000, 430, TRUE,  TRUE,  2),
(12, 'Combo Gà 3 Miếng',      '3 miếng gà rán tùy chọn vị + 1 khoai tây nhỏ',               89000,  34000, 850, TRUE,  TRUE,  2),
(13, 'Cánh Gà Sốt Mật Ong',  '6 cánh gà sốt mật ong tỏi hành',                              69000,  26000, 520, TRUE,  FALSE, 2),
(14, 'Nuggets Gà x10',        '10 miếng gà viên chiên giòn + sốt chấm',                      49000,  18000, 440, TRUE,  TRUE,  2),

-- Pizza (15-19)
(15, 'Pizza Margherita',       'Sốt cà chua, phô mai mozzarella, lá húng quế tươi',           99000,  40000, 680, TRUE,  FALSE, 3),
(16, 'Pizza Pepperoni',        'Sốt cà chua, pepperoni, phô mai mozzarella đôi',              119000, 48000, 820, TRUE,  TRUE,  3),
(17, 'Pizza BBQ Chicken',      'Sốt BBQ, gà nướng, hành tây, ớt chuông',                     129000, 52000, 870, TRUE,  TRUE,  3),
(18, 'Pizza 4 Phô Mai',        'Mozzarella, cheddar, parmesan, gorgonzola',                   139000, 56000, 920, TRUE,  FALSE, 3),
(19, 'Pizza Hải Sản',          'Tôm, mực, thanh cua, sốt kem tỏi',                           149000, 60000, 760, TRUE,  FALSE, 3),

-- Đồ uống (20-24)
(20, 'Pepsi / 7UP / MirindaL', 'Lon 330ml — ghi chú loại khi đặt',                            20000,   6000, 140, TRUE,  FALSE, 4),
(21, 'Trà Sữa Trân Châu',     'Trà sữa truyền thống, trân châu đen, size M',                 35000,  12000, 280, TRUE,  TRUE,  4),
(22, 'Sinh Tố Xoài',           'Xoài tươi xay lạnh, không đường nhân tạo',                   39000,  14000, 210, TRUE,  FALSE, 4),
(23, 'Nước Ép Cam Tươi',      'Cam ép tươi nguyên chất, không thêm đường',                   35000,  12000, 160, TRUE,  FALSE, 4),
(24, 'Cà Phê Sữa Đá',         'Cà phê phin truyền thống + sữa đặc, phục vụ lạnh',           29000,  10000, 180, TRUE,  FALSE, 4),

-- Khoai chiên & phụ (25-27)
(25, 'Khoai Tây Chiên Vừa',   'Khoai tây cắt sợi chiên giòn, muối hồng',                    29000,  10000, 340, TRUE,  TRUE,  5),
(26, 'Onion Rings x8',         '8 vòng hành tây chiên giòn, sốt mayo ớt',                    35000,  12000, 380, TRUE,  FALSE, 5),
(27, 'Mozzarella Sticks x6',  '6 thanh phô mai mozzarella chiên, sốt marinara',              45000,  17000, 420, TRUE,  FALSE, 5),

-- Tráng miệng (28-30)
(28, 'Kem Vani Cone',          'Kem vani mềm mịn, đế bánh giòn',                              19000,   6000, 220, TRUE,  FALSE, 6),
(29, 'Sundae Caramel',         'Kem vanilla, sốt caramel, bánh granola',                       35000,  12000, 380, TRUE,  TRUE,  6),
(30, 'Bánh Muffin Chocolate', 'Bánh muffin mềm, nhân chocolate đậm đà',                       29000,  10000, 310, TRUE,  FALSE, 6);


-- ============================================================
-- 7. THUCDON_CUAHANG — 30 SP × 10 chi nhánh (tất cả active)
--    2 SP bị tắt tại một số chi nhánh để mô phỏng thực tế
-- ============================================================
INSERT INTO ThucDon_CuaHang (store_id, product_id, is_available, price_override)
SELECT s.store_id, p.product_id, TRUE, NULL
FROM CuaHang s CROSS JOIN SanPham p;

-- Tắt Pizza tại chi nhánh nhỏ (Tây Hồ, Hà Đông, Long Biên)
UPDATE ThucDon_CuaHang SET is_available = FALSE WHERE store_id IN (4,7,8) AND product_id IN (15,16,17,18,19);

-- Giá override một số sản phẩm tại chi nhánh sân bay / trung tâm
UPDATE ThucDon_CuaHang SET price_override = 65000 WHERE store_id = 1 AND product_id = 1;
UPDATE ThucDon_CuaHang SET price_override = 89000 WHERE store_id = 1 AND product_id = 2;


-- ============================================================
-- 8. NHAOFCUNGCAP — 5 nhà cung cấp
-- ============================================================
INSERT INTO NhaCungCap (supplier_id, company_name, contact_person, phone, email, address, category, status) VALUES
(1, 'Vissan Food',         'Nguyễn Thị Bích Trâm', '028 3829 1234', 'b2b@vissan.com.vn',      'Quận 6, TP.HCM',           'Thực phẩm',  'active'),
(2, 'C.P. Vietnam',        'Trần Văn Khoa',         '028 3966 5678', 'supply@cpvietnam.vn',    'Long An',                  'Thực phẩm',  'active'),
(3, 'Masan Consumer',      'Lê Thị Phương Anh',     '028 3799 2222', 'trade@masan.com.vn',     'Quận 1, TP.HCM',           'Gia vị',     'active'),
(4, 'Coca-Cola VN',        'Phạm Quang Hùng',       '024 3934 5000', 'b2b@coca-cola.com.vn',   'Khu CN Đồng Nai',          'Đồ uống',    'active'),
(5, 'Bóng Bakery Supply',  'Hoàng Văn Tùng',        '024 6666 7777', 'order@bongbakery.vn',    '12 Bạch Đằng, Hà Nội',     'Bánh mì/bột','active');


-- ============================================================
-- 9. NGUYENLIEU — 20 nguyên liệu
-- ============================================================
INSERT INTO NguyenLieu (ingredient_id, ingredient_name, description, unit, cost_per_unit, supplier_id, is_active) VALUES
(1,  'Thịt bò xay',          'Thịt bò 80% nạc, 20% mỡ, đông lạnh',        'kg',    120000, 1, TRUE),
(2,  'Ức gà tươi',            'Gà công nghiệp, cắt miếng, đông lạnh',       'kg',     70000, 2, TRUE),
(3,  'Cánh gà tươi',          'Cánh gà nguyên, đông lạnh',                  'kg',     65000, 2, TRUE),
(4,  'Bánh mì burger',        'Bánh bao tròn 80g, nướng sơ',                'cái',     4500, 5, TRUE),
(5,  'Phô mai cheddar slice', 'Phô mai lát 20g/lát, nhập khẩu',             'lát',     3500, 3, TRUE),
(6,  'Rau xà lách iceberg',  'Rau tươi, rửa sạch, đóng túi',              'kg',     25000, 3, TRUE),
(7,  'Cà chua tươi',          'Cà chua bi, tươi, đóng kg',                  'kg',     30000, 3, TRUE),
(8,  'Sốt burger đặc biệt',  'Sốt bí truyền FastFood, đóng chai 1L',       'lít',    80000, 3, TRUE),
(9,  'Bột chiên gà',          'Hỗn hợp bột giòn pha sẵn, túi 5kg',         'kg',     45000, 3, TRUE),
(10, 'Khoai tây đông lạnh',  'Khoai tây cắt sợi, đông lạnh IQF',          'kg',     35000, 1, TRUE),
(11, 'Đế pizza 30cm',         'Đế pizza làm sẵn, cấp đông',                 'cái',    15000, 5, TRUE),
(12, 'Sốt cà chua pizza',    'Sốt pizza Ý, đóng hũ 3kg',                  'kg',     50000, 3, TRUE),
(13, 'Phô mai mozzarella',   'Phô mai bào sợi, đóng túi 1kg',             'kg',    160000, 3, TRUE),
(14, 'Pepperoni',             'Xúc xích Ý cay, cắt lát, đóng gói 500g',   'kg',    200000, 1, TRUE),
(15, 'Pepsi lon 330ml',       'Pepsi chính hãng, thùng 24 lon',             'lon',     9000, 4, TRUE),
(16, '7UP lon 330ml',         '7UP chính hãng, thùng 24 lon',               'lon',     9000, 4, TRUE),
(17, 'Sữa đặc Ông Thọ',     'Lon 380g, dùng cho cà phê sữa & tráng miệng','lon',    22000, 3, TRUE),
(18, 'Trứng gà tươi',         'Trứng gà công nghiệp, khay 30 quả',         'quả',     4000, 2, TRUE),
(19, 'Dầu ăn chiên',          'Dầu thực vật chịu nhiệt cao, can 20L',      'lít',    35000, 3, TRUE),
(20, 'Bơ lạt',                'Bơ Anchor không muối, hộp 500g',            'kg',    180000, 3, TRUE);


-- ============================================================
-- 10. SANPHAM_NGUYENLIEU — công thức nguyên liệu
-- ============================================================
INSERT INTO SanPham_NguyenLieu (product_id, ingredient_id, quantity_needed, unit) VALUES
-- Classic Beef Burger (SP1)
(1, 1,  0.150, 'kg'),   -- thịt bò 150g
(1, 4,  1.000, 'cái'),  -- bánh mì
(1, 6,  0.030, 'kg'),   -- rau xà lách
(1, 7,  0.040, 'kg'),   -- cà chua
(1, 8,  0.020, 'lít'),  -- sốt burger
-- Double Cheese Burger (SP2)
(2, 1,  0.300, 'kg'),
(2, 4,  1.000, 'cái'),
(2, 5,  2.000, 'lát'),  -- 2 lát phô mai
(2, 6,  0.030, 'kg'),
(2, 8,  0.025, 'lít'),
-- Spicy Chicken Burger (SP3)
(3, 2,  0.180, 'kg'),
(3, 4,  1.000, 'cái'),
(3, 6,  0.030, 'kg'),
(3, 8,  0.020, 'lít'),
-- Gà Rán Giòn Cay (SP9)
(9, 2,  0.200, 'kg'),
(9, 9,  0.060, 'kg'),   -- bột chiên
(9, 19, 0.050, 'lít'),  -- dầu ăn
-- Gà Rán Original (SP10)
(10, 2,  0.200, 'kg'),
(10, 9,  0.060, 'kg'),
(10, 19, 0.050, 'lít'),
-- Cánh Gà Sốt Mật Ong (SP13)
(13, 3,  0.350, 'kg'),
(13, 19, 0.080, 'lít'),
-- Nuggets Gà x10 (SP14)
(14, 2,  0.200, 'kg'),
(14, 9,  0.080, 'kg'),
(14, 19, 0.060, 'lít'),
-- Pizza Margherita (SP15)
(15, 11, 1.000, 'cái'),
(15, 12, 0.150, 'kg'),
(15, 13, 0.180, 'kg'),
-- Pizza Pepperoni (SP16)
(16, 11, 1.000, 'cái'),
(16, 12, 0.150, 'kg'),
(16, 13, 0.220, 'kg'),
(16, 14, 0.120, 'kg'),
-- Khoai Tây Chiên (SP25)
(25, 10, 0.180, 'kg'),
(25, 19, 0.060, 'lít'),
-- Pepsi/7UP (SP20)
(20, 15, 1.000, 'lon'),
-- Cà Phê Sữa Đá (SP24)
(24, 17, 0.050, 'lon'),  -- sữa đặc ~1/5 lon
-- Kem Vani Cone (SP28)
(28, 20, 0.030, 'kg'),   -- bơ
-- Trứng dùng trong một số burger (SP4 BBQ Bacon)
(4, 1,  0.180, 'kg'),
(4, 4,  1.000, 'cái'),
(4, 5,  1.000, 'lát'),
(4, 18, 1.000, 'quả'),
(4, 8,  0.025, 'lít');


-- ============================================================
-- 11. TONKHO — tồn kho nguyên liệu tại 10 chi nhánh
-- ============================================================
INSERT INTO TonKho (store_id, ingredient_id, quantity_available, unit, min_threshold) VALUES
-- Các nguyên liệu chủ chốt tại tất cả 10 chi nhánh
-- (dùng CROSS JOIN ngắn gọn bằng nhiều INSERT)
(1,1,25.000,'kg',5.000),(2,1,18.000,'kg',5.000),(3,1,22.000,'kg',5.000),(4,1,12.000,'kg',5.000),(5,1,30.000,'kg',5.000),
(6,1,20.000,'kg',5.000),(7,1,15.000,'kg',5.000),(8,1,10.000,'kg',5.000),(9,1,28.000,'kg',5.000),(10,1,16.000,'kg',5.000),
(1,2,20.000,'kg',4.000),(2,2,15.000,'kg',4.000),(3,2,18.000,'kg',4.000),(4,2,25.000,'kg',4.000),(5,2,22.000,'kg',4.000),
(6,2,17.000,'kg',4.000),(7,2,20.000,'kg',4.000),(8,2,12.000,'kg',4.000),(9,2,19.000,'kg',4.000),(10,2,14.000,'kg',4.000),
(1,3,10.000,'kg',3.000),(2,3,8.000,'kg',3.000),(3,3,12.000,'kg',3.000),(4,3,15.000,'kg',3.000),(5,3,9.000,'kg',3.000),
(6,3,11.000,'kg',3.000),(7,3,7.000,'kg',3.000),(8,3,6.000,'kg',3.000),(9,3,13.000,'kg',3.000),(10,3,8.000,'kg',3.000),
(1,4,200.000,'cái',50.000),(2,4,180.000,'cái',50.000),(3,4,220.000,'cái',50.000),(4,4,150.000,'cái',50.000),(5,4,250.000,'cái',50.000),
(6,4,190.000,'cái',50.000),(7,4,160.000,'cái',50.000),(8,4,120.000,'cái',50.000),(9,4,210.000,'cái',50.000),(10,4,170.000,'cái',50.000),
(1,5,300.000,'lát',80.000),(2,5,250.000,'lát',80.000),(3,5,280.000,'lát',80.000),(4,5,200.000,'lát',80.000),(5,5,320.000,'lát',80.000),
(6,5,270.000,'lát',80.000),(7,5,230.000,'lát',80.000),(8,5,180.000,'lát',80.000),(9,5,290.000,'lát',80.000),(10,5,240.000,'lát',80.000),
(1,9,15.000,'kg',3.000),(2,9,12.000,'kg',3.000),(3,9,14.000,'kg',3.000),(4,9,18.000,'kg',3.000),(5,9,16.000,'kg',3.000),
(6,9,13.000,'kg',3.000),(7,9,11.000,'kg',3.000),(8,9,2.500,'kg',3.000),(9,9,15.000,'kg',3.000),(10,9,10.000,'kg',3.000),
(1,10,40.000,'kg',8.000),(2,10,35.000,'kg',8.000),(3,10,38.000,'kg',8.000),(4,10,30.000,'kg',8.000),(5,10,45.000,'kg',8.000),
(6,10,36.000,'kg',8.000),(7,10,32.000,'kg',8.000),(8,10,7.000,'kg',8.000),(9,10,40.000,'kg',8.000),(10,10,34.000,'kg',8.000),
(1,13,8.000,'kg',2.000),(2,13,6.000,'kg',2.000),(3,13,7.000,'kg',2.000),(5,13,9.000,'kg',2.000),(6,13,7.500,'kg',2.000),
(9,13,8.500,'kg',2.000),(10,13,6.500,'kg',2.000),
(1,15,120.000,'lon',30.000),(2,15,100.000,'lon',30.000),(3,15,110.000,'lon',30.000),(4,15,80.000,'lon',30.000),(5,15,150.000,'lon',30.000),
(6,15,105.000,'lon',30.000),(7,15,90.000,'lon',30.000),(8,15,70.000,'lon',30.000),(9,15,115.000,'lon',30.000),(10,15,95.000,'lon',30.000),
(1,19,30.000,'lít',5.000),(2,19,25.000,'lít',5.000),(3,19,28.000,'lít',5.000),(4,19,20.000,'lít',5.000),(5,19,35.000,'lít',5.000),
(6,19,26.000,'lít',5.000),(7,19,22.000,'lít',5.000),(8,19,4.500,'lít',5.000),(9,19,30.000,'lít',5.000),(10,19,23.000,'lít',5.000);
-- Lưu ý: CN8 có bột chiên (9), khoai (10), dầu (19) dưới ngưỡng để test cảnh báo UC36


-- ============================================================
-- 12. DIACHIOGIAO — địa chỉ giao hàng khách
-- ============================================================
INSERT INTO DiaChi (address_id, customer_id, label, full_address, district, city, latitude, longitude, is_default) VALUES
(1,  42, 'Nhà riêng',   '25 Hàng Gai, Hoàn Kiếm',                   'Hoàn Kiếm',    'Hà Nội', 21.03400, 105.85000, TRUE),
(2,  43, 'Nhà riêng',   '12 Phố Huế, Hai Bà Trưng',                 'Hai Bà Trưng', 'Hà Nội', 21.01500, 105.85300, TRUE),
(3,  44, 'Ký túc xá',   'KTX ĐH Bách Khoa, Hai Bà Trưng',           'Hai Bà Trưng', 'Hà Nội', 21.00500, 105.84500, TRUE),
(4,  45, 'Văn phòng',   '72 Trần Hưng Đạo, Hoàn Kiếm',              'Hoàn Kiếm',    'Hà Nội', 21.02500, 105.84700, TRUE),
(5,  46, 'Nhà riêng',   '34 Kim Mã, Ba Đình',                        'Ba Đình',      'Hà Nội', 21.03200, 105.82900, TRUE),
(6,  47, 'Văn phòng',   '156 Cầu Giấy, Cầu Giấy',                   'Cầu Giấy',     'Hà Nội', 21.03100, 105.79600, TRUE),
(7,  48, 'Nhà riêng',   '89 Nguyễn Chí Thanh, Đống Đa',             'Đống Đa',      'Hà Nội', 21.02700, 105.83300, TRUE),
(8,  49, 'Nhà riêng',   '45 Lê Duẩn, Đống Đa',                      'Đống Đa',      'Hà Nội', 21.01900, 105.84100, TRUE),
(9,  50, 'Nhà riêng',   '201 Giải Phóng, Hoàng Mai',                 'Hoàng Mai',    'Hà Nội', 20.98900, 105.84400, TRUE),
(10, 51, 'Văn phòng',   '18 Láng Hạ, Đống Đa',                      'Đống Đa',      'Hà Nội', 21.01800, 105.82600, TRUE),
(11, 52, 'Nhà riêng',   '56 Trần Duy Hưng, Cầu Giấy',               'Cầu Giấy',     'Hà Nội', 21.01400, 105.80200, TRUE),
(12, 53, 'Nhà riêng',   '33 Nguyễn Trãi, Thanh Xuân',               'Thanh Xuân',   'Hà Nội', 20.99800, 105.82000, TRUE),
(13, 54, 'Nhà riêng',   '78 Vũ Trọng Phụng, Thanh Xuân',            'Thanh Xuân',   'Hà Nội', 20.99200, 105.82500, TRUE),
(14, 55, 'Văn phòng',   '15 Nguyễn Xiển, Thanh Xuân',               'Thanh Xuân',   'Hà Nội', 20.98600, 105.82800, TRUE),
(15, 56, 'Nhà riêng',   '120 Khâm Thiên, Đống Đa',                  'Đống Đa',      'Hà Nội', 21.01600, 105.84300, TRUE),
(16, 57, 'Nhà riêng',   '67 Đội Cấn, Ba Đình',                      'Ba Đình',      'Hà Nội', 21.03500, 105.83600, TRUE),
(17, 58, 'Nhà riêng',   '10 Xuân Diệu, Tây Hồ',                     'Tây Hồ',       'Hà Nội', 21.05800, 105.83700, TRUE),
(18, 59, 'Văn phòng',   '44 Long Biên, Long Biên',                   'Long Biên',    'Hà Nội', 21.04200, 105.87900, TRUE),
(19, 60, 'Nhà riêng',   '99 Nguyễn Lương Bằng, Đống Đa',            'Đống Đa',      'Hà Nội', 21.01200, 105.83400, TRUE),
(20, 61, 'Nhà riêng',   '55 Minh Khai, Hai Bà Trưng',               'Hai Bà Trưng', 'Hà Nội', 20.99500, 105.85100, TRUE);

-- Gán default_address_id
UPDATE KhachHang kh JOIN DiaChi dc ON kh.customer_id = dc.customer_id SET kh.default_address_id = dc.address_id WHERE dc.is_default = TRUE;


-- ============================================================
-- 13. DONHANG + CHITIETDONHANG + THANHTOAN + LICHSUTRANGTHAI
--     20 đơn hàng đa dạng trạng thái
-- ============================================================
INSERT INTO DonHang (order_id, order_code, order_time, order_type, status, subtotal, delivery_fee, discount_amount, total_amount, note, customer_id, store_id, delivery_address_id, delivered_at) VALUES
(1,  'FF-20240310-0001','2024-03-10 11:30:00','delivery','delivered',  149000,15000,0,     164000, NULL,                       42,1,1,  '2024-03-10 12:15:00'),
(2,  'FF-20240312-0002','2024-03-12 12:00:00','delivery','delivered',  219000,15000,20000, 214000, 'Ít đá đồ uống',             43,2,2,  '2024-03-12 12:55:00'),
(3,  'FF-20240315-0003','2024-03-15 18:30:00','delivery','delivered',  328000,20000,0,     348000, NULL,                       44,9,3,  '2024-03-15 19:20:00'),
(4,  'FF-20240318-0004','2024-03-18 19:00:00','takeaway','delivered',  124000,0,    0,     124000, NULL,                       45,1,NULL,'2024-03-18 19:25:00'),
(5,  'FF-20240320-0005','2024-03-20 07:45:00','delivery','delivered',   84000,15000,0,      99000, 'Giao trước 8h30',           46,3,5,  '2024-03-20 08:25:00'),
(6,  'FF-20240322-0006','2024-03-22 13:15:00','delivery','delivered',  269000,15000,0,     284000, NULL,                       47,5,6,  '2024-03-22 14:10:00'),
(7,  'FF-20240325-0007','2024-03-25 20:00:00','delivery','delivered',  178000,15000,15000, 178000, 'Không hành trong burger',   48,2,7,  '2024-03-25 20:50:00'),
(8,  'FF-20240328-0008','2024-03-28 11:00:00','dine_in', 'delivered',  312000,0,    0,     312000, 'Bàn số 5',                 49,1,NULL,'2024-03-28 11:45:00'),
(9,  'FF-20240401-0009','2024-04-01 08:00:00','delivery','delivered',   64000,15000,0,      79000, NULL,                       50,10,9, '2024-04-01 08:50:00'),
(10, 'FF-20240403-0010','2024-04-03 12:30:00','delivery','delivered',  198000,15000,0,     213000, NULL,                       51,6,10, '2024-04-03 13:20:00'),
(11, 'FF-20240405-0011','2024-04-05 17:00:00','delivery','delivered',  287000,20000,0,     307000, 'Extra sốt',                52,5,11, '2024-04-05 17:55:00'),
(12, 'FF-20240407-0012','2024-04-07 19:30:00','delivery','cancelled',  155000,15000,0,     170000, NULL,                       53,6,12, NULL),
(13, 'FF-20240410-0013','2024-04-10 11:00:00','delivery','delivered',  243000,15000,25000, 233000, NULL,                       54,9,13, '2024-04-10 11:55:00'),
(14, 'FF-20240412-0014','2024-04-12 13:00:00','delivery','delivered',  119000,15000,0,     134000, NULL,                       55,6,14, '2024-04-12 13:50:00'),
(15, 'FF-20240415-0015','2024-04-15 08:30:00','takeaway','delivered',   88000,0,    0,      88000, NULL,                       56,2,NULL,'2024-04-15 08:55:00'),
(16, 'FF-20240418-0016','2024-04-18 20:00:00','delivery','delivered',  334000,20000,30000, 324000, 'Kèm tương ớt thêm',        57,3,16, '2024-04-18 20:55:00'),
(17, 'FF-20240420-0017','2024-04-20 12:00:00','delivery','delivering', 168000,15000,0,     183000, NULL,                       58,4,17, NULL),
(18, 'FF-20240421-0018','2024-04-21 07:30:00','delivery','preparing',   95000,15000,0,     110000, 'Giao trước 8h',             59,8,18, NULL),
(19, 'FF-20240421-0019','2024-04-21 11:45:00','delivery','confirmed',  147000,15000,0,     162000, NULL,                       60,9,19, NULL),
(20, 'FF-20240421-0020','2024-04-21 12:00:00','delivery','pending',    224000,15000,0,     239000, NULL,                       61,1,20, NULL);

-- Cập nhật cancel_reason cho đơn bị hủy
UPDATE DonHang SET cancel_reason = 'Khách hàng thay đổi ý định', cancelled_at = '2024-04-07 19:45:00' WHERE order_id = 12;

-- Chi tiết đơn hàng
INSERT INTO ChiTietDonHang (order_id, product_id, quantity, unit_price, special_request) VALUES
-- Đơn 1
(1,  1,  1, 65000, NULL),(1,  25, 1, 29000, NULL),(1,  20, 1, 20000, NULL),(1,  28, 1, 19000, NULL),
-- Đơn 2
(2,  16, 1, 119000, NULL),(2,  12, 1, 89000, NULL),(2,  21, 1, 35000, 'Ít đường'),(2,  20, 1, 20000, NULL),
-- Đơn 3
(3,  17, 1, 129000, NULL),(3,  9,  2, 45000, NULL),(3,  25, 1, 29000, NULL),(3,  26, 1, 35000, NULL),(3,  21, 2, 35000, NULL),
-- Đơn 4
(4,  4,  1, 85000, NULL),(4,  2,  1, 79000, NULL),(4,  25, 2, 29000, NULL),(4,  24, 1, 29000, NULL),
-- Đơn 5
(5,  9,  1, 45000, NULL),(5,  25, 1, 29000, NULL),(5,  24, 1, 29000, NULL),
-- Đơn 6
(6,  16, 1, 119000, NULL),(6,  4,  1, 85000, NULL),(6,  26, 1, 35000, NULL),(6,  20, 2, 20000, NULL),
-- Đơn 7
(7,  2,  1, 79000, NULL),(7,  9,  1, 45000, 'Không cay'),(7,  25, 1, 29000, NULL),(7,  21, 1, 35000, NULL),
-- Đơn 8
(8,  8,  1, 119000, NULL),(8,  17, 1, 129000, NULL),(8,  14, 1, 49000, NULL),(8,  21, 2, 35000, NULL),(8,  25, 2, 29000, NULL),
-- Đơn 9
(9,  3,  1, 65000, NULL),(9,  20, 1, 20000, NULL),
-- Đơn 10
(10, 4,  1, 85000, NULL),(10, 16, 1, 119000, NULL),(10, 20, 1, 20000, NULL),(10, 28, 1, 19000, NULL),
-- Đơn 11
(11, 18, 1, 139000, NULL),(11, 12, 1, 89000, NULL),(11, 26, 1, 35000, NULL),(11, 29, 1, 35000, NULL),
-- Đơn 12 (cancelled)
(12, 9,  2, 45000, NULL),(12, 25, 2, 29000, NULL),(12, 20, 1, 20000, NULL),(12, 24, 1, 29000, NULL),
-- Đơn 13
(13, 15, 1, 99000, NULL),(13, 4,  1, 85000, NULL),(13, 25, 1, 29000, NULL),(13, 20, 2, 20000, NULL),
-- Đơn 14
(14, 16, 1, 119000, NULL),(14, 20, 1, 20000, NULL),
-- Đơn 15
(15, 9,  1, 45000, NULL),(15, 25, 1, 29000, NULL),(15, 28, 1, 19000, NULL),
-- Đơn 16
(16, 8,  1, 119000, NULL),(16, 19, 1, 149000, NULL),(16, 21, 2, 35000, NULL),(16, 25, 2, 29000, NULL),
-- Đơn 17
(17, 11, 2, 52000, NULL),(17, 25, 2, 29000, NULL),(17, 20, 2, 20000, NULL),
-- Đơn 18
(18, 3,  1, 65000, NULL),(18, 25, 1, 29000, NULL),(18, 20, 1, 20000, NULL),
-- Đơn 19
(19, 4,  1, 85000, NULL),(19, 12, 1, 89000, NULL),(19, 20, 1, 20000, NULL),
-- Đơn 20
(20, 16, 1, 119000, NULL),(20, 8,  1, 119000, NULL),(20, 25, 2, 29000, NULL),(20, 21, 1, 35000, NULL);

-- Thanh toán
INSERT INTO ThanhToan (payment_id, order_id, method, amount, status, paid_at, transaction_ref) VALUES
(1,  1,  'momo',   164000, 'paid',    '2024-03-10 11:32:00', 'MOMO20240310001'),
(2,  2,  'vnpay',  214000, 'paid',    '2024-03-12 12:02:00', 'VNPAY20240312002'),
(3,  3,  'cod',    348000, 'paid',    '2024-03-15 19:20:00', NULL),
(4,  4,  'cod',    124000, 'paid',    '2024-03-18 19:25:00', NULL),
(5,  5,  'zalopay', 99000, 'paid',    '2024-03-20 07:47:00', 'ZLP20240320005'),
(6,  6,  'momo',   284000, 'paid',    '2024-03-22 13:17:00', 'MOMO20240322006'),
(7,  7,  'vnpay',  178000, 'paid',    '2024-03-25 20:02:00', 'VNPAY20240325007'),
(8,  8,  'cod',    312000, 'paid',    '2024-03-28 11:45:00', NULL),
(9,  9,  'momo',    79000, 'paid',    '2024-04-01 08:02:00', 'MOMO20240401009'),
(10, 10, 'vnpay',  213000, 'paid',    '2024-04-03 12:32:00', 'VNPAY20240403010'),
(11, 11, 'momo',   307000, 'paid',    '2024-04-05 17:02:00', 'MOMO20240405011'),
(12, 12, 'cod',    170000, 'failed',  NULL,                  NULL),
(13, 13, 'zalopay',233000, 'paid',    '2024-04-10 11:02:00', 'ZLP20240410013'),
(14, 14, 'momo',   134000, 'paid',    '2024-04-12 13:02:00', 'MOMO20240412014'),
(15, 15, 'cod',     88000, 'paid',    '2024-04-15 08:55:00', NULL),
(16, 16, 'vnpay',  324000, 'paid',    '2024-04-18 20:02:00', 'VNPAY20240418016'),
(17, 17, 'momo',   183000, 'pending', NULL,                  NULL),
(18, 18, 'cod',    110000, 'pending', NULL,                  NULL),
(19, 19, 'zalopay',162000, 'paid',    '2024-04-21 11:47:00', 'ZLP20240421019'),
(20, 20, 'vnpay',  239000, 'pending', NULL,                  NULL);

-- Lịch sử trạng thái (audit trail đủ cho đơn đã delivered)
INSERT INTO LichSuTrangThai (order_id, old_status, new_status, changed_by, changed_at) VALUES
(1, NULL,'pending',   42,'2024-03-10 11:30:00'),(1,'pending','confirmed', 2,'2024-03-10 11:33:00'),(1,'confirmed','preparing',12,'2024-03-10 11:38:00'),(1,'preparing','ready',   12,'2024-03-10 11:58:00'),(1,'ready','delivering',22,'2024-03-10 12:00:00'),(1,'delivering','delivered',22,'2024-03-10 12:15:00'),
(2, NULL,'pending',   43,'2024-03-12 12:00:00'),(2,'pending','confirmed', 3,'2024-03-12 12:03:00'),(2,'confirmed','preparing',13,'2024-03-12 12:08:00'),(2,'preparing','ready',   13,'2024-03-12 12:30:00'),(2,'ready','delivering',23,'2024-03-12 12:32:00'),(2,'delivering','delivered',23,'2024-03-12 12:55:00'),
(12,NULL,'pending',   53,'2024-04-07 19:30:00'),(12,'pending','cancelled',53,'2024-04-07 19:45:00'),
(17,NULL,'pending',   58,'2024-04-20 12:00:00'),(17,'pending','confirmed', 7,'2024-04-20 12:03:00'),(17,'confirmed','preparing',17,'2024-04-20 12:10:00'),(17,'preparing','ready',17,'2024-04-20 12:40:00'),(17,'ready','delivering',27,'2024-04-20 12:42:00'),
(18,NULL,'pending',   59,'2024-04-21 07:30:00'),(18,'pending','confirmed', 9,'2024-04-21 07:33:00'),(18,'confirmed','preparing',19,'2024-04-21 07:40:00'),
(19,NULL,'pending',   60,'2024-04-21 11:45:00'),(19,'pending','confirmed',10,'2024-04-21 11:48:00'),
(20,NULL,'pending',   61,'2024-04-21 12:00:00');


-- ============================================================
-- 14. PHAN CÔNG GIAO HÀNG
-- ============================================================
INSERT INTO PhanCongGiao (order_id, employee_id, assigned_at, accepted_at, completed_at, status) VALUES
(1,  22, '2024-03-10 12:00:00', '2024-03-10 12:01:00', '2024-03-10 12:15:00', 'completed'),
(2,  23, '2024-03-12 12:32:00', '2024-03-12 12:33:00', '2024-03-12 12:55:00', 'completed'),
(3,  30, '2024-03-15 19:05:00', '2024-03-15 19:06:00', '2024-03-15 19:20:00', 'completed'),
(5,  24, '2024-03-20 08:10:00', '2024-03-20 08:11:00', '2024-03-20 08:25:00', 'completed'),
(6,  26, '2024-03-22 13:50:00', '2024-03-22 13:51:00', '2024-03-22 14:10:00', 'completed'),
(7,  23, '2024-03-25 20:35:00', '2024-03-25 20:36:00', '2024-03-25 20:50:00', 'completed'),
(9,  31, '2024-04-01 08:35:00', '2024-04-01 08:36:00', '2024-04-01 08:50:00', 'completed'),
(10, 27, '2024-04-03 13:05:00', '2024-04-03 13:06:00', '2024-04-03 13:20:00', 'completed'),
(11, 26, '2024-04-05 17:40:00', '2024-04-05 17:41:00', '2024-04-05 17:55:00', 'completed'),
(13, 30, '2024-04-10 11:40:00', '2024-04-10 11:41:00', '2024-04-10 11:55:00', 'completed'),
(14, 27, '2024-04-12 13:35:00', '2024-04-12 13:36:00', '2024-04-12 13:50:00', 'completed'),
(16, 24, '2024-04-18 20:40:00', '2024-04-18 20:41:00', '2024-04-18 20:55:00', 'completed'),
(17, 27, '2024-04-20 12:42:00', '2024-04-20 12:44:00', NULL,                  'delivering');


-- ============================================================
-- 15. ĐÁNH GIÁ — 12 đánh giá
-- ============================================================
INSERT INTO DanhGia (order_id, customer_id, rating, comment, created_at) VALUES
(1,  42, 5, 'Burger ngon, giao hàng nhanh, còn nóng nguyên. Sẽ đặt lại!',            '2024-03-10 13:00:00'),
(2,  43, 4, 'Pizza rất ổn, thịt tươi. Nhưng delivery hơi trễ 10 phút.',             '2024-03-12 14:00:00'),
(3,  44, 5, 'Cực ngon, gà rán giòn tan, sốt đặc biệt hảo hạng.',                    '2024-03-15 20:30:00'),
(5,  46, 5, 'Giao đúng giờ, thức ăn nóng, đóng gói cẩn thận.',                      '2024-03-20 09:00:00'),
(6,  47, 4, 'Pizza ngon, toppings đầy đặn. Khoai tây hơi mềm.',                      '2024-03-22 15:00:00'),
(7,  48, 3, 'Burger được nhưng còn hành dù đã ghi chú. Sẽ phản ánh với quán.',      '2024-03-25 22:00:00'),
(9,  50, 5, 'Đặt buổi sáng giao siêu nhanh, burger ngon như nhà hàng.',              '2024-04-01 09:30:00'),
(10, 51, 4, 'Đồ ăn ngon, bao bì sạch. Phô mai hơi ít so với mô tả.',               '2024-04-03 14:00:00'),
(11, 52, 5, 'Pizza 4 phô mai tuyệt vời! Đây là lần thứ 5 mình đặt.',               '2024-04-05 19:00:00'),
(13, 54, 4, 'Sốt pizza đậm đà, gà rán giòn. Tổng thể rất hài lòng.',               '2024-04-10 13:00:00'),
(14, 55, 5, 'Luôn tin tưởng FastFood — chất lượng đồng đều mọi chi nhánh.',         '2024-04-12 15:00:00'),
(16, 57, 5, 'Burger siêu to và ngon, pizza hải sản đỉnh cao. Xứng đáng 5 sao.',     '2024-04-18 22:00:00');


-- ============================================================
-- 16. PHIẾU NHẬP KHO — 3 phiếu
-- ============================================================
INSERT INTO PhieuNhapKho (receipt_id, store_id, supplier_id, received_by, receipt_date, total_value, note) VALUES
(1, 1, 1, 32, '2024-04-15 08:00:00', 4350000, 'Lô thịt bò & gà tuần 16/2024'),
(2, 5, 2, 36, '2024-04-16 09:00:00', 2800000, 'Gà tươi & cánh gà'),
(3, 8, 3, 39, '2024-04-17 07:30:00', 1950000, 'Bột chiên, khoai tây, dầu ăn');

INSERT INTO ChiTietNhapKho (receipt_id, ingredient_id, quantity, unit, unit_cost, total_cost) VALUES
(1, 1, 20.000, 'kg',  120000, 2400000),
(1, 2, 15.000, 'kg',   70000, 1050000),
(1, 5, 200.000,'lát',   3500,  700000),
(2, 2, 20.000, 'kg',   70000, 1400000),
(2, 3, 15.000, 'kg',   65000,  975000),
(2, 18,100.000,'quả',   4000,  400000),
(3, 9, 10.000, 'kg',   45000,  450000),
(3, 10,30.000, 'kg',   35000, 1050000),
(3, 19,12.000, 'lít',  35000,  420000);


-- ============================================================
-- 17. PHIẾU XUẤT KHO — theo 2 đơn hàng
-- ============================================================
INSERT INTO PhieuXuatKho (export_id, store_id, order_id, exported_by, export_date, reason) VALUES
(1, 1, 1, 32, '2024-03-10 11:35:00', 'Chế biến theo đơn FF-20240310-0001'),
(2, 2, 2, 33, '2024-03-12 12:05:00', 'Chế biến theo đơn FF-20240312-0002');

INSERT INTO ChiTietXuatKho (export_id, ingredient_id, quantity, unit) VALUES
(1, 1,  0.150, 'kg'),(1, 4,  1.000, 'cái'),(1, 6,  0.030, 'kg'),(1, 10, 0.180, 'kg'),(1, 19, 0.060, 'lít'),
(2, 11, 1.000, 'cái'),(2, 12, 0.150, 'kg'),(2, 13, 0.220, 'kg'),(2, 14, 0.120, 'kg'),(2, 2,  0.200, 'kg');


-- ============================================================
-- 18. KIỂM KÊ
-- ============================================================
INSERT INTO KiemKe (stocktake_id, store_id, conducted_by, stocktake_date, status, approved_by, note) VALUES
(1, 1, 32, '2024-04-01', 'approved', 2,  'Kiểm kê định kỳ tháng 4/2024 — CN Hoàn Kiếm'),
(2, 5, 36, '2024-04-01', 'approved', 6,  'Kiểm kê định kỳ tháng 4/2024 — CN Cầu Giấy'),
(3, 8, 39, '2024-04-10', 'draft',    NULL,'Kiểm kê phát hiện chênh lệch dầu ăn');

INSERT INTO ChiTietKiemKe (stocktake_id, ingredient_id, system_qty, actual_qty, note) VALUES
(1, 1,  25.000, 24.800, 'Chênh lệch nhỏ do đổ vỡ'),
(1, 2,  20.000, 20.000, NULL),
(1, 10, 40.000, 39.500, NULL),
(2, 2,  22.000, 22.000, NULL),
(2, 9,  16.000, 15.800, 'Hao hụt tự nhiên'),
(3, 19,  4.500,  3.900, 'Chênh lệch 0.6L — cần điều tra');


-- ============================================================
-- 19. YÊU CẦU NHẬP HÀNG
-- ============================================================
INSERT INTO YeuCauNhapHang (store_id, ingredient_id, supplier_id, qty_needed, unit, note, status, requested_by, approved_by) VALUES
(8, 9,  3, 15.000, 'kg',  'Bột chiên sắp hết, cần nhập gấp', 'approved', 39, 8),
(8, 10, 1, 30.000, 'kg',  'Khoai tây dưới ngưỡng tối thiểu',  'pending',  39, NULL),
(8, 19, 3, 20.000, 'lít', 'Dầu ăn gần hết',                   'ordered',  39, 8);


-- ============================================================
-- 20. THÔNG BÁO — mẫu
-- ============================================================
INSERT INTO ThongBao (user_id, order_id, type, channel, title, body, is_read, sent_at) VALUES
(42, 1,  'order_status', 'push', 'Đơn hàng đã xác nhận',   'Đơn FF-20240310-0001 đã được xác nhận. Đang chuẩn bị!',  TRUE,  '2024-03-10 11:33:00'),
(42, 1,  'order_status', 'push', 'Đơn hàng đang giao',     'Tài xế đang trên đường đến bạn. Chuẩn bị nhận hàng nhé!', TRUE,  '2024-03-10 12:00:00'),
(42, 1,  'order_status', 'push', 'Giao hàng thành công',   'Đơn FF-20240310-0001 đã giao thành công. Ngon miệng nhé!',TRUE,  '2024-03-10 12:15:00'),
(43, 2,  'order_status', 'push', 'Đơn hàng đang giao',     'Tài xế đang giao đơn FF-20240312-0002.',                  TRUE,  '2024-03-12 12:32:00'),
(58, 17, 'order_status', 'push', 'Đơn hàng đang giao',     'Tài xế đang giao đơn FF-20240420-0017.',                  FALSE, '2024-04-20 12:42:00'),
(59, 18, 'order_status', 'push', 'Đơn hàng đã xác nhận',   'Đơn FF-20240421-0018 đã xác nhận, đang chế biến.',        FALSE, '2024-04-21 07:33:00'),
(39, NULL,'low_stock',  'push', 'Cảnh báo hàng sắp hết',  'Bột chiên tại CN Long Biên: còn 2.5kg (ngưỡng 3kg)',      FALSE, '2024-04-21 06:00:00'),
(39, NULL,'low_stock',  'push', 'Cảnh báo hàng sắp hết',  'Dầu ăn tại CN Long Biên: còn 4.5L (ngưỡng 5L)',          FALSE, '2024-04-21 06:00:00'),
(8,  NULL,'low_stock',  'push', 'Cảnh báo hàng sắp hết',  'Khoai tây tại CN Long Biên dưới mức tối thiểu!',         FALSE, '2024-04-21 06:00:00'),
(61, 20, 'order_status', 'push', 'Đơn hàng đang chờ xử lý','Đơn FF-20240421-0020 đang chờ xác nhận.',                FALSE, '2024-04-21 12:00:00');


-- ============================================================
-- 21. CẤU HÌNH HỆ THỐNG (cập nhật)
-- ============================================================
UPDATE CauHinhHeThong SET config_value = '15000', updated_by = 1 WHERE config_key = 'delivery_fee_base';
UPDATE CauHinhHeThong SET config_value = '3000',  updated_by = 1 WHERE config_key = 'delivery_fee_per_km';
UPDATE CauHinhHeThong SET config_value = '10',    updated_by = 1 WHERE config_key = 'max_delivery_radius_km';


SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- VERIFY
-- ============================================================
SELECT 'NguoiDung'       AS bang, COUNT(*) AS so_ban_ghi FROM NguoiDung
UNION ALL SELECT 'CuaHang',        COUNT(*) FROM CuaHang
UNION ALL SELECT 'NhanVien',       COUNT(*) FROM NhanVien
UNION ALL SELECT 'KhachHang',      COUNT(*) FROM KhachHang
UNION ALL SELECT 'SanPham',        COUNT(*) FROM SanPham
UNION ALL SELECT 'DonHang',        COUNT(*) FROM DonHang
UNION ALL SELECT 'ChiTietDonHang', COUNT(*) FROM ChiTietDonHang
UNION ALL SELECT 'ThanhToan',      COUNT(*) FROM ThanhToan
UNION ALL SELECT 'LichSuTrangThai',COUNT(*) FROM LichSuTrangThai
UNION ALL SELECT 'TonKho',         COUNT(*) FROM TonKho
UNION ALL SELECT 'PhieuNhapKho',   COUNT(*) FROM PhieuNhapKho
UNION ALL SELECT 'DanhGia',        COUNT(*) FROM DanhGia
UNION ALL SELECT 'ThongBao',       COUNT(*) FROM ThongBao;