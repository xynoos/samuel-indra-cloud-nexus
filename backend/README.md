
# SamuelIndraBastian Cloud Storage - Backend

Backend server untuk aplikasi SamuelIndraBastian Cloud Storage dengan fitur:

## 🚀 Fitur

- **Email Verifikasi**: SMTP Gmail dengan Nodemailer
- **YouTube Downloader**: yt-dlp integration untuk download MP3/MP4
- **File Upload**: Endpoint untuk upload ke ImageKit
- **Admin Panel**: Log aktivitas dan statistik

## 📦 Instalasi

```bash
cd backend
npm install
```

## 🔧 Konfigurasi

### Gmail SMTP
- Email: storagepagexyn@gmail.com
- App Password: zglq snms qjfs wtfy

### YouTube Downloader
Pastikan `yt-dlp` dan `ffmpeg` terinstall di sistem:

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install yt-dlp ffmpeg

# Windows (via chocolatey)
choco install yt-dlp ffmpeg

# macOS (via homebrew)
brew install yt-dlp ffmpeg
```

## 🚦 Menjalankan Server

```bash
# Development
npm run dev

# Production
npm start
```

Server akan berjalan di `http://localhost:3001`

## 📚 API Endpoints

### Email Verification
- `POST /api/send-verification` - Kirim kode OTP ke email
- `POST /api/verify-otp` - Verifikasi kode OTP

### YouTube Downloader
- `POST /download` - Download video/audio dari YouTube URL

### Health Check
- `GET /health` - Status server

## 📁 Struktur File

```
backend/
├── server.js          # Main server file
├── package.json       # Dependencies
├── downloads/         # Downloaded files (auto-created)
└── README.md         # This file
```

## 🔒 Security Notes

- OTP disimpan dalam memory (gunakan Redis untuk production)
- File download disimpan sementara di folder `downloads/`
- Validasi input untuk mencegah directory traversal
- CORS dikonfigurasi untuk frontend

## 🐛 Troubleshooting

### Error: yt-dlp not found
```bash
npm install -g yt-dlp
# atau
pip install yt-dlp
```

### Error: ffmpeg not found
Install ffmpeg sesuai OS Anda (lihat bagian instalasi)

### Email tidak terkirim
- Pastikan Gmail App Password benar
- Periksa koneksi internet
- Aktifkan "Less secure app access" jika diperlukan
```
