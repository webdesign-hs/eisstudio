// Shopify Storefront API Client

const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!;
const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!;
const apiVersion = process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION || '2024-01';

const endpoint = `https://${domain}/api/${apiVersion}/graphql.json`;

// Check if running on server
const isServer = typeof window === 'undefined';

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
    // Only use cache and next options on server
    const fetchOptions: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
      },
      body: JSON.stringify({ query, variables }),
    };

    // Add server-only caching options
    if (isServer) {
      (fetchOptions as RequestInit & { cache?: RequestCache; next?: { tags: string[] } }).cache = cache;
      if (tags) {
        (fetchOptions as RequestInit & { next?: { tags: string[] } }).next = { tags };
      }
    }

    const response = await fetch(endpoint, fetchOptions);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Shopify API Error Response:', errorText);
      throw new Error(`Shopify API error: ${response.status} ${response.statusText}`);
    }

    const json = await response.json();

    if (json.errors) {
      console.error('Shopify GraphQL Errors:', json.errors);
      throw new Error(json.errors[0]?.message || 'Unknown Shopify error');
    }

    return json.data;
  } catch (error) {
    console.error('Shopify Fetch Error:', error);
    throw error;
  }
}

// Fetch mit Retry-Logik für Rate Limits
export async function shopifyFetchWithRetry<T>(
  options: Parameters<typeof shopifyFetch<T>>[0],
  retries = 3
): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      return await shopifyFetch<T>(options);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('429') && i < retries - 1) {
        // Rate limit - exponential backoff
        await new Promise((r) => setTimeout(r, 1000 * Math.pow(2, i)));
        continue;
      }
      throw error;
    }
  }
  throw new Error('Max retries reached');
}
