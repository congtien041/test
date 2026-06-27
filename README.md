# ẢnhShare

ẢnhShare là web app tĩnh giúp tải ảnh lên, lưu trữ trong trình duyệt, tìm kiếm, tải xuống và chia sẻ ảnh cá nhân.

## Tính năng

- Tải lên nhiều ảnh cùng lúc bằng nút chọn tệp hoặc kéo thả.
- Lưu ảnh cục bộ bằng IndexedDB, không cần máy chủ hoặc đăng nhập.
- Gắn mô tả và thẻ cho ảnh.
- Tìm kiếm theo tên ảnh, mô tả hoặc thẻ.
- Tải ảnh xuống lại bất cứ lúc nào.
- Chia sẻ bằng Web Share API nếu trình duyệt hỗ trợ, hoặc sao chép dữ liệu ảnh.
- Xuất toàn bộ kho ảnh thành tệp `.json.gz` nén nhẹ hơn, kèm nút mở Google Drive để tải file sao lưu lên tài khoản của bạn.
- Vẫn có tùy chọn xuất JSON thường nếu cần file dễ đọc/chỉnh sửa thủ công.
- Nhập lại gói `.json.gz` hoặc `.json` trên thiết bị hoặc trình duyệt khác để khôi phục kho ảnh, tránh mất dữ liệu khi đổi môi trường.
- Khu hướng dẫn lưu miễn phí giải thích rõ giới hạn web tĩnh và quy trình sao lưu an toàn.
- Giao diện sáng/tối, responsive cho điện thoại và bố cục hoàn thiện hơn.

## Chạy thử

Mở trực tiếp `index.html` trong trình duyệt, hoặc chạy một máy chủ tĩnh:

```bash
python3 -m http.server 8000
```

Sau đó truy cập `http://localhost:8000`.

## Lưu ý

Ảnh được lưu trong IndexedDB của trình duyệt trên thiết bị hiện tại. Web tĩnh không tự lưu lên cloud miễn phí nếu không có tài khoản/API riêng, nên cách đơn giản nhất là bấm **Sao lưu lên Google Drive** hoặc **Xuất file nhẹ** để tải tệp `.json.gz`, rồi cất tệp đó lên Google Drive, OneDrive, Dropbox, iCloud, USB hoặc thẻ nhớ. Khi đổi trình duyệt/thiết bị, dùng **Nhập sao lưu** để khôi phục kho ảnh. Nếu trình duyệt quá cũ không hỗ trợ `.gz`, hãy dùng **Xuất JSON thường** hoặc giải nén file trước khi nhập.
