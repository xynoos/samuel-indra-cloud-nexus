
# SamuelIndraBastian Cloud Backend Server

Backend server untuk SamuelIndraBastian Cloud Storage dengan Gmail SMTP untuk verifikasi email.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Start Server
```bash
npm start
```

Server akan berjalan di: `http://localhost:3001`

## 📧 Gmail SMTP Configuration

Server sudah dikonfigurasi dengan:
- **Gmail User**: `renungankristensite@gmail.com`
- **App Password**: `zglq snms qjfs wtfy`
- **SMTP Host**: `smtp.gmail.com`
- **SMTP Port**: `587`

## 🔍 Available Endpoints

### Health Check
```
GET http://localhost:3001/health
```

### Send OTP Email
```
POST http://localhost:3001/api/send-otp-email
Content-Type: application/json

{
  "email": "user@example.com",
  "fullName": "User Name",
  "otp": "123456"
}
```

### Verify OTP
```
POST http://localhost:3001/api/verify-otp
Content-Type: application/json

{
  "otp": "123456",
  "expectedOtp": "123456"
}
```

### Test Gmail SMTP
```
POST http://localhost:3001/api/test-email
```

## 🐛 Troubleshooting

### Error: ECONNREFUSED
- Pastikan server backend berjalan
- Cek port 3001 tidak digunakan aplikasi lain

### Email Tidak Terkirim
- Verifikasi Gmail App Password
- Cek koneksi internet
- Test endpoint `/api/test-email`

### CORS Error
- Server sudah dikonfigurasi untuk development dan production
- Pastikan origin request sesuai dengan CORS configuration

## 📋 Environment Requirements

- Node.js >= 16.x
- NPM >= 8.x
- Internet connection untuk Gmail SMTP

## 🔐 Security

- Gmail App Password disimpan di server
- CORS dikonfigurasi untuk domain yang diizinkan
- Rate limiting akan ditambahkan di versi selanjutnya
