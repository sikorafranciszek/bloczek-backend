# Instrukcja konfiguracji Cloudflare R2

## 1. Tworzenie konta Cloudflare R2

1. Przejdź na stronę [Cloudflare](https://cloudflare.com) i załóż konto
2. W dashboard Cloudflare przejdź do sekcji **R2 Object Storage**
3. Kliknij **Create bucket** i podaj nazwę bucketa (np. `bloczek-products`)

## 2. Generowanie kluczy API

1. Przejdź do **R2** → **Manage R2 API tokens**
2. Kliknij **Create API token**
3. Ustaw uprawnienia:
   - **Permissions**: Object Read & Write
   - **Account Resources**: Include - Specific account - [twoje konto]
   - **Zone Resources**: Include - All zones
4. Skopiuj wygenerowane klucze:
   - **Access Key ID**
   - **Secret Access Key**

## 3. Konfiguracja domeny (opcjonalne ale zalecane)

1. W ustawieniach bucketa kliknij **Settings**
2. W sekcji **Custom Domains** dodaj swoją domenę (np. `cdn.twoja-domena.com`)
3. Skonfiguruj CNAME w DNS:
   ```
   cdn.twoja-domena.com CNAME twoj-bucket.r2.dev
   ```

## 4. Konfiguracja pliku .env

Skopiuj wartości do swojego pliku `.env`:

```bash
# Konfiguracja Cloudflare R2
CLOUDFLARE_R2_ACCESS_KEY_ID=your-access-key-id-here
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your-secret-access-key-here
CLOUDFLARE_R2_BUCKET=bloczek-products
CLOUDFLARE_R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
CLOUDFLARE_R2_URL=https://cdn.twoja-domena.com
```

### Jak znaleźć Account ID:
1. W dashboard Cloudflare, po prawej stronie znajdziesz **Account ID**
2. Skopiuj go i użyj w endpoint URL

### Przykładowe wartości:
```bash
CLOUDFLARE_R2_ACCESS_KEY_ID=f7a8b9c0d1e2f3g4h5i6j7k8l9m0n1o2
CLOUDFLARE_R2_SECRET_ACCESS_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0
CLOUDFLARE_R2_BUCKET=bloczek-products
CLOUDFLARE_R2_ENDPOINT=https://abc123def456.r2.cloudflarestorage.com
CLOUDFLARE_R2_URL=https://cdn.bloczek.pl
```

## 5. Testowanie konfiguracji

Po skonfigurowaniu .env, możesz przetestować upload:

1. Przejdź do formularza dodawania produktu: `/products/create`
2. Wypełnij formularz i spróbuj zauploadować obraz
3. Sprawdź czy obraz pojawia się w Cloudflare R2 dashboard

## 6. Bezpieczeństwo

### CORS (jeśli potrzebny):
W ustawieniach bucketa ustaw CORS policy:
```json
[
  {
    "AllowedOrigins": ["https://twoja-domena.com"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedHeaders": ["*"],
    "MaxAgeSeconds": 3000
  }
]
```

### Uprawnienia bucketa:
- Ustaw bucket jako **Private** dla bezpieczeństwa
- Dostęp do plików będzie przez signed URLs lub custom domain

## 7. Koszty

Cloudflare R2 oferuje:
- **10 GB storage** - darmowe miesięcznie
- **1 milion Class A operations** (PUT, POST) - darmowe
- **10 milionów Class B operations** (GET, HEAD) - darmowe
- **Egress (wychodzący transfer)** - darmowy

Doskonałe dla małych/średnich projektów!
