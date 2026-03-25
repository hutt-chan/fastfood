-- ============================================================
-- HỆ THỐNG TMĐT CHUỖI CỬA HÀNG ĐỒ ĂN NHANH
-- Database Schema — Dựa trên 39 Use Cases / 27 Entities
-- MySQL 8.0+
-- ============================================================

CREATE DATABASE IF NOT EXISTS fastfood_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE fastfood_db;

SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================
-- MODULE 1: NGƯỜI DÙNG & XÁC THỰC
-- ============================================================

CREATE TABLE NguoiDung (
    user_id       INT            NOT NULL AUTO_INCREMENT,
    email         VARCHAR(150)   NOT NULL,
    phone         VARCHAR(15)    NOT NULL,
    password_hash VARCHAR(255)   NOT NULL,
    full_name     VARCHAR(100)   NOT NULL,
    role          ENUM('customer','branch_manager','kitchen',
                       'delivery','admin','warehouse') NOT NULL,
    status        ENUM('active','locked','pending_verify')
                                 NOT NULL DEFAULT 'pending_verify',
    avatar_url    VARCHAR(500)   NULL,
    last_login    DATETIME       NULL,
    created_at    DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP
                                 ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (user_id),
    UNIQUE KEY uq_email  (email),
    UNIQUE KEY uq_phone  (phone),
    INDEX idx_role       (role),
    INDEX idx_status     (status)
) ENGINE=InnoDB COMMENT='UC1,2,25 — Tài khoản trung tâm cho mọi loại user';


CREATE TABLE KhachHang (
    customer_id        INT  NOT NULL,          -- shared PK = NguoiDung.user_id
    date_of_birth      DATE NULL,
    gender             ENUM('male','female','other') NULL,
    loyalty_points     INT  NOT NULL DEFAULT 0,
    membership_tier    ENUM('bronze','silver','gold','platinum')
                            NOT NULL DEFAULT 'bronze',
    default_address_id INT  NULL,              -- FK → DiaChi (set sau)
    registered_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (customer_id),
    CONSTRAINT fk_kh_user
        FOREIGN KEY (customer_id) REFERENCES NguoiDung(user_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_tier (membership_tier)
) ENGINE=InnoDB COMMENT='UC1,11,12 — Thông tin mở rộng của khách hàng';


CREATE TABLE VaiTro (
    role_id     INT          NOT NULL AUTO_INCREMENT,
    role_name   VARCHAR(50)  NOT NULL,
    description TEXT         NULL,

    PRIMARY KEY (role_id),
    UNIQUE KEY uq_role_name (role_name)
) ENGINE=InnoDB COMMENT='UC25 — Bảng mô tả vai trò (tham chiếu)';

INSERT INTO VaiTro (role_name, description) VALUES
    ('customer',        'Khách hàng đặt hàng qua app'),
    ('branch_manager',  'Quản lý chi nhánh'),
    ('kitchen',         'Nhân viên bếp'),
    ('delivery',        'Nhân viên giao hàng'),
    ('admin',           'Quản trị viên hệ thống'),
    ('warehouse',       'Quản lý kho');


-- ============================================================
-- MODULE 2: CỬA HÀNG & CHI NHÁNH
-- ============================================================

CREATE TABLE CuaHang (
    store_id            INT             NOT NULL AUTO_INCREMENT,
    store_name          VARCHAR(100)    NOT NULL,
    address             VARCHAR(255)    NOT NULL,
    district            VARCHAR(100)    NULL,
    city                VARCHAR(100)    NOT NULL,
    latitude            DECIMAL(10,8)   NULL  COMMENT 'UC4 — tính khoảng cách gần nhất',
    longitude           DECIMAL(11,8)   NULL,
    phone               VARCHAR(15)     NULL,
    open_time           TIME            NOT NULL DEFAULT '07:00:00',
    close_time          TIME            NOT NULL DEFAULT '22:00:00',
    delivery_radius_km  DECIMAL(5,2)    NOT NULL DEFAULT 5.00
                                        COMMENT 'UC28 — bán kính giao hàng',
    status              ENUM('active','closed','renovating')
                                        NOT NULL DEFAULT 'active',
    manager_id          INT             NULL  COMMENT 'FK → NhanVien',
    created_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP
                                        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (store_id),
    INDEX idx_status   (status),
    INDEX idx_city     (city),
    INDEX idx_location (latitude, longitude)
) ENGINE=InnoDB COMMENT='UC4,13-18,24 — Thông tin chi nhánh';


CREATE TABLE NhanVien (
    employee_id     INT             NOT NULL,   -- shared PK = NguoiDung.user_id
    store_id        INT             NOT NULL,
    position        ENUM('branch_manager','kitchen',
                         'delivery','warehouse') NOT NULL,
    hire_date       DATE            NOT NULL,
    salary          DECIMAL(10,2)   NOT NULL DEFAULT 0.00,
    is_available    BOOLEAN         NOT NULL DEFAULT TRUE
                                    COMMENT 'UC18,21 — sẵn sàng nhận đơn',
    employee_code   VARCHAR(20)     NOT NULL,
    updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP
                                    ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (employee_id),
    UNIQUE KEY uq_emp_code (employee_code),
    CONSTRAINT fk_nv_user
        FOREIGN KEY (employee_id) REFERENCES NguoiDung(user_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_nv_store
        FOREIGN KEY (store_id) REFERENCES CuaHang(store_id)
        ON UPDATE CASCADE,
    INDEX idx_store_pos (store_id, position),
    INDEX idx_available (is_available)
) ENGINE=InnoDB COMMENT='UC16,19-23 — Nhân viên bếp / giao hàng / quản lý';


-- Thêm FK manager_id vào CuaHang (sau khi NhanVien đã tồn tại)
ALTER TABLE CuaHang
    ADD CONSTRAINT fk_ch_manager
        FOREIGN KEY (manager_id) REFERENCES NhanVien(employee_id)
        ON DELETE SET NULL ON UPDATE CASCADE;


-- ============================================================
-- MODULE 3: SẢN PHẨM & THỰC ĐƠN
-- ============================================================

CREATE TABLE DanhMuc (
    category_id   INT           NOT NULL AUTO_INCREMENT,
    category_name VARCHAR(100)  NOT NULL,
    description   TEXT          NULL,
    image_url     VARCHAR(500)  NULL,
    sort_order    INT           NOT NULL DEFAULT 0,
    is_active     BOOLEAN       NOT NULL DEFAULT TRUE,
    created_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (category_id),
    UNIQUE KEY uq_cat_name (category_name),
    INDEX idx_active (is_active)
) ENGINE=InnoDB COMMENT='UC3,26 — Phân loại sản phẩm (Burger, Drink...)';


CREATE TABLE SanPham (
    product_id    INT             NOT NULL AUTO_INCREMENT,
    product_name  VARCHAR(150)    NOT NULL,
    description   TEXT            NULL,
    base_price    DECIMAL(10,2)   NOT NULL  COMMENT 'Giá chuẩn toàn chuỗi',
    cost_price    DECIMAL(10,2)   NULL      COMMENT 'Giá vốn (tính lợi nhuận)',
    image_url     VARCHAR(500)    NULL,
    calories      INT             NULL,
    is_active     BOOLEAN         NOT NULL DEFAULT TRUE,
    is_featured   BOOLEAN         NOT NULL DEFAULT FALSE,
    category_id   INT             NOT NULL,
    created_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP
                                  ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (product_id),
    CONSTRAINT fk_sp_category
        FOREIGN KEY (category_id) REFERENCES DanhMuc(category_id)
        ON UPDATE CASCADE,
    INDEX idx_category  (category_id),
    INDEX idx_active    (is_active),
    INDEX idx_featured  (is_featured),
    FULLTEXT INDEX ft_search (product_name, description)
                              COMMENT 'UC3 — tìm kiếm full-text'
) ENGINE=InnoDB COMMENT='UC3,15,26 — Catalog sản phẩm chuẩn toàn chuỗi';


-- Bảng trung gian M:N: SanPham ↔ CuaHang
CREATE TABLE ThucDon_CuaHang (
    store_id        INT             NOT NULL,
    product_id      INT             NOT NULL,
    is_available    BOOLEAN         NOT NULL DEFAULT TRUE
                                    COMMENT 'UC15 — BM bật/tắt món',
    price_override  DECIMAL(10,2)   NULL
                                    COMMENT 'NULL = dùng base_price của SanPham',
    updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP
                                    ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (store_id, product_id),
    CONSTRAINT fk_td_store
        FOREIGN KEY (store_id) REFERENCES CuaHang(store_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_td_product
        FOREIGN KEY (product_id) REFERENCES SanPham(product_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_available (store_id, is_available)
) ENGINE=InnoDB COMMENT='UC15 — Thực đơn riêng từng chi nhánh (giá override, bật/tắt)';


-- ============================================================
-- MODULE 4: ĐẶT HÀNG
-- ============================================================

CREATE TABLE DiaChi (
    address_id    INT           NOT NULL AUTO_INCREMENT,
    customer_id   INT           NOT NULL,
    label         VARCHAR(50)   NULL     COMMENT 'Nhà, Văn phòng...',
    full_address  VARCHAR(255)  NOT NULL,
    district      VARCHAR(100)  NULL,
    city          VARCHAR(100)  NOT NULL,
    latitude      DECIMAL(10,8) NULL,
    longitude     DECIMAL(11,8) NULL,
    is_default    BOOLEAN       NOT NULL DEFAULT FALSE,
    created_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (address_id),
    CONSTRAINT fk_dc_customer
        FOREIGN KEY (customer_id) REFERENCES KhachHang(customer_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_customer (customer_id)
) ENGINE=InnoDB COMMENT='UC6 — Địa chỉ giao hàng đã lưu của khách';


-- Thêm FK default_address_id vào KhachHang (sau khi DiaChi tồn tại)
ALTER TABLE KhachHang
    ADD CONSTRAINT fk_kh_address
        FOREIGN KEY (default_address_id) REFERENCES DiaChi(address_id)
        ON DELETE SET NULL ON UPDATE CASCADE;


CREATE TABLE GioHang (
    cart_id     INT      NOT NULL AUTO_INCREMENT,
    customer_id INT      NOT NULL,
    store_id    INT      NOT NULL,
    created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
                         ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (cart_id),
    UNIQUE KEY uq_customer_cart (customer_id)
               COMMENT '1 khách chỉ có 1 giỏ hàng active',
    CONSTRAINT fk_gh_customer
        FOREIGN KEY (customer_id) REFERENCES KhachHang(customer_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_gh_store
        FOREIGN KEY (store_id) REFERENCES CuaHang(store_id)
        ON UPDATE CASCADE
) ENGINE=InnoDB COMMENT='UC5 — Giỏ hàng tạm của khách';


CREATE TABLE ChiTietGioHang (
    cart_item_id INT      NOT NULL AUTO_INCREMENT,
    cart_id      INT      NOT NULL,
    product_id   INT      NOT NULL,
    quantity     INT      NOT NULL DEFAULT 1 CHECK (quantity > 0),
    note         TEXT     NULL,
    added_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (cart_item_id),
    UNIQUE KEY uq_cart_product (cart_id, product_id),
    CONSTRAINT fk_ctgh_cart
        FOREIGN KEY (cart_id) REFERENCES GioHang(cart_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_ctgh_product
        FOREIGN KEY (product_id) REFERENCES SanPham(product_id)
        ON UPDATE CASCADE
) ENGINE=InnoDB COMMENT='UC5 — Chi tiết giỏ hàng';


CREATE TABLE DonHang (
    order_id             INT             NOT NULL AUTO_INCREMENT,
    order_code           VARCHAR(20)     NOT NULL
                                         COMMENT 'VD: FF-20241201-001',
    order_time           DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    order_type           ENUM('dine_in','takeaway','delivery')
                                         NOT NULL DEFAULT 'delivery',
    status               ENUM('pending','confirmed','preparing',
                              'ready','delivering','delivered','cancelled')
                                         NOT NULL DEFAULT 'pending'
                                         COMMENT 'UC9,14,22 — vòng đời đơn hàng',
    subtotal             DECIMAL(10,2)   NOT NULL DEFAULT 0.00,
    delivery_fee         DECIMAL(10,2)   NOT NULL DEFAULT 0.00
                                         COMMENT 'UC28 — lấy từ cấu hình',
    discount_amount      DECIMAL(10,2)   NOT NULL DEFAULT 0.00,
    total_amount         DECIMAL(10,2)   NOT NULL DEFAULT 0.00,
    note                 TEXT            NULL,
    cancel_reason        TEXT            NULL     COMMENT 'UC10',
    cancelled_at         DATETIME        NULL,
    delivered_at         DATETIME        NULL     COMMENT 'UC23',
    customer_id          INT             NULL     COMMENT 'NULL = khách vãng lai',
    store_id             INT             NOT NULL,
    delivery_address_id  INT             NULL,
    created_at           DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at           DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP
                                         ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (order_id),
    UNIQUE KEY uq_order_code (order_code),
    CONSTRAINT fk_dh_customer
        FOREIGN KEY (customer_id) REFERENCES KhachHang(customer_id)
        ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_dh_store
        FOREIGN KEY (store_id) REFERENCES CuaHang(store_id)
        ON UPDATE CASCADE,
    CONSTRAINT fk_dh_address
        FOREIGN KEY (delivery_address_id) REFERENCES DiaChi(address_id)
        ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX idx_customer   (customer_id),
    INDEX idx_store      (store_id),
    INDEX idx_status     (status),
    INDEX idx_order_time (order_time)
) ENGINE=InnoDB COMMENT='UC6,9,10,13,14,19-23 — Entity trung tâm của hệ thống';


CREATE TABLE ChiTietDonHang (
    item_id         INT             NOT NULL AUTO_INCREMENT,
    order_id        INT             NOT NULL,
    product_id      INT             NOT NULL,
    quantity        INT             NOT NULL CHECK (quantity > 0),
    unit_price      DECIMAL(10,2)   NOT NULL
                                    COMMENT 'Giá tại thời điểm đặt — không bị ảnh hưởng khi SP đổi giá',
    subtotal        DECIMAL(10,2)   NOT NULL
                                    COMMENT '= quantity * unit_price',
    special_request TEXT            NULL
                                    COMMENT 'UC6 — ít muối, không hành...',

    PRIMARY KEY (item_id),
    CONSTRAINT fk_ctdh_order
        FOREIGN KEY (order_id) REFERENCES DonHang(order_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_ctdh_product
        FOREIGN KEY (product_id) REFERENCES SanPham(product_id)
        ON UPDATE CASCADE,
    INDEX idx_order   (order_id),
    INDEX idx_product (product_id)
) ENGINE=InnoDB COMMENT='UC6 — Dòng chi tiết trong đơn hàng (entity yếu)';


-- ============================================================
-- MODULE 5: THANH TOÁN
-- ============================================================

CREATE TABLE ThanhToan (
    payment_id       INT             NOT NULL AUTO_INCREMENT,
    order_id         INT             NOT NULL,
    method           ENUM('cod','vnpay','momo','zalopay')
                                     NOT NULL COMMENT 'UC7,8',
    amount           DECIMAL(10,2)   NOT NULL,
    status           ENUM('pending','paid','failed','refunded')
                                     NOT NULL DEFAULT 'pending',
    paid_at          DATETIME        NULL,
    transaction_ref  VARCHAR(100)    NULL
                                     COMMENT 'UC30 — mã từ cổng thanh toán',
    created_at       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP
                                     ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (payment_id),
    UNIQUE KEY uq_order_payment (order_id)
               COMMENT '1 đơn chỉ có 1 bản ghi thanh toán',
    CONSTRAINT fk_tt_order
        FOREIGN KEY (order_id) REFERENCES DonHang(order_id)
        ON UPDATE CASCADE,
    INDEX idx_status (status),
    INDEX idx_method (method)
) ENGINE=InnoDB COMMENT='UC7,8 — Thông tin thanh toán (1:1 với DonHang)';


CREATE TABLE GiaoDich (
    transaction_id          INT             NOT NULL AUTO_INCREMENT,
    payment_id              INT             NOT NULL,
    gateway                 ENUM('vnpay','momo','zalopay')
                                            NOT NULL,
    amount                  DECIMAL(10,2)   NOT NULL,
    status                  ENUM('success','failed','timeout','pending')
                                            NOT NULL DEFAULT 'pending',
    gateway_transaction_id  VARCHAR(100)    NULL
                                            COMMENT 'UC30 — mã phía cổng TT',
    request_payload         JSON            NULL,
    response_payload        JSON            NULL    COMMENT 'UC30 — phản hồi cổng TT',
    created_at              DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (transaction_id),
    CONSTRAINT fk_gd_payment
        FOREIGN KEY (payment_id) REFERENCES ThanhToan(payment_id)
        ON UPDATE CASCADE,
    INDEX idx_payment (payment_id),
    INDEX idx_status  (status)
) ENGINE=InnoDB COMMENT='UC8,29,30 — Log từng lần gọi cổng thanh toán (retry → nhiều rows)';


-- ============================================================
-- MODULE 6: VẬN HÀNH ĐƠN HÀNG
-- ============================================================

CREATE TABLE LichSuTrangThai (
    history_id  INT     NOT NULL AUTO_INCREMENT,
    order_id    INT     NOT NULL,
    old_status  ENUM('pending','confirmed','preparing',
                     'ready','delivering','delivered','cancelled') NULL,
    new_status  ENUM('pending','confirmed','preparing',
                     'ready','delivering','delivered','cancelled') NOT NULL,
    changed_by  INT     NOT NULL  COMMENT 'FK → NguoiDung',
    changed_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    note        TEXT    NULL,

    PRIMARY KEY (history_id),
    CONSTRAINT fk_ls_order
        FOREIGN KEY (order_id) REFERENCES DonHang(order_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_ls_user
        FOREIGN KEY (changed_by) REFERENCES NguoiDung(user_id)
        ON UPDATE CASCADE,
    INDEX idx_order      (order_id),
    INDEX idx_changed_at (changed_at)
) ENGINE=InnoDB COMMENT='UC9,14,22 — Mỗi lần đổi status = 1 bản ghi (audit trail)';


CREATE TABLE PhanCongGiao (
    assignment_id  INT      NOT NULL AUTO_INCREMENT,
    order_id       INT      NOT NULL,
    employee_id    INT      NOT NULL,
    assigned_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    accepted_at    DATETIME NULL     COMMENT 'UC21 — nhân viên xác nhận nhận đơn',
    completed_at   DATETIME NULL     COMMENT 'UC23 — xác nhận giao thành công',
    status         ENUM('assigned','accepted','delivering','completed','cancelled')
                            NOT NULL DEFAULT 'assigned',

    PRIMARY KEY (assignment_id),
    UNIQUE KEY uq_order_assign (order_id)
               COMMENT '1 đơn chỉ được phân công 1 lần',
    CONSTRAINT fk_pcg_order
        FOREIGN KEY (order_id) REFERENCES DonHang(order_id)
        ON UPDATE CASCADE,
    CONSTRAINT fk_pcg_employee
        FOREIGN KEY (employee_id) REFERENCES NhanVien(employee_id)
        ON UPDATE CASCADE,
    INDEX idx_employee (employee_id),
    INDEX idx_status   (status)
) ENGINE=InnoDB COMMENT='UC18,21-23 — Phân công giao hàng cho nhân viên';


CREATE TABLE DanhGia (
    review_id   INT      NOT NULL AUTO_INCREMENT,
    order_id    INT      NOT NULL,
    customer_id INT      NOT NULL,
    rating      TINYINT  NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment     TEXT     NULL,
    created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (review_id),
    UNIQUE KEY uq_order_review (order_id)
               COMMENT 'UC11 — 1 đơn chỉ được đánh giá 1 lần',
    CONSTRAINT fk_dg_order
        FOREIGN KEY (order_id) REFERENCES DonHang(order_id)
        ON UPDATE CASCADE,
    CONSTRAINT fk_dg_customer
        FOREIGN KEY (customer_id) REFERENCES KhachHang(customer_id)
        ON UPDATE CASCADE,
    INDEX idx_customer (customer_id),
    INDEX idx_rating   (rating)
) ENGINE=InnoDB COMMENT='UC11 — Đánh giá sau khi giao hàng thành công';


-- ============================================================
-- MODULE 7: THÔNG BÁO
-- ============================================================

CREATE TABLE ThongBao (
    notification_id  INT      NOT NULL AUTO_INCREMENT,
    user_id          INT      NOT NULL,
    order_id         INT      NULL,
    type             ENUM('order_status','new_order_alert',
                          'low_stock','system') NOT NULL
                              COMMENT 'UC31 — trạng thái đơn; UC32 — đơn mới; UC36 — kho',
    channel          ENUM('push','sms','email')  NOT NULL DEFAULT 'push',
    title            VARCHAR(200) NOT NULL,
    body             TEXT         NOT NULL,
    is_read          BOOLEAN      NOT NULL DEFAULT FALSE,
    sent_at          DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (notification_id),
    CONSTRAINT fk_tb_user
        FOREIGN KEY (user_id) REFERENCES NguoiDung(user_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_tb_order
        FOREIGN KEY (order_id) REFERENCES DonHang(order_id)
        ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX idx_user    (user_id, is_read),
    INDEX idx_sent_at (sent_at)
) ENGINE=InnoDB COMMENT='UC31,32 — Log push/SMS/email gửi đến user';


-- ============================================================
-- MODULE 8: KHO & NGUYÊN LIỆU
-- ============================================================

CREATE TABLE NhaCungCap (
    supplier_id      INT           NOT NULL AUTO_INCREMENT,
    company_name     VARCHAR(150)  NOT NULL,
    contact_person   VARCHAR(100)  NULL,
    phone            VARCHAR(15)   NOT NULL,
    email            VARCHAR(150)  NULL,
    address          VARCHAR(255)  NULL,
    category         VARCHAR(100)  NULL  COMMENT 'Thực phẩm / Đồ dùng / Thiết bị',
    status           ENUM('active','inactive') NOT NULL DEFAULT 'active',
    created_at       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (supplier_id),
    INDEX idx_status (status)
) ENGINE=InnoDB COMMENT='UC34,39 — Nhà cung cấp nguyên liệu';


CREATE TABLE NguyenLieu (
    ingredient_id  INT             NOT NULL AUTO_INCREMENT,
    ingredient_name VARCHAR(150)   NOT NULL,
    description    TEXT            NULL,
    unit           VARCHAR(20)     NOT NULL COMMENT 'kg, lít, cái, hộp...',
    cost_per_unit  DECIMAL(10,2)   NOT NULL DEFAULT 0.00,
    supplier_id    INT             NULL,
    is_active      BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at     DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (ingredient_id),
    CONSTRAINT fk_nl_supplier
        FOREIGN KEY (supplier_id) REFERENCES NhaCungCap(supplier_id)
        ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX idx_supplier (supplier_id),
    INDEX idx_active   (is_active)
) ENGINE=InnoDB COMMENT='UC33-39 — Danh mục nguyên liệu';


-- Bảng trung gian M:N: SanPham ↔ NguyenLieu
CREATE TABLE SanPham_NguyenLieu (
    product_id      INT             NOT NULL,
    ingredient_id   INT             NOT NULL,
    quantity_needed DECIMAL(10,3)   NOT NULL  COMMENT 'Số lượng NL để làm 1 đơn vị SP',
    unit            VARCHAR(20)     NOT NULL,

    PRIMARY KEY (product_id, ingredient_id),
    CONSTRAINT fk_spnl_product
        FOREIGN KEY (product_id) REFERENCES SanPham(product_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_spnl_ingredient
        FOREIGN KEY (ingredient_id) REFERENCES NguyenLieu(ingredient_id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB COMMENT='UC35 — Công thức: SP cần nguyên liệu nào, bao nhiêu';


CREATE TABLE TonKho (
    inventory_id        INT             NOT NULL AUTO_INCREMENT,
    store_id            INT             NOT NULL,
    ingredient_id       INT             NOT NULL,
    quantity_available  DECIMAL(10,3)   NOT NULL DEFAULT 0.000,
    unit                VARCHAR(20)     NOT NULL,
    min_threshold       DECIMAL(10,3)   NOT NULL DEFAULT 0.000
                                        COMMENT 'UC36 — ngưỡng cảnh báo hết hàng',
    last_updated        DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP
                                        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (inventory_id),
    UNIQUE KEY uq_store_ingredient (store_id, ingredient_id),
    CONSTRAINT fk_tk_store
        FOREIGN KEY (store_id) REFERENCES CuaHang(store_id)
        ON UPDATE CASCADE,
    CONSTRAINT fk_tk_ingredient
        FOREIGN KEY (ingredient_id) REFERENCES NguyenLieu(ingredient_id)
        ON UPDATE CASCADE,
    INDEX idx_low_stock (store_id, quantity_available)
) ENGINE=InnoDB COMMENT='UC33-36 — Tồn kho nguyên liệu tại từng chi nhánh';


CREATE TABLE YeuCauNhapHang (
    request_id      INT             NOT NULL AUTO_INCREMENT,
    store_id        INT             NOT NULL,
    ingredient_id   INT             NOT NULL,
    supplier_id     INT             NOT NULL,
    qty_needed      DECIMAL(10,3)   NOT NULL,
    unit            VARCHAR(20)     NOT NULL,
    note            TEXT            NULL,
    status          ENUM('pending','approved','rejected','ordered')
                                    NOT NULL DEFAULT 'pending'
                                    COMMENT 'UC39 — phê duyệt từ BM hoặc Admin',
    requested_by    INT             NOT NULL  COMMENT 'FK → NhanVien (warehouse)',
    approved_by     INT             NULL      COMMENT 'FK → NguoiDung (BM/Admin)',
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP
                                    ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (request_id),
    CONSTRAINT fk_ycnh_store
        FOREIGN KEY (store_id) REFERENCES CuaHang(store_id)
        ON UPDATE CASCADE,
    CONSTRAINT fk_ycnh_ingredient
        FOREIGN KEY (ingredient_id) REFERENCES NguyenLieu(ingredient_id)
        ON UPDATE CASCADE,
    CONSTRAINT fk_ycnh_supplier
        FOREIGN KEY (supplier_id) REFERENCES NhaCungCap(supplier_id)
        ON UPDATE CASCADE,
    CONSTRAINT fk_ycnh_requester
        FOREIGN KEY (requested_by) REFERENCES NhanVien(employee_id)
        ON UPDATE CASCADE,
    CONSTRAINT fk_ycnh_approver
        FOREIGN KEY (approved_by) REFERENCES NguoiDung(user_id)
        ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX idx_status (status),
    INDEX idx_store  (store_id)
) ENGINE=InnoDB COMMENT='UC39 — Phiếu yêu cầu đặt thêm hàng từ NCC';


CREATE TABLE PhieuNhapKho (
    receipt_id          INT             NOT NULL AUTO_INCREMENT,
    store_id            INT             NOT NULL,
    supplier_id         INT             NOT NULL,
    received_by         INT             NOT NULL  COMMENT 'FK → NhanVien (warehouse)',
    purchase_request_id INT             NULL      COMMENT 'FK → YeuCauNhapHang',
    receipt_date        DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    total_value         DECIMAL(12,2)   NOT NULL DEFAULT 0.00,
    note                TEXT            NULL,
    created_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (receipt_id),
    CONSTRAINT fk_pnk_store
        FOREIGN KEY (store_id) REFERENCES CuaHang(store_id)
        ON UPDATE CASCADE,
    CONSTRAINT fk_pnk_supplier
        FOREIGN KEY (supplier_id) REFERENCES NhaCungCap(supplier_id)
        ON UPDATE CASCADE,
    CONSTRAINT fk_pnk_receiver
        FOREIGN KEY (received_by) REFERENCES NhanVien(employee_id)
        ON UPDATE CASCADE,
    CONSTRAINT fk_pnk_request
        FOREIGN KEY (purchase_request_id) REFERENCES YeuCauNhapHang(request_id)
        ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX idx_store       (store_id),
    INDEX idx_receipt_date (receipt_date)
) ENGINE=InnoDB COMMENT='UC34 — Phiếu nhập nguyên liệu từ NCC';


-- Bảng trung gian M:N: PhieuNhapKho ↔ NguyenLieu
CREATE TABLE ChiTietNhapKho (
    receipt_id     INT             NOT NULL,
    ingredient_id  INT             NOT NULL,
    quantity       DECIMAL(10,3)   NOT NULL CHECK (quantity > 0),
    unit           VARCHAR(20)     NOT NULL,
    unit_cost      DECIMAL(10,2)   NOT NULL DEFAULT 0.00,
    total_cost     DECIMAL(12,2)   NOT NULL DEFAULT 0.00
                                   COMMENT '= quantity * unit_cost',

    PRIMARY KEY (receipt_id, ingredient_id),
    CONSTRAINT fk_ctnk_receipt
        FOREIGN KEY (receipt_id) REFERENCES PhieuNhapKho(receipt_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_ctnk_ingredient
        FOREIGN KEY (ingredient_id) REFERENCES NguyenLieu(ingredient_id)
        ON UPDATE CASCADE
) ENGINE=InnoDB COMMENT='UC34 — Chi tiết từng NL trong phiếu nhập (M:N junction)';


CREATE TABLE PhieuXuatKho (
    export_id    INT      NOT NULL AUTO_INCREMENT,
    store_id     INT      NOT NULL,
    order_id     INT      NULL     COMMENT 'UC35 — xuất theo đơn hàng',
    exported_by  INT      NOT NULL COMMENT 'FK → NhanVien',
    export_date  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    reason       VARCHAR(200) NULL COMMENT 'Theo đơn / Theo yêu cầu bếp / Hao hụt...',
    note         TEXT     NULL,

    PRIMARY KEY (export_id),
    CONSTRAINT fk_pxk_store
        FOREIGN KEY (store_id) REFERENCES CuaHang(store_id)
        ON UPDATE CASCADE,
    CONSTRAINT fk_pxk_order
        FOREIGN KEY (order_id) REFERENCES DonHang(order_id)
        ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_pxk_exporter
        FOREIGN KEY (exported_by) REFERENCES NhanVien(employee_id)
        ON UPDATE CASCADE,
    INDEX idx_store       (store_id),
    INDEX idx_order       (order_id),
    INDEX idx_export_date (export_date)
) ENGINE=InnoDB COMMENT='UC35 — Phiếu xuất nguyên liệu khỏi kho';


-- Bảng trung gian M:N: PhieuXuatKho ↔ NguyenLieu
CREATE TABLE ChiTietXuatKho (
    export_id      INT             NOT NULL,
    ingredient_id  INT             NOT NULL,
    quantity       DECIMAL(10,3)   NOT NULL CHECK (quantity > 0),
    unit           VARCHAR(20)     NOT NULL,

    PRIMARY KEY (export_id, ingredient_id),
    CONSTRAINT fk_ctxk_export
        FOREIGN KEY (export_id) REFERENCES PhieuXuatKho(export_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_ctxk_ingredient
        FOREIGN KEY (ingredient_id) REFERENCES NguyenLieu(ingredient_id)
        ON UPDATE CASCADE
) ENGINE=InnoDB COMMENT='UC35 — Chi tiết từng NL trong phiếu xuất (M:N junction)';


CREATE TABLE KiemKe (
    stocktake_id  INT      NOT NULL AUTO_INCREMENT,
    store_id      INT      NOT NULL,
    conducted_by  INT      NOT NULL COMMENT 'FK → NhanVien (warehouse)',
    stocktake_date DATE    NOT NULL,
    status        ENUM('draft','confirmed','approved')
                           NOT NULL DEFAULT 'draft',
    note          TEXT     NULL,
    approved_by   INT      NULL     COMMENT 'FK → NhanVien (manager)',
    created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
                           ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (stocktake_id),
    CONSTRAINT fk_kk_store
        FOREIGN KEY (store_id) REFERENCES CuaHang(store_id)
        ON UPDATE CASCADE,
    CONSTRAINT fk_kk_conductor
        FOREIGN KEY (conducted_by) REFERENCES NhanVien(employee_id)
        ON UPDATE CASCADE,
    CONSTRAINT fk_kk_approver
        FOREIGN KEY (approved_by) REFERENCES NhanVien(employee_id)
        ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX idx_store (store_id),
    INDEX idx_date  (stocktake_date)
) ENGINE=InnoDB COMMENT='UC37 — Biên bản kiểm kê định kỳ';


-- Bảng trung gian: KiemKe ↔ NguyenLieu (chi tiết từng dòng)
CREATE TABLE ChiTietKiemKe (
    stocktake_id   INT             NOT NULL,
    ingredient_id  INT             NOT NULL,
    system_qty     DECIMAL(10,3)   NOT NULL COMMENT 'Số lượng theo hệ thống',
    actual_qty     DECIMAL(10,3)   NOT NULL COMMENT 'Số lượng đếm thực tế',
    difference     DECIMAL(10,3)   GENERATED ALWAYS AS (actual_qty - system_qty) STORED
                                   COMMENT '> 0: thừa, < 0: thiếu',
    note           TEXT            NULL,

    PRIMARY KEY (stocktake_id, ingredient_id),
    CONSTRAINT fk_ctkk_stocktake
        FOREIGN KEY (stocktake_id) REFERENCES KiemKe(stocktake_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_ctkk_ingredient
        FOREIGN KEY (ingredient_id) REFERENCES NguyenLieu(ingredient_id)
        ON UPDATE CASCADE
) ENGINE=InnoDB COMMENT='UC37 — Chi tiết kiểm kê từng nguyên liệu + chênh lệch';


-- ============================================================
-- MODULE 9: CẤU HÌNH HỆ THỐNG
-- ============================================================

CREATE TABLE CauHinhHeThong (
    config_key    VARCHAR(100) NOT NULL,
    config_value  TEXT         NOT NULL,
    description   TEXT         NULL,
    updated_by    INT          NULL  COMMENT 'FK → NguoiDung (admin)',
    updated_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
                               ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (config_key),
    CONSTRAINT fk_ch_admin
        FOREIGN KEY (updated_by) REFERENCES NguoiDung(user_id)
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB COMMENT='UC28 — Key-value cấu hình: phí ship, giờ mở cửa, bán kính...';

INSERT INTO CauHinhHeThong (config_key, config_value, description) VALUES
    ('delivery_fee_base',       '15000',   'Phí giao hàng cơ bản (VND)'),
    ('delivery_fee_per_km',     '5000',    'Phí thêm mỗi km (VND)'),
    ('max_delivery_radius_km',  '10',      'Bán kính giao hàng tối đa (km)'),
    ('order_cancel_window_min', '5',       'Thời gian cho phép hủy đơn (phút)'),
    ('loyalty_point_per_order', '1',       'Điểm tích lũy mỗi 1000 VND'),
    ('min_order_amount',        '50000',   'Giá trị đơn hàng tối thiểu (VND)'),
    ('low_stock_alert_enabled', 'true',    'Bật cảnh báo hàng sắp hết UC36');


SET FOREIGN_KEY_CHECKS = 1;


-- ============================================================
-- TRIGGERS
-- ============================================================

DELIMITER $$

-- Trigger 1: Tự động INSERT LichSuTrangThai khi DonHang.status thay đổi
CREATE TRIGGER trg_don_hang_status_change
AFTER UPDATE ON DonHang
FOR EACH ROW
BEGIN
    IF OLD.status <> NEW.status THEN
        INSERT INTO LichSuTrangThai (order_id, old_status, new_status, changed_by, note)
        VALUES (NEW.order_id, OLD.status, NEW.status, NEW.updated_at, NULL);
    END IF;
END$$

DELIMITER $$
-- Trigger 2: Tự động cập nhật TonKho khi INSERT ChiTietNhapKho (UC34)
CREATE TRIGGER trg_nhap_kho_update_ton
AFTER INSERT ON ChiTietNhapKho
FOR EACH ROW
BEGIN
    DECLARE v_store_id INT;
    SELECT store_id INTO v_store_id FROM PhieuNhapKho WHERE receipt_id = NEW.receipt_id;

    INSERT INTO TonKho (store_id, ingredient_id, quantity_available, unit)
        VALUES (v_store_id, NEW.ingredient_id, NEW.quantity, NEW.unit)
    ON DUPLICATE KEY UPDATE
        quantity_available = quantity_available + NEW.quantity;
END$$

DELIMITER $$
-- Trigger 3: Tự động cập nhật TonKho khi INSERT ChiTietXuatKho (UC35)
CREATE TRIGGER trg_xuat_kho_update_ton
AFTER INSERT ON ChiTietXuatKho
FOR EACH ROW
BEGIN
    DECLARE v_store_id INT;
    SELECT store_id INTO v_store_id FROM PhieuXuatKho WHERE export_id = NEW.export_id;

    UPDATE TonKho
       SET quantity_available = quantity_available - NEW.quantity
     WHERE store_id = v_store_id AND ingredient_id = NEW.ingredient_id;
END$$

DELIMITER $$
-- Trigger 4: Tính lại subtotal ChiTietDonHang tự động
CREATE TRIGGER trg_chitiet_calc_subtotal
BEFORE INSERT ON ChiTietDonHang
FOR EACH ROW
BEGIN
    SET NEW.subtotal = NEW.quantity * NEW.unit_price;
END$$

DELIMITER ;


-- ============================================================
-- VIEWS HỮU ÍCH
-- ============================================================

-- View: Đơn hàng kèm đầy đủ thông tin (UC9, UC13)
CREATE VIEW v_DonHang_ChiTiet AS
SELECT
    dh.order_id,
    dh.order_code,
    dh.order_time,
    dh.order_type,
    dh.status,
    dh.total_amount,
    dh.delivery_fee,
    nd.full_name   AS customer_name,
    nd.phone       AS customer_phone,
    ch.store_name,
    ch.city,
    dc.full_address AS delivery_address,
    tt.method      AS payment_method,
    tt.status      AS payment_status
FROM DonHang dh
LEFT JOIN KhachHang kh ON dh.customer_id = kh.customer_id
LEFT JOIN NguoiDung nd ON kh.customer_id = nd.user_id
LEFT JOIN CuaHang   ch ON dh.store_id = ch.store_id
LEFT JOIN DiaChi    dc ON dh.delivery_address_id = dc.address_id
LEFT JOIN ThanhToan tt ON dh.order_id = tt.order_id;


-- View: Tồn kho cảnh báo sắp hết (UC36)
CREATE VIEW v_CanhBao_TonKho AS
SELECT
    tk.store_id,
    ch.store_name,
    tk.ingredient_id,
    nl.ingredient_name,
    tk.quantity_available,
    tk.min_threshold,
    tk.unit,
    (tk.quantity_available - tk.min_threshold) AS con_lai_truoc_nguong
FROM TonKho tk
JOIN CuaHang    ch ON tk.store_id = ch.store_id
JOIN NguyenLieu nl ON tk.ingredient_id = nl.ingredient_id
WHERE tk.quantity_available <= tk.min_threshold
  AND ch.status = 'active';


-- View: Báo cáo doanh thu theo chi nhánh (UC17, UC27)
CREATE VIEW v_DoanhThu_CuaHang AS
SELECT
    ch.store_id,
    ch.store_name,
    ch.city,
    DATE(dh.order_time)  AS ngay,
    COUNT(dh.order_id)   AS so_don,
    SUM(dh.total_amount) AS doanh_thu,
    AVG(dh.total_amount) AS don_tb
FROM DonHang dh
JOIN CuaHang ch ON dh.store_id = ch.store_id
WHERE dh.status = 'delivered'
GROUP BY ch.store_id, ch.store_name, ch.city, DATE(dh.order_time);


-- View: Báo cáo xuất nhập tồn (UC38)
CREATE VIEW v_XuatNhapTon AS
SELECT
    nl.ingredient_id,
    nl.ingredient_name,
    nl.unit,
    ch.store_id,
    ch.store_name,
    COALESCE(SUM(CASE WHEN pnk.receipt_id IS NOT NULL THEN ctnk.quantity END), 0) AS tong_nhap,
    COALESCE(SUM(CASE WHEN pxk.export_id  IS NOT NULL THEN ctxk.quantity END), 0) AS tong_xuat,
    tk.quantity_available AS ton_hien_tai
FROM NguyenLieu nl
CROSS JOIN CuaHang ch
LEFT JOIN TonKho tk ON tk.ingredient_id = nl.ingredient_id AND tk.store_id = ch.store_id
LEFT JOIN ChiTietNhapKho ctnk ON ctnk.ingredient_id = nl.ingredient_id
LEFT JOIN PhieuNhapKho   pnk  ON pnk.receipt_id = ctnk.receipt_id AND pnk.store_id = ch.store_id
LEFT JOIN ChiTietXuatKho ctxk ON ctxk.ingredient_id = nl.ingredient_id
LEFT JOIN PhieuXuatKho   pxk  ON pxk.export_id = ctxk.export_id AND pxk.store_id = ch.store_id
GROUP BY nl.ingredient_id, nl.ingredient_name, nl.unit, ch.store_id, ch.store_name, tk.quantity_available;


-- ============================================================
-- INDEX BỔ SUNG (performance)
-- ============================================================

-- Tìm kiếm đơn hàng theo khoảng thời gian
CREATE INDEX idx_dh_time_status ON DonHang (order_time, status);

-- Phân trang thông báo chưa đọc
CREATE INDEX idx_tb_unread ON ThongBao (user_id, is_read, sent_at);

-- Tra cứu giao dịch thanh toán
CREATE INDEX idx_gd_gateway_ref ON GiaoDich (gateway, gateway_transaction_id);

SHOW TRIGGERS;