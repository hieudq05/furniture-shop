CREATE TABLE Category (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(255) NOT NULL,
    description NVARCHAR(MAX)
);

CREATE TABLE Product (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    name NVARCHAR(255) NOT NULL,
    description NVARCHAR(MAX),
    stock INT NOT NULL DEFAULT 0,
    category_id INT FOREIGN KEY REFERENCES Category(id) ON DELETE SET NULL,
    isAvailable BIT DEFAULT 1
);

CREATE TABLE ProductColor (
    id INT IDENTITY(1,1) PRIMARY KEY,
    product_id UNIQUEIDENTIFIER FOREIGN KEY REFERENCES Product(id) ON DELETE CASCADE,
    class VARCHAR(50),
    selected_class VARCHAR(50)
);

-- Bảng ProductSize: Kích thước của sản phẩm
CREATE TABLE ProductSize (
    id INT IDENTITY(1,1) PRIMARY KEY,
    product_id UNIQUEIDENTIFIER FOREIGN KEY REFERENCES Product(id) ON DELETE CASCADE,
    size_name NVARCHAR(50) NOT NULL,
    description NVARCHAR(MAX)
);

-- Bảng ProductStock: Quản lý số lượng theo màu và kích thước
CREATE TABLE ProductStock (
    id INT IDENTITY(1,1) PRIMARY KEY,
    product_id UNIQUEIDENTIFIER FOREIGN KEY REFERENCES Product(id) ON DELETE NO ACTION,
    color_id INT FOREIGN KEY REFERENCES ProductColor(id) ON DELETE NO ACTION,
    size_id INT FOREIGN KEY REFERENCES ProductSize(id) ON DELETE NO ACTION,
    price DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL DEFAULT 0
);

CREATE TABLE ProductImage (
    id INT IDENTITY(1,1) PRIMARY KEY,
    product_id UNIQUEIDENTIFIER FOREIGN KEY REFERENCES Product(id) ON DELETE CASCADE,
    src NVARCHAR(255) NOT NULL,
    alt NVARCHAR(255)
);

CREATE TABLE Customer (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    full_name NVARCHAR(255) NOT NULL,
    email NVARCHAR(255) UNIQUE NOT NULL,
    password_hash NVARCHAR(255) NOT NULL,
    phone NVARCHAR(20),
    address NVARCHAR(255),
    created_at DATETIME DEFAULT GETDATE(),
    is_active BIT DEFAULT 1
);

CREATE TABLE Role (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    name NVARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE CustomerRole (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    customer_id UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Customer(id) ON DELETE CASCADE,
    role_id UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Role(id) ON DELETE CASCADE
);

CREATE TABLE RefreshToken (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    customer_id UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Customer(id) ON DELETE CASCADE,
    token NVARCHAR(512) NOT NULL UNIQUE,
    expiry_date DATETIME NOT NULL
);

CREATE TABLE Orders (
    id INT IDENTITY(1,1) PRIMARY KEY,
    customer_id UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES Customer(id) ON DELETE CASCADE,
    create_date DATETIME NOT NULL DEFAULT GETDATE(),
    address NVARCHAR(255) NOT NULL
)

CREATE TABLE OrderDetails (
    id INT IDENTITY(1,1) PRIMARY KEY,
    order_id INT NOT NULL FOREIGN KEY REFERENCES Orders(id) ON DELETE CASCADE,
    product_stock_id INT NOT NULL FOREIGN KEY REFERENCES ProductStock(id) ON DELETE CASCADE,
    quantity INT NOT NULL DEFAULT 0
)