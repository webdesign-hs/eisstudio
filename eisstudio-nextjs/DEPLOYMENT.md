# Deployment Guide - das-eisstudio.de

## Domain-Struktur

```
das-eisstudio.de           → Production (Live für Kunden)
dev.das-eisstudio.de       → Staging (für Kunde zum Testen/Abnehmen)
```

---

## Git-Workflow

```
main Branch      → deployed auf das-eisstudio.de (Production)
dev Branch       → deployed auf dev.das-eisstudio.de (Staging)
```

**Ablauf:**
1. Lokal entwickeln
2. Push auf `dev` Branch → Kunde sieht Änderungen auf dev.das-eisstudio.de
3. Kunde gibt Freigabe
4. Merge `dev` → `main` → Live-Website wird aktualisiert

---

## Server-Anforderungen

### Empfohlen: IONOS VPS M
- **Preis:** 3€/Monat (24 Monate Vertrag)
- **Specs:** 4 vCores, 4 GB RAM, 120 GB NVMe
- **OS:** Ubuntu 24.04 LTS
- **Rechenzentrum:** Deutschland (DSGVO-konform)

### Warum VPS M?
| Komponente | RAM-Bedarf |
|------------|------------|
| Coolify | ~500MB |
| Next.js Production | ~300-500MB |
| Next.js Staging | ~300-500MB |
| Build-Prozess (kurzzeitig) | ~1-2GB |
| **Gesamt** | ~2-3.5GB |

VPS S (2GB) wäre zu knapp, VPS M (4GB) bietet genug Puffer.

---

## DNS-Einstellungen bei IONOS

Nach VPS-Bestellung, IP-Adresse notieren und folgende Records setzen:

```
Typ       Name                    Wert              TTL
A         das-eisstudio.de        [VPS-IP]          3600
A         dev.das-eisstudio.de    [VPS-IP]          3600
A         www.das-eisstudio.de    [VPS-IP]          3600
```

---

## Coolify Installation

### 1. Per SSH auf Server verbinden
```bash
ssh root@[VPS-IP]
```

### 2. System aktualisieren
```bash
apt update && apt upgrade -y
```

### 3. Coolify installieren (1 Befehl)
```bash
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash
```

### 4. Coolify öffnen
```
http://[VPS-IP]:8000
```
- Account erstellen
- Server konfigurieren

---

## Apps in Coolify einrichten

### Production App
1. New Resource → Public Repository (oder GitHub verbinden)
2. Repository: [dein-repo-url]
3. Branch: `main`
4. Build Pack: Nixpacks (auto-detect)
5. Domain: `das-eisstudio.de`
6. Environment Variables:
   ```
   NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=pnvi09-zf.myshopify.com
   SHOPIFY_STOREFRONT_ACCESS_TOKEN=[dein-token]
   ```

### Staging App
1. New Resource → Public Repository
2. Repository: [dein-repo-url]
3. Branch: `dev`
4. Build Pack: Nixpacks
5. Domain: `dev.das-eisstudio.de`
6. Environment Variables: (gleiche wie Production)

---

## SSL-Zertifikate (Let's Encrypt)

In Coolify für jede App:
1. App Settings → SSL
2. "Generate SSL Certificate" aktivieren
3. Let's Encrypt wird automatisch eingerichtet

---

## Passwortschutz für Staging (Optional)

Damit nicht jeder die Dev-Seite sehen kann:

In Coolify → App Settings → Basic Auth:
```
Username: eisstudio
Password: [sicheres-passwort]
```

Kunde bekommt diese Zugangsdaten zum Testen.

---

## Auto-Deploy einrichten

### Mit GitHub Webhook:
1. In Coolify: App → Webhooks → URL kopieren
2. In GitHub: Repository → Settings → Webhooks → Add webhook
3. Payload URL: [Coolify Webhook URL]
4. Events: Push events

Jetzt deployed Coolify automatisch bei jedem Push!

---

## Deployment Checkliste

### Vor dem ersten Deployment:
- [ ] VPS bestellt (IONOS VPS M, Ubuntu 24.04)
- [ ] SSH-Zugang funktioniert
- [ ] DNS Records gesetzt (A-Records für beide Domains)
- [ ] Coolify installiert
- [ ] Git Repository erstellt mit `main` und `dev` Branch

### In Coolify:
- [ ] Production App erstellt (main → das-eisstudio.de)
- [ ] Staging App erstellt (dev → dev.das-eisstudio.de)
- [ ] Environment Variables gesetzt
- [ ] SSL Zertifikate aktiviert
- [ ] (Optional) Basic Auth für Staging

### Nach Deployment:
- [ ] Production testen: https://das-eisstudio.de
- [ ] Staging testen: https://dev.das-eisstudio.de
- [ ] Shop funktioniert: https://das-eisstudio.de/shop
- [ ] Warenkorb funktioniert
- [ ] Checkout leitet zu Shopify weiter

---

## Nützliche Befehle

### SSH auf Server
```bash
ssh root@[VPS-IP]
```

### Coolify Logs anzeigen
```bash
docker logs -f coolify
```

### Server Ressourcen prüfen
```bash
htop
```

### Coolify neu starten
```bash
docker restart coolify
```

---

## Kosten-Übersicht

| Posten | Kosten |
|--------|--------|
| IONOS VPS M (24 Monate) | 3€/Monat |
| Domain das-eisstudio.de | ~12€/Jahr |
| SSL (Let's Encrypt) | Kostenlos |
| Coolify | Kostenlos (Open Source) |
| **Gesamt** | ~4€/Monat |

---

## Support & Hilfe

- Coolify Docs: https://coolify.io/docs
- Next.js Docs: https://nextjs.org/docs
- IONOS Support: https://www.ionos.de/hilfe/
