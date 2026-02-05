# HTTPS va WSS sozlashi (carento.tech)

## 1. Frontend (https://carento.tech)

- Sizda allaqachon ishlayapti.
- Build vaqtida `.env.production` dan `REACT_APP_API_URL`, `REACT_APP_API_GRAPHQL_URL`, `REACT_APP_API_WS` o‘qiladi.

## 2. Backend API va WebSocket (https://api.carento.tech)

Brauzer **HTTPS** sahifadan **ws://** ga ulanishni bloklaydi. Shuning uchun backend ham **HTTPS** orqali ochilishi va WebSocket **wss://** bo‘lishi kerak.

### Nginx misoli (API + WSS)

Serverda `api.carento.tech` uchun SSL sertifikat bo‘lishi va nginx quyidagicha proxy qilishi kerak:

```nginx
# api.carento.tech — GraphQL + WebSocket (wss)
server {
    listen 443 ssl http2;
    server_name api.carento.tech;

    ssl_certificate     /path/to/fullchain.pem;
    ssl_certificate_key /path/to/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:4027;   # backend container port (host)
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

- **GraphQL**: `https://api.carento.tech/graphql`
- **Rasmlar (uploads)**: `https://api.carento.tech/uploads/...`
- **WebSocket**: `wss://api.carento.tech` (nginx `Upgrade`/`Connection` tufayli wss ishlaydi)

### DNS

- `api.carento.tech` A yoki CNAME server IP ga (167.172.90.235 yoki yangi IP) yo‘naltirilgan bo‘lishi kerak.

## 3. O‘zgarishlardan keyin

1. `.env.production` da `REACT_APP_API_URL`, `REACT_APP_API_GRAPHQL_URL`, `REACT_APP_API_WS` — **https://api.carento.tech** va **wss://api.carento.tech**.
2. Frontendni qayta build qiling va deploy qiling.
3. Nginx konfiguratsiyasini yuklang: `sudo nginx -t && sudo systemctl reload nginx`.

Shundan keyin https://carento.tech da Mixed Content va WebSocket xatolari bo‘lmasligi kerak.
