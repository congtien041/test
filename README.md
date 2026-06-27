# ẢnhShare

ẢnhShare là web app tĩnh giúp tải ảnh lên, lưu trữ trong trình duyệt, tìm kiếm, tải xuống và chia sẻ ảnh cá nhân.

## Tính năng

- Tải lên nhiều ảnh cùng lúc bằng nút chọn tệp hoặc kéo thả.
- Lưu ảnh cục bộ bằng IndexedDB, không cần máy chủ hoặc đăng nhập.
- Gắn mô tả và thẻ cho ảnh.
- Tìm kiếm theo tên ảnh, mô tả hoặc thẻ.
- Tải ảnh xuống lại bất cứ lúc nào.
- Chia sẻ bằng Web Share API nếu trình duyệt hỗ trợ, hoặc sao chép dữ liệu ảnh.
- Tích hợp Google Drive API: Tự động tải lên và khôi phục kho ảnh nén `.json.gz` thẳng từ thư mục Google Drive của bạn, không cần tải xuống thủ công.
- Vẫn có tùy chọn xuất JSON thường hoặc nhập từ máy tính nếu cần.
- Khu hướng dẫn lưu miễn phí giải thích quy trình sao lưu qua Google Drive tự động.
- Giao diện sáng/tối, responsive cho điện thoại và bố cục hoàn thiện hơn.

## Chạy thử

Mở trực tiếp `index.html` trong trình duyệt, hoặc chạy một máy chủ tĩnh:

```bash
python3 -m http.server 8000
```

Sau đó truy cập `http://localhost:8000`.

## Lưu ý & Cài đặt Google Drive API

Ảnh được lưu trong IndexedDB của trình duyệt trên thiết bị hiện tại. Để tính năng **Sao lưu lên Google Drive** và **Nhập sao lưu từ Drive** hoạt động, bạn cần cung cấp một **Google Client ID**:

1. Đăng nhập [Google Cloud Console](https://console.cloud.google.com/).
2. Tạo một Dự án mới và bật API **Google Drive API**.
3. Cấu hình **OAuth consent screen**, thêm tài khoản email của những người dùng thử nghiệm.
4. Tạo thông tin xác thực: **OAuth client ID** (Web application). Trong phần "Authorized JavaScript origins", điền đường dẫn trang web (ví dụ `http://localhost:8000`).
5. Copy **Client ID** vừa tạo.
6. Mở file `app.js` và thay đoạn `'ĐIỀN_CLIENT_ID_CỦA_BẠN_VÀO_ĐÂY'` bằng Client ID của bạn.

> **Thư mục lưu trữ:** ID thư mục hiện đang được cài cứng (`1JWlCer_wPGe53vdh0lZRDlydqA6l8LSg`). Người sử dụng ứng dụng này phải được cấp quyền **Người chỉnh sửa (Editor)** cho thư mục đó trên Google Drive thì mới có thể sao lưu và khôi phục ảnh.
