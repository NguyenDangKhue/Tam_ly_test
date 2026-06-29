# Đồng Hành Cùng Trẻ

Mỗi **câu hỏi = một độ tuổi** của trẻ, tăng dần: câu 1 → 5 tuổi, câu 2 → 6 tuổi, ... Mỗi tuổi **bốc ngẫu nhiên 1/10** tình huống. Hết 15 câu → xem điểm **Tình cảm** & **Lý trí**.

## Luồng chơi

| Câu | Tuổi | Tình huống |
|-----|------|------------|
| 1 | 5 tuổi | Ngẫu nhiên 1/10 |
| 2 | 6 tuổi | Ngẫu nhiên 1/10 |
| ... | +1/câu | ... |
| 15 | 19 tuổi | Ngẫu nhiên 1/10 |

> Muốn câu 15 là **20 tuổi**? Vào Admin → Cài đặt → đổi **Số câu mỗi lượt** thành **16**.

## Chạy local

```bash
npm install --strict-ssl=false
npm run dev
```

- Chơi: `/play`
- Admin: `/admin/login` (mật khẩu `admin123`)

## Admin

- Soạn **10 tình huống** cho mỗi tuổi (5–20)
- Mỗi lựa chọn: ± điểm Tình cảm & Lý trí
