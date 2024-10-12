## Chi tiết công nghệ sử dụng

### Ngôn ngữ lập trình

- TypeScript 4.9.5: Superset của JavaScript với kiểu dữ liệu tĩnh

### Framework chính

- Next.js 13.4.8: Framework React cho phát triển ứng dụng web với tính năng server-side rendering và static site generation
- React 18.2.0: Thư viện JavaScript để xây dựng giao diện người dùng

### UI và Styling

- Tailwind CSS 3.3.2: Framework CSS tiện ích để xây dựng giao diện nhanh chóng
- Radix UI: Thư viện components không định kiểu cho React, bao gồm:
  - @radix-ui/react-label 2.1.0
  - @radix-ui/react-scroll-area 1.2.0
  - @radix-ui/react-select 2.1.2
  - @radix-ui/react-slot 1.0.2
- class-variance-authority 0.4.0: Thư viện để tạo các variants cho components
- clsx 1.2.1 và tailwind-merge 1.13.2: Công cụ để kết hợp class names hiệu quả
- Lucide React 0.105.0-alpha.4: Thư viện icon cho React

### Theming và Dark Mode

- next-themes 0.2.1: Hỗ trợ chế độ tối và chủ đề cho Next.js

### Xử lý hình ảnh

- sharp 0.31.3: Thư viện xử lý hình ảnh hiệu suất cao

### Công cụ phát triển

- ESLint 8.44.0: Linter cho JavaScript và TypeScript
- Prettier 2.8.8: Code formatter
- autoprefixer 10.4.14: Tự động thêm các tiền tố cho CSS
- postcss 8.4.24: Công cụ chuyển đổi CSS

### Quản lý package

- Yarn: Công cụ quản lý gói phần mềm (phiên bản cụ thể không được chỉ định trong package.json)

### Plugins và cấu hình bổ sung

- @ianvs/prettier-plugin-sort-imports 3.7.2: Plugin Prettier để sắp xếp imports
- eslint-config-next 13.0.0: Cấu hình ESLint cho Next.js
- eslint-config-prettier 8.8.0: Tắt các quy tắc ESLint xung đột với Prettier
- eslint-plugin-react 7.32.2: Plugin ESLint cho React
- eslint-plugin-tailwindcss 3.13.0: Plugin ESLint cho Tailwind CSS
- tailwindcss-animate 1.0.6: Plugin animation cho Tailwind CSS

### Môi trường phát triển

- Node.js (phiên bản cụ thể không được chỉ định trong package.json)

### Triển khai

- Vercel (được đề xuất cho Next.js, nhưng có thể sử dụng nền tảng khác)

Dự án này tận dụng các công nghệ hiện đại nhất trong phát triển web, với trọng tâm là hiệu suất, khả năng mở rộng và trải nghiệm phát triển tốt. Sự kết hợp giữa Next.js, React, TypeScript và Tailwind CSS cung cấp một nền tảng mạnh mẽ cho việc xây dựng ứng dụng web phức tạp và có khả năng mở rộng.

## Cấu trúc dự án

Dự án này sử dụng cấu trúc thư mục App Router của Next.js 13:

- `app/`: Chứa các routes và layouts của ứng dụng
  - `(auth)/`: Nhóm route cho các tính năng liên quan đến xác thực
    - `contract-approval-flow/`: Luồng phê duyệt hợp đồng
    - `contract-approval/`: Phê duyệt hợp đồng
    - `contract-signing/`: Ký hợp đồng
    - `individual-management/`: Quản lý cá nhân
    - `employee-list/`: Danh sách nhân viên
    - `personal-information/`: Thông tin cá nhân
- `components/`: Chứa các components có thể tái sử dụng
  - `ui/`: Components UI cơ bản (như Select, Input)

## Tính năng chính

- Quản lý hợp đồng:
  - Luồng phê duyệt hợp đồng
  - Phê duyệt hợp đồng
  - Ký hợp đồng
- Quản lý nhân sự:
  - Quản lý thông tin cá nhân
  - Danh sách nhân viên
- Giao diện người dùng:
  - Components tùy chỉnh (Select, Input) dựa trên Radix UI
  - Responsive design với Tailwind CSS
- Xác thực và phân quyền (được gợi ý bởi cấu trúc thư mục `(auth)`)
