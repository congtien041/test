# ẢnhShare

ẢnhShare là web app tĩnh giúp tải ảnh lên, lưu trữ trong trình duyệt, tìm kiếm, tải xuống và chia sẻ ảnh cá nhân.

## Tính năng

- Tải lên nhiều ảnh cùng lúc bằng nút chọn tệp hoặc kéo thả.
- Lưu ảnh cục bộ bằng IndexedDB, không cần máy chủ hoặc đăng nhập.
- Gắn mô tả và thẻ cho ảnh.
- Tìm kiếm theo tên ảnh, mô tả hoặc thẻ.
- Tải ảnh xuống lại bất cứ lúc nào.
- Chia sẻ bằng Web Share API nếu trình duyệt hỗ trợ, hoặc sao chép dữ liệu ảnh.
- Xuất toàn bộ kho ảnh thành tệp JSON để chia sẻ hoặc sao lưu.
- Nhập lại gói JSON trên thiết bị hoặc trình duyệt khác để khôi phục kho ảnh, tránh mất dữ liệu khi đổi môi trường.
- Giao diện sáng/tối và responsive cho điện thoại.

## Chạy thử

Mở trực tiếp `index.html` trong trình duyệt, hoặc chạy một máy chủ tĩnh:

```bash
python3 -m http.server 8000
```

Sau đó truy cập `http://localhost:8000`.

## Lưu ý

Ảnh được lưu trong IndexedDB của trình duyệt trên thiết bị hiện tại. Trước khi xóa dữ liệu trang web hoặc đổi trình duyệt/thiết bị, hãy bấm **Xuất gói sao lưu** để tải tệp JSON, sau đó dùng **Nhập gói sao lưu** ở nơi mới để khôi phục kho ảnh.
