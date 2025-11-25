# Next.js + Shopify Storefront API Integration

## Übersicht

Diese Anleitung beschreibt die vollständige Integration von Shopify Storefront API in das sitNeis Next.js Projekt.

---

## 1. Shopify API-Zugang einrichten

### Schritt 1: Shopify Custom App erstellen

1. **Shopify Admin** → Apps → Apps entwickeln
2. **Custom App erstellen** → Name: "Next.js Storefront"
3. **Storefront API konfigurieren** mit folgenden Scopes:
   - `unauthenticated_read_product_listings`
   - `unauthenticated_read_product_inventory`
   - `unauthenticated_read_product_tags`
   - `unauthenticated_write_checkouts`
   - `unauthenticated_read_checkouts`
   - `unauthenticated_read_content`
4. **API-Zugangsdaten sicher speichern** (niemals committen!)

---

## 2. Projektstruktur

```
eisstudio-nextjs/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   │
│   ├── shop/                          # Shop-Seiten
│   │   ├── page.tsx                   # Produktübersicht
│   │   ├── loading.tsx                # Loading State
│   │   ├── error.tsx                  # Error Boundary
│   │   │
│   │   ├── [handle]/                  # Dynamische Produktseite
│   │   │   ├── page.tsx
│   │   │   └── loading.tsx
│   │   │
│   │   ├── collections/               # Kollektionen
│   │   │   ├── page.tsx
│   │   │   └── [handle]/
│   │   │       └── page.tsx
│   │   │
│   │   ├── cart/                      # Warenkorb
│   │   │   └── page.tsx
│   │   │
│   │   └── checkout/                  # Checkout-Weiterleitung
│   │       └── page.tsx
│   │
│   └── api/                           # API Routes (optional)
│       └── revalidate/
│           └── route.ts
│
├── lib/
│   └── shopify/
│       ├── index.ts                   # Haupt-Export
│       ├── client.ts                  # Shopify Client
│       ├── queries.ts                 # GraphQL Queries
│       ├── mutations.ts               # GraphQL Mutations
│       ├── types.ts                   # TypeScript Types
│       └── utils.ts                   # Helper Functions
│
├── components/
│   └── shop/
│       ├── ProductCard.tsx            # Produktkarte
│       ├── ProductGrid.tsx            # Produktraster
│       ├── ProductDetails.tsx         # Produktdetails
│       ├── ProductGallery.tsx         # Bildergalerie
│       ├── VariantSelector.tsx        # Varianten-Auswahl
│       ├── AddToCartButton.tsx        # Warenkorb-Button
│       ├── CartDrawer.tsx             # Warenkorb-Sidebar
│       ├── CartItem.tsx               # Warenkorb-Eintrag
│       ├── CartSummary.tsx            # Zusammenfassung
│       ├── CollectionCard.tsx         # Kollektion-Karte
│       └── PriceDisplay.tsx           # Preisanzeige
│
├── context/
│   └── CartContext.tsx                # Warenkorb State
│
├── hooks/
│   ├── useCart.ts                     # Warenkorb Hook
│   ├── useProduct.ts                  # Produkt Hook
│   └── useShopify.ts                  # Allgemeiner Hook
│
├── .env.local                         # Umgebungsvariablen (NICHT COMMITTEN!)
├── .env.example                       # Beispiel für Team
└── next.config.ts
```

---

## 3. Installation

```bash
npm install graphql graphql-request
```

---

## 4. Umgebungsvariablen

### .env.local (NICHT COMMITTEN!)

```env
# Shopify Storefront API
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=dein-shop.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=xxxxx
SHOPIFY_ADMIN_ACCESS_TOKEN=xxxxx
NEXT_PUBLIC_SHOPIFY_API_VERSION=2024-01
```

### .env.example (FÜR GIT)

```env
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=
SHOPIFY_ADMIN_ACCESS_TOKEN=
NEXT_PUBLIC_SHOPIFY_API_VERSION=2024-01
```

### .gitignore ergänzen

```
.env.local
.env*.local
```

---

## 5. Implementierung

### 5.1 TypeScript Types (lib/shopify/types.ts)

```typescript
export interface ShopifyImage {
  url: string;
  altText: string | null;
  width: number;
  height: number;
}

export interface ShopifyPrice {
  amount: string;
  currencyCode: string;
}

export interface ShopifyProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: { name: string; value: string }[];
  price: ShopifyPrice;
  compareAtPrice: ShopifyPrice | null;
  image: ShopifyImage | null;
}

export interface ShopifyProduct {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  availableForSale: boolean;
  featuredImage: ShopifyImage | null;
  images: ShopifyImage[];
  options: { id: string; name: string; values: string[] }[];
  variants: ShopifyProductVariant[];
  priceRange: {
    minVariantPrice: ShopifyPrice;
    maxVariantPrice: ShopifyPrice;
  };
  tags: string[];
  productType: string;
  vendor: string;
}

export interface ShopifyCollection {
  id: string;
  handle: string;
  title: string;
  description: string;
  image: ShopifyImage | null;
  products: ShopifyProduct[];
}

export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: ShopifyPrice;
    totalAmount: ShopifyPrice;
    totalTaxAmount: ShopifyPrice | null;
  };
  lines: CartLine[];
}

export interface CartLine {
  id: string;
  quantity: number;
  cost: { totalAmount: ShopifyPrice };
  merchandise: {
    id: string;
    title: string;
    selectedOptions: { name: string; value: string }[];
    product: {
      id: string;
      handle: string;
      title: string;
      featuredImage: ShopifyImage | null;
    };
    price: ShopifyPrice;
  };
}
```

### 5.2 Shopify Client (lib/shopify/client.ts)

```typescript
const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!;
const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!;
const apiVersion = process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION || '2024-01';

const endpoint = `https://${domain}/api/${apiVersion}/graphql.json`;

export async function shopifyFetch<T>({
  query,
  variables,
  cache = 'force-cache',
  tags,
}: {
  query: string;
  variables?: Record<string, unknown>;
  cache?: RequestCache;
  tags?: string[];
}): Promise<T> {
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
      },
      body: JSON.stringify({ query, variables }),
      cache,
      next: tags ? { tags } : undefined,
    });

    if (!response.ok) {
      throw new Error(`Shopify API error: ${response.status}`);
    }

    const json = await response.json();

    if (json.errors) {
      throw new Error(json.errors[0].message);
    }

    return json.data;
  } catch (error) {
    console.error('Shopify Fetch Error:', error);
    throw error;
  }
}
```

### 5.3 GraphQL Queries (lib/shopify/queries.ts)

```typescript
const PRODUCT_FRAGMENT = `
  fragment ProductFragment on Product {
    id
    handle
    title
    description
    descriptionHtml
    availableForSale
    productType
    vendor
    tags
    featuredImage {
      url
      altText
      width
      height
    }
    images(first: 10) {
      edges {
        node {
          url
          altText
          width
          height
        }
      }
    }
    options {
      id
      name
      values
    }
    priceRange {
      minVariantPrice { amount currencyCode }
      maxVariantPrice { amount currencyCode }
    }
    variants(first: 100) {
      edges {
        node {
          id
          title
          availableForSale
          selectedOptions { name value }
          price { amount currencyCode }
          compareAtPrice { amount currencyCode }
          image { url altText width height }
        }
      }
    }
  }
`;

export const GET_PRODUCTS = `
  ${PRODUCT_FRAGMENT}
  query GetProducts($first: Int = 20) {
    products(first: $first, sortKey: BEST_SELLING) {
      edges { node { ...ProductFragment } }
      pageInfo { hasNextPage endCursor }
    }
  }
`;

export const GET_PRODUCT_BY_HANDLE = `
  ${PRODUCT_FRAGMENT}
  query GetProductByHandle($handle: String!) {
    product(handle: $handle) { ...ProductFragment }
  }
`;

export const GET_COLLECTIONS = `
  query GetCollections($first: Int = 10) {
    collections(first: $first) {
      edges {
        node {
          id handle title description
          image { url altText width height }
        }
      }
    }
  }
`;

export const GET_CART = `
  query GetCart($cartId: ID!) {
    cart(id: $cartId) {
      id checkoutUrl totalQuantity
      cost {
        subtotalAmount { amount currencyCode }
        totalAmount { amount currencyCode }
        totalTaxAmount { amount currencyCode }
      }
      lines(first: 100) {
        edges {
          node {
            id quantity
            cost { totalAmount { amount currencyCode } }
            merchandise {
              ... on ProductVariant {
                id title
                selectedOptions { name value }
                product {
                  id handle title
                  featuredImage { url altText width height }
                }
                price { amount currencyCode }
              }
            }
          }
        }
      }
    }
  }
`;
```

### 5.4 GraphQL Mutations (lib/shopify/mutations.ts)

```typescript
export const CREATE_CART = `
  mutation CreateCart($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id checkoutUrl totalQuantity
        cost { subtotalAmount { amount currencyCode } totalAmount { amount currencyCode } }
        lines(first: 100) { edges { node { id quantity } } }
      }
      userErrors { field message }
    }
  }
`;

export const ADD_TO_CART = `
  mutation AddToCart($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id checkoutUrl totalQuantity
        cost { subtotalAmount { amount currencyCode } totalAmount { amount currencyCode } }
        lines(first: 100) { edges { node { id quantity } } }
      }
      userErrors { field message }
    }
  }
`;

export const UPDATE_CART_LINES = `
  mutation UpdateCartLines($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart { id totalQuantity cost { totalAmount { amount currencyCode } } }
      userErrors { field message }
    }
  }
`;

export const REMOVE_FROM_CART = `
  mutation RemoveFromCart($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart { id totalQuantity cost { totalAmount { amount currencyCode } } }
      userErrors { field message }
    }
  }
`;
```

---

## 6. Datenlade-Strategien

| Methode | Verwendung | Cache-Einstellung |
|---------|-----------|-------------------|
| **SSG** (Static) | Produktlisten, Produktseiten | `revalidate: 3600` |
| **SSR** (Server) | Warenkorb, Checkout | `cache: 'no-store'` |
| **ISR** (Incremental) | Häufig geänderte Daten | `revalidate: 60` |
| **Client** | Warenkorb-Updates | React State + API |

---

## 7. Fehlerbehandlung & Rate Limits

### Retry-Logik

```typescript
async function shopifyFetchWithRetry<T>(options, retries = 3): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      return await shopifyFetch<T>(options);
    } catch (error: any) {
      if (error.message?.includes('429') && i < retries - 1) {
        await new Promise((r) => setTimeout(r, 1000 * (i + 1)));
        continue;
      }
      throw error;
    }
  }
  throw new Error('Max retries reached');
}
```

### Shopify Rate Limits

- **Storefront API**: 100 Requests/Sekunde (großzügig)
- **Admin API**: Bucket-basiert (40 Punkte, 2/Sekunde regeneriert)

---

## 8. Performance-Tipps

1. **Caching nutzen**: ISR mit `revalidate` für Produktdaten
2. **Bilder optimieren**: Next.js Image mit Shopify CDN
3. **GraphQL Fragments**: Wiederverwendbare Queries
4. **Pagination**: Nicht alle Produkte auf einmal laden
5. **Client-side Cart**: LocalStorage für Cart-ID

---

## 9. Deployment (DSGVO-konform)

### Empfohlene Hosting-Anbieter (EU/Deutschland)

| Anbieter | Standort | Typ | Preis ab |
|----------|----------|-----|----------|
| **Hetzner Cloud** | Deutschland | VPS + Docker | ~4€/Monat |
| **netcup** | Deutschland | VPS | ~3€/Monat |
| **IONOS** | Deutschland | VPS/Managed | ~1€/Monat |
| **Scaleway** | Frankreich | Cloud | ~7€/Monat |
| **OVH** | Frankreich | VPS | ~4€/Monat |

### Option A: Hetzner Cloud mit Coolify (Empfohlen)

**Coolify** ist eine selbst-gehostete, Open-Source Alternative zu Vercel.

```bash
# 1. Hetzner Cloud Server erstellen (CX21 oder höher)
# 2. SSH auf Server verbinden
ssh root@deine-server-ip

# 3. Coolify installieren
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash

# 4. Coolify Dashboard öffnen: http://deine-server-ip:8000
# 5. GitHub/GitLab Repository verbinden
# 6. Next.js Projekt deployen
```

### Option B: Docker auf Hetzner/netcup

**Dockerfile für Next.js:**

```dockerfile
FROM node:20-alpine AS base

# Dependencies
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000

CMD ["node", "server.js"]
```

**next.config.ts anpassen:**

```typescript
const nextConfig = {
  output: 'standalone',
  // ... andere Einstellungen
};
```

**docker-compose.yml:**

```yaml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=${NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}
      - NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=${NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN}
      - NEXT_PUBLIC_SHOPIFY_API_VERSION=${NEXT_PUBLIC_SHOPIFY_API_VERSION}
    restart: unless-stopped

  # Optional: Nginx als Reverse Proxy
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - /etc/letsencrypt:/etc/letsencrypt
    depends_on:
      - web
    restart: unless-stopped
```

### Option C: Statischer Export + Webspace

Falls keine Server-Funktionen benötigt werden:

```typescript
// next.config.ts
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
};
```

```bash
npm run build
# Output in /out Ordner → per FTP auf Webspace hochladen
```

### Umgebungsvariablen setzen

**Bei Coolify:** Im Dashboard unter Environment Variables

**Bei Docker:** In `.env` Datei oder docker-compose.yml

**Bei SSH/Server:**
```bash
# /etc/environment oder ~/.bashrc
export NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=dein-shop.myshopify.com
export NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=xxxxx
```

### Domain verbinden

1. **A-Record** auf Server-IP setzen
2. **SSL mit Let's Encrypt:**
```bash
# Mit Certbot
sudo apt install certbot
sudo certbot certonly --standalone -d deine-domain.de

# Oder in Coolify: Automatisch via UI
```

### DSGVO-Checkliste für Hosting

- [x] Server in EU (Deutschland/Frankreich)
- [x] AV-Vertrag mit Hoster abschließen
- [x] Keine US-Cloud-Dienste ohne Standardvertragsklauseln
- [x] SSL/TLS aktiviert
- [x] Datenschutzerklärung anpassen
- [x] Cookie-Banner implementieren (falls Cookies genutzt)

---

## 10. Checkliste

- [ ] Shopify Custom App erstellt
- [ ] API Scopes konfiguriert
- [ ] `.env.local` erstellt (NICHT COMMITTEN!)
- [ ] `.env.example` für Team erstellt
- [ ] `lib/shopify/` Ordner mit allen Dateien
- [ ] `context/CartContext.tsx` implementiert
- [ ] Komponenten erstellt
- [ ] Shop-Seiten erstellt
- [ ] Layout mit CartProvider
- [ ] Lokal getestet
- [ ] DSGVO-konformen Hoster gewählt (Hetzner/netcup/IONOS)
- [ ] AV-Vertrag mit Hoster abgeschlossen
- [ ] Deployment auf EU-Server
- [ ] Umgebungsvariablen auf Server konfiguriert
- [ ] SSL-Zertifikat eingerichtet
- [ ] Datenschutzerklärung aktualisiert

---

## Sicherheitshinweise

1. **NIEMALS** API-Tokens in Git committen
2. `.env.local` ist in `.gitignore`
3. `NEXT_PUBLIC_*` Variablen sind im Browser sichtbar - nur Storefront Token verwenden
4. Admin-Token nur serverseitig nutzen

---

*Letzte Aktualisierung: November 2024*
