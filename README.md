# 🎓 StudentReg API — TypeScript + PostgreSQL

## ⚡ Chạy với Dev Container (khuyến nghị)

> Yêu cầu: VS Code + extension **Dev Containers** + Docker Desktop

```
1. Mở thư mục project trong VS Code
2. Nhấn F1 → "Dev Containers: Reopen in Container"
3. Chờ build xong (~2 phút lần đầu)
4. Mở terminal trong VS Code:
      npm run dev
5. Server chạy tại http://localhost:3000
```

PostgreSQL và dữ liệu mẫu được **tự động khởi tạo** từ `init.sql`.

---

## 🗂 Cấu trúc

```
src/
├── app.ts                  # Entry point
├── db/db.ts                # Hàm query() dùng chung
├── middleware/
│   └── errorHandler.ts     # Xử lý lỗi tập trung
└── routes/
    ├── students.ts          # CRUD: STUDENT
    └── enrollments.ts       # CRUD: STUDENT_ENROLEMENT
.devcontainer/
├── devcontainer.json        # VS Code Dev Container config
└── docker-compose.yml       # Node app + PostgreSQL
init.sql                     # Schema + dữ liệu mẫu (tự chạy)
api.http                     # Test API bằng REST Client (VS Code)
```

---

## 📡 API Endpoints

### STUDENT `/api/students`
| Method | URL | Mô tả |
|--------|-----|-------|
| GET | `/api/students` | Tất cả sinh viên |
| GET | `/api/students/:id` | 1 sinh viên + môn học |
| POST | `/api/students` | Thêm mới |
| PUT | `/api/students/:id` | Cập nhật |
| DELETE | `/api/students/:id` | Xoá |

### ENROLLMENT `/api/enrollments`
| Method | URL | Mô tả |
|--------|-----|-------|
| GET | `/api/enrollments` | Tất cả đăng kí |
| GET | `/api/enrollments/:sid` | Đăng kí của 1 SV |
| POST | `/api/enrollments` | Đăng kí môn |
| DELETE | `/api/enrollments` | Huỷ đăng kí |

---

## 🧪 Test API

Mở file `api.http` trong VS Code → click **Send Request** trên từng request.

Hoặc dùng Postman với base URL `http://localhost:3000`.

---

## Scripts

```bash
npm run dev    # Chạy development (auto-reload)
npm run build  # Compile TypeScript → dist/
npm start      # Chạy production (sau khi build)
```
# studentreg-api
