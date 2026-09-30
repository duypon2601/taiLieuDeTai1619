# 05. KẾ HOẠCH PHÁT TRIỂN FRONTEND & TRẢI NGHIỆM NGƯỜI DÙNG (UI/UX)
## ĐỀ TÀI DATA-16: AI AGENT TỰ SINH DASHBOARD TỪ NGÔN NGỮ TỰ NHIÊN
### Đội thi: P-117 | Module: Next.js 14, Apache ECharts & Human-in-the-Loop Studio

---

## 1. NGUYÊN TẮC THIẾT KẾ GIAO DIỆN & BẢNG MÀU DOANH NGHIỆP (DESIGN SYSTEM)

* **Phong cách thẩm mỹ (Aesthetics):** Hiện đại, tinh gọn, chuẩn mực doanh nghiệp (Enterprise Grade), tạo ấn tượng mạnh mẽ (WOW effect) với hiệu ứng bóng mờ (Glassmorphism), đường nét sắc cạnh và độ phản hồi tức thì.
* **Bảng màu chủ đạo (Corporate Color Palette):**
  * **Màu nền (Dark/Light Mode):** Slate 950 (`#020617`) cho Dark mode; Slate 50 (`#F8FAFC`) cho Light mode.
  * **Màu thương hiệu nhấn (Accent Color):** Xanh Navy đậm (`#1E3A8A`) kết hợp Vàng ánh kim (`#D97706` / `#F59E0B`) — chuẩn tone nhận diện của các dự án cao cấp Vinhomes.
  * **Màu biểu đồ (Chart Data Palette):** Bộ 6 màu tương phản cao, tối ưu cho mắt nhìn và người khiếm thị màu:
    * Xanh Sapphire: `#2563EB`
    * Ngọc Lục Bảo: `#059669`
    * Hổ Phách: `#D97706`
    * Tím Thạch Anh: `#7C3AED`
    * Hồng Ruby: `#E11D48`
    * Xanh Lam Biển: `#0891B2`
* **Typography:** Font chữ Google Fonts `Inter` kết hợp `Outfit` cho các con số KPI cỡ lớn.

---

## 2. THIẾT KẾ CHI TIẾT 3 MÀN HÌNH CỐT LÕI

### 2.1. Màn hình 1: Khung Khởi tạo & Đàm thoại (Conversational Input Canvas)
* **Vị trí:** `/` (Trang chủ ứng dụng)
* **Thành phần giao diện:**
  1. **Thanh Header:** Logo VSF / Vinhomes, thông tin tài khoản đăng nhập (Họ tên, Vai trò: `Builder`, Vùng phụ trách: `Miền Bắc`).
  2. **Hero Prompt Canvas:** Ô nhập liệu lớn nằm ở vị trí trung tâm, hỗ trợ tự động co giãn dòng, phím tắt `Ctrl + Enter` hoặc nút gửi `[Tạo Dashboard]`.
  3. **Thẻ gợi ý câu hỏi thông minh (Quick Prompts Carousel):**
     * `[+ Tình hình bán hàng Ocean Park Quý 3]`
     * `[+ So sánh tỷ lệ cọc Sapphire 1 vs Sapphire 2]`
     * `[+ Cơ cấu nguồn khách qua sàn F1 & F2]`
     * `[+ Top 5 phân khu có doanh thu cao nhất năm 2026]`
  4. **Thanh hiển thị tiến trình suy nghĩ của AI (SSE Progress Stepper):**
     * Xuất hiện ngay khi bấm gửi, cập nhật từng trạng thái mượt mà kèm hiệu ứng shimmer:
       $$\text{Phân tích câu hỏi} \longrightarrow \text{Ánh xạ Semantic Cube} \longrightarrow \text{Tư vấn biểu đồ tối ưu} \longrightarrow \text{Hoàn tất bản nháp}$$

```
+---------------------------------------------------------------------------------------+
| [LOGO VSF]  DATA-16: AI AGENT TỰ SINH DASHBOARD                 [User: Builder - MB]  |
+---------------------------------------------------------------------------------------+
|                                                                                       |
|              TRỢ LÝ TỰ SINH DASHBOARD PHÂN TÍCH KINH DOANH BẤT ĐỘNG SẢN               |
|                                                                                       |
|   +-------------------------------------------------------------------------------+   |
|   | > So sánh doanh số thực tế và số lượng cọc các phân khu Ocean Park trong Q3   |   |
|   +-------------------------------------------------------------------------------+   |
|                                                      [ ✨ BẤM TẠO DASHBOARD ]          |
|                                                                                       |
|   Gợi ý phân tích nhanh:                                                              |
|   [+ Doanh số theo tháng]  [+ Tỷ lệ vào HĐMB]  [+ Hiệu quả đại lý]  [+ Tồn giỏ hàng]  |
|                                                                                       |
|   Tiến trình AI: [✓ Đã hiểu ý định] -> [✓ Đã duyệt Cube Query] -> [Đang chọn chart...] |
+---------------------------------------------------------------------------------------+
```

---

### 2.2. Màn hình 2: Studio Xem Nháp & Phê Duyệt HITL (Builder Studio & Review Modal)
* **Vị trí:** `/studio`
* **Mục đích:** Cho phép người dùng chuyên gia (Builder / Analyst) kiểm soát chất lượng trước khi báo cáo được ban hành rộng rãi.
* **Thành phần giao diện:**
  1. **Thanh trạng thái chất lượng (Quality Status Bar):**
     * Nhãn Intent: `Xác định thành công`
     * Điểm phù hợp biểu đồ (CSS): `94/100 (Tối ưu)`
     * Kiểm tra ảo giác số liệu: `0% Hallucination (Đã đối soát DataFrame)`
  2. **Lưới Dashboard nháp (Grid Preview Canvas):**
     * Hàng 1: Các thẻ KPI lớn (Tổng doanh số, Số lượng cọc, Tỷ lệ vào HĐMB) kèm nút `[Xem công thức metric]`.
     * Hàng 2: Biểu đồ xu hướng (Line/Area Chart) và Biểu đồ cơ cấu phân khu (Bar/Donut Chart).
  3. **Hộp tóm tắt nhận xét kinh doanh (Narrative Insight Banner):**
     * Tự động sinh 2-3 câu bình luận nổi bật điểm sáng kinh doanh.
  4. **Nút tương tác chuyển đổi loại Chart nhanh (Quick Chart Switcher):**
     * Tại góc mỗi Widget, người dùng có thể nhấp vào dropdown để đổi dạng biểu đồ (ví dụ: từ Cột dọc sang Cột ngang hoặc Bảng số liệu) mà không cần truy vấn lại từ đầu.
  5. **Thanh hành động HITL (Action Bar):**
     * Nút `[Chỉnh sửa bằng Chat Copilot]` (Mở side-panel gõ lệnh tinh chỉnh).
     * Nút `[Duyệt & Xuất Bản Dashboard]` (Kích hoạt popup xác nhận, lưu bản ghi vào CSDL PostgreSQL và cấp đường link chính thức).

```
+---------------------------------------------------------------------------------------+
| < Quay lại | BẢN NHÁP: Phân tích Doanh số & Cọc Ocean Park Q3          [Chế độ BUILDER]|
+---------------------------------------------------------------------------------------+
| AI Quality Bar: [CSS Score: 94/100] | [Cube Query: Hợp lệ] | [Hallucination: 0%]      |
+---------------------------------------------------------------------------------------+
| [WIDGET 1: KPI CARDS]                      [WIDGET 2: CƠ CẤU DOANH SỐ PHÂN KHU]        |
| Doanh số: 1,420 Tỷ VNĐ (+18.4% MoM)        Loại: Bar Chart [Dropdown Đổi Chart v]     |
| Lượng cọc: 850 căn                         +----------------------------------------+ |
| Tỷ lệ vào HĐ: 78.4%                        |            (ECharts Bar Chart)         | |
| [🔗 Xem giải trình công thức metric]        +----------------------------------------+ |
+--------------------------------------------+------------------------------------------+
| TÓM TẮT INSIGHT KINH DOANH:                                                           |
| "Doanh số tăng trưởng mạnh nhất vào tuần thứ 3 sau đợt mở bán phân khu Sapphire.       |
| Phân khu Sapphire 1 đóng góp 62% tổng lượng cọc toàn dự án."                          |
+---------------------------------------------------------------------------------------+
|                   [ NÚT: GÕ LỆNH SỬA THÊM ]       [ 🚀 NÚT: PHÊ DUYỆT & XUẤT BẢN ]     |
+---------------------------------------------------------------------------------------+
```

---

### 2.3. Màn hình 3: Dashboard Chính thức & Lọc Chéo Thời Gian Thực (Viewer Executive Dashboard)
* **Vị trí:** `/dashboards/[id]`
* **Đối tượng sử dụng:** Lãnh đạo cấp cao, Quám đốc Vùng, Trưởng phòng Kinh doanh (Chế độ chỉ xem - Viewer Mode).
* **Tính năng vượt trội: Lọc chéo tương tác thời gian thực (Interactive Cross-filtering):**
  * Khi người dùng nhấp chuột vào cột `Sapphire 1` trên Biểu đồ phân khu:
    * Toàn bộ các thẻ KPI tự động cập nhật lại số liệu chỉ tính riêng cho `Sapphire 1`.
    * Biểu đồ xu hướng theo tuần tự động vẽ lại đường xu hướng riêng của `Sapphire 1`.
    * Độ trễ phản hồi của toàn bộ màn hình đạt dưới **1.0 giây** nhờ cơ chế cache của Zustand và Cube.
  * Có thanh hiển thị Filter Tag: `Đang lọc: [Phân khu: Sapphire 1] [x Xóa lọc]`.
* **Tính năng phụ trợ:**
  * Nút `[Xuất file PDF/PNG]` tải về báo cáo định dạng trang in ấn chuyên nghiệp.
  * Nút `[Chia sẻ liên kết]` tạo đường dẫn bảo mật phân quyền.

---

## 3. CÔNG NGHỆ & TỐI ƯU HIỆU NĂNG TRỰC QUAN HÓA (APACHE ECHARTS & RECHARTS)

1. **Sử dụng Apache ECharts cho các biểu đồ chính:**
   * Hỗ trợ Canvas và SVG rendering mượt mà trên cả màn hình di động và máy tính bảng.
   * Cấu hình tính năng Tooltip chuyên nghiệp hiển thị đầy đủ đơn vị tiền tệ VNĐ và tỷ lệ phần trăm:
```typescript
tooltip: {
  trigger: 'axis',
  formatter: (params: any) => {
    let res = `<div class="font-bold mb-1">${params[0].name}</div>`;
    params.forEach((item: any) => {
      res += `<div class="flex justify-between gap-4">
        <span>${item.marker} ${item.seriesName}:</span>
        <span class="font-semibold">${new Intl.NumberFormat('vi-VN').format(item.value)} VNĐ</span>
      </div>`;
    });
    return res;
  }
}
```
2. **Sử dụng Recharts & Lucide Icons cho KPI Sparklines:**
   * Tối ưu kích thước gói tải (bundle size), tải trang ban đầu (First Contentful Paint) dưới 1.2 giây.
3. **Cơ chế Responsive Canvas Grid:**
   * Sử dụng thư viện `react-grid-layout` để tự động sắp xếp các widget 2 cột trên Desktop, 1 cột trên Mobile.
