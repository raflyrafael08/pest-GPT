# Deploy ke Render + Supabase tanpa Docker

Arsitektur untuk uji coba:

GitHub → Render Web (frontend) → Render Web (API) → Supabase PostgreSQL

## 1. Buat database Supabase

1. Buka https://supabase.com/
2. Login.
3. Buat project baru.
4. Tunggu database selesai dibuat.
5. Klik **Connect**.
6. Salin **Session pooler connection string** atau **Direct connection string**.
   - Untuk Render, gunakan connection string yang dapat dijangkau oleh environment Anda.
7. Simpan nilainya. Jangan pernah memasukkannya ke source code.

## 2. PostGIS

Untuk build ini, Prisma menyimpan latitude/longitude sebagai Decimal, jadi PostGIS tidak wajib diaktifkan hanya untuk menjalankan demo.

Jika kemudian kita menambahkan query geospatial PostGIS, aktifkan extension `postgis` dari Supabase Dashboard → Database → Extensions.

## 3. Upload source code ke GitHub

Gunakan repository yang berisi file pada ZIP ini. File penting baru untuk cloud deployment:

- `render.yaml`
- `DEPLOY_RENDER_SUPABASE.md`
- perubahan `apps/api/src/main.ts`
- perubahan `apps/web/lib/api.ts`

Jangan commit file `.env` berisi password/database credential.

## 4. Hubungkan GitHub ke Render

1. Buka https://render.com/
2. Login dengan GitHub.
3. Pilih **New → Blueprint**.
4. Pilih repository `pest-control-platform`.
5. Render membaca `render.yaml`.
6. Anda akan melihat dua service:
   - `pest-control-api`
   - `pest-control-web`
7. Jalankan Blueprint.

Render memang mendukung monorepo dan Blueprint `render.yaml` untuk beberapa service dalam satu repository.

## 5. Isi DATABASE_URL API

Pada service `pest-control-api`:

**Environment → DATABASE_URL**

Masukkan connection string PostgreSQL dari Supabase.

Contoh format:

`postgresql://postgres.xxxxx:PASSWORD@aws-xxxxx.pooler.supabase.com:5432/postgres`

Gunakan nilai persis dari tombol **Connect** di Supabase.

## 6. Redeploy API

Setelah `DATABASE_URL` diisi:

**Manual Deploy → Deploy latest commit**

Render akan menjalankan:

1. `npm install`
2. Prisma generate
3. API build
4. `prisma db push`
5. seed demo account
6. API start

## 7. Cek API

Buka URL API Render:

`https://NAMA-API.onrender.com/api/v1/health`

Hasil yang benar kira-kira:

`{"status":"healthy","database":"healthy",...}`

## 8. Cek Web

Buka URL web Render:

`https://NAMA-WEB.onrender.com`

Frontend otomatis mengambil URL API Render melalui `render.yaml`.

## 9. Login demo

Admin:

- Username: `admin`
- Password: `Admin123!`

Technician:

- Username: `technician`
- Password: `Tech123!`

Segera ganti password demo setelah pengujian.

## 10. Catatan upload file

Build awal ini menyimpan upload ke filesystem lokal service API. Pada Render filesystem service biasa bukan tempat penyimpanan permanen untuk file operasional.

Untuk produksi, ganti penyimpanan upload ke Supabase Storage, S3, atau Cloudflare R2. Jangan mengandalkan filesystem instance Render sebagai arsip permanen Service Report.

## 11. Catatan Render Free

Service Free dapat mengalami cold start/sleep. Itu cocok untuk uji coba, bukan deployment operasional 24/7.

Untuk GPS near-real-time dan sistem field operation produksi, gunakan instance yang tidak sleep serta storage/database yang sesuai.
