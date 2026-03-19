# Deployment Guide: Render + Cloudflare

This repository is optimized for a **Multi-Platform Deployment** to get the best of both worlds:

## 1. Backend: [Render](https://dashboard.render.com/)
Render is used to host the **Django Core**, the **Database (PostgreSQL)**, and the **Static Files**.
- **Build Command**: `./build.sh`
- **Start Command**: `gunicorn notesapp.wsgi`

## 2. Speed & Security: [Cloudflare](https://dash.cloudflare.com/)
Cloudflare should be used as your **DNS Provider** and **Proxy**.
- **Important**: Do **NOT** use Cloudflare Pages to "Deploy" this repo directly. Cloudflare Pages is for static sites, and it will fail to compile the Python/Django backend.
- **Instead**: Point your Cloudflare DNS (A or CNAME record) to your Render app's URL.

### Recommended Cloudflare Settings:
- **DNS**: Proxy status = `Proxied` (Orange Cloud).
- **SSL/TLS**: Set to `Full (strict)`.
- **Cache Rules**: Create a rule to cache `/static/*` for faster global delivery.

## Local Development
Run the server locally with:
```bash
python manage.py runserver
```
(Make sure to run `pip install -r requirements.txt` first).
