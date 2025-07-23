Đây là một ứng dụng full-stack để quản lý học sinh, phụ huynh, lớp học, đăng ký lớp học và gói đăng ký. Backend được xây dựng bằng Node.js và MongoDB, frontend được xây dựng bằng React và Vite.

Cách dựng dự án với Docker
Hãy làm theo các bước sau để clone và chạy dự án bằng Docker.

1. Clone Repository
   git clone https://github.com/Ducprovjp/class-management.git
   cd backend
   yarn install
   yarn dev

   cd frontend
   yarn install
   yarn dev

2. Build và chạy với Docker Compose

Build các image:
docker-compose build

Khởi động các container:
docker-compose up

Lệnh này sẽ:

Build và khởi động backend (Node.js) tại http://localhost:8000.
Build và khởi động frontend (React) tại http://localhost:3000.
Khởi động MongoDB tại mongodb://localhost:27017.

Truy cập ứng dụng:

Frontend: Mở http://localhost:3000 trên trình duyệt.
Backend API: Kiểm tra các endpoint tại http://localhost:8000/api/v2/... (xem phần Endpoint).
MongoDB: Kết nối tới mongodb://localhost:27017/school_db bằng MongoDB Compass (tùy chọn).

Dừng các container:
docker-compose down

Để xóa cả volume dữ liệu MongoDB:
docker-compose down -v

Mô tả sơ lược Schema Cơ sở dữ liệu
Ứng dụng sử dụng MongoDB với cơ sở dữ liệu school_db. Dưới đây là các collection chính và schema của chúng:

1. user (Người dùng để xác thực)

\_id: ObjectId (khóa chính)
email: String (bắt buộc, duy nhất)
password: String (bắt buộc, mã hóa)
role: String (bắt buộc, ví dụ: "admin", "user")

2. parent (Phụ huynh)

\_id: ObjectId (khóa chính)
name: String (bắt buộc)
email: String (bắt buộc, duy nhất)
phone: String (tùy chọn)

3. student (Học sinh)

\_id: ObjectId (khóa chính)
name: String (bắt buộc)
dob: Date (bắt buộc, ngày sinh)
gender: String (bắt buộc, "Nam" hoặc "Nữ")
parent_id: ObjectId (bắt buộc, tham chiếu tới parent)
current_grade: String (bắt buộc, ví dụ: "10", "11")

4. classes (Lớp học)

\_id: ObjectId (khóa chính)
name: String (bắt buộc, ví dụ: "Lớp Toán 10")
subject: String (bắt buộc, ví dụ: "Toán")
day_of_week: String (bắt buộc, ví dụ: "Thứ Ba")
start_time: String (bắt buộc, ví dụ: "08:00")
end_time: String (bắt buộc, ví dụ: "10:00")
teacher_name: String (bắt buộc)

5. classRegistrations (Đăng ký lớp học)

\_id: ObjectId (khóa chính)
class_id: ObjectId (bắt buộc, tham chiếu tới classes)
student_id: ObjectId (bắt buộc, tham chiếu tới student)

6. subscriptions (Gói đăng ký)

\_id: ObjectId (khóa chính)
student_id: ObjectId (bắt buộc, tham chiếu tới student)
total_sessions: Number (bắt buộc, tổng số buổi)
used_sessions: Number (bắt buộc, số buổi đã sử dụng)
start_date: Date (bắt buộc)
end_date: Date (bắt buộc)
