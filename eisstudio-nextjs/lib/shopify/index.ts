// Shopify Storefront API - Haupt-Export

import { shopifyFetch } from './client';
import {
  GET_PRODUCTS,
  GET_PRODUCT_BY_HANDLE,
  GET_COLLECTION_BY_HANDLE,
  GET_COLLECTIONS,
  GET_CART,
  GET_BLOG_ARTICLES,
  GET_BLOG_ARTICLE,
} from './queries';
import {
  CREATE_CART,
  ADD_TO_CART,
  UPDATE_CART_LINES,
  REMOVE_FROM_CART,
} from './mutations';
import type {
  ShopifyImage,
  ShopifyProductVariant,
  ShopifyProduct,
  ShopifyCollection,
  ShopifyCart,
  CartLine,
  ShopifyProductsResponse,
  ShopifyProductResponse,
  ShopifyCollectionsResponse,
  ShopifyCollectionResponse,
  ShopifyCartResponse,
  CartCreateResponse,
  CartLinesAddResponse,
  CartLinesUpdateResponse,
  CartLinesRemoveResponse,
  ShopifyArticle,
  ShopifyBlogArticlesResponse,
  ShopifyBlogArticleResponse,
} from './types';

// ============================================
// HELPER FUNCTIONS
// ============================================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function reshapeProduct(product: any): ShopifyProduct {
  return {
    ...product,
    images: product.images?.edges?.map((e: { node: ShopifyImage }) => e.node) || [],
    variants: product.variants?.edges?.map((e: { node: ShopifyProductVariant }) => e.node) || [],
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function reshapeProducts(edges: any[]): ShopifyProduct[] {
  return edges.map(({ node }) => reshapeProduct(node));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function reshapeCart(cart: any): ShopifyCart {
  return {
    ...cart,
    lines: cart.lines?.edges?.map((e: { node: CartLine }) => e.node) || [],
  };
}

// ============================================
// PRODUCTS
// ============================================

export async function getProducts(first = 20): Promise<ShopifyProduct[]> {
  const data = await shopifyFetch<ShopifyProductsResponse>({
    query: GET_PRODUCTS,
    variables: { first },
    tags: ['products'],
  });

  return reshapeProducts(data.products.edges);
}

export async function getProductByHandle(handle: string): Promise<ShopifyProduct | null> {
  const data = await shopifyFetch<ShopifyProductResponse>({
    query: GET_PRODUCT_BY_HANDLE,
    variables: { handle },
    tags: ['products', handle],
  });

  if (!data.product) return null;

  return reshapeProduct(data.product);
}

// ============================================
// COLLECTIONS
// ============================================

export async function getCollections(): Promise<ShopifyCollection[]> {
  const data = await shopifyFetch<ShopifyCollectionsResponse>({
    query: GET_COLLECTIONS,
    tags: ['collections'],
  });

  return data.collections.edges.map(({ node }) => node);
}

export async function getCollectionByHandle(handle: string): Promise<ShopifyCollection | null> {
  const data = await shopifyFetch<ShopifyCollectionResponse>({
    query: GET_COLLECTION_BY_HANDLE,
    variables: { handle },
    tags: ['collections', handle],
  });

  if (!data.collection) return null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const collection = data.collection as any;

  return {
    ...collection,
    products: reshapeProducts(collection.products?.edges || []),
  };
}

// ============================================
// CART
// ============================================

export async function createCart(): Promise<ShopifyCart> {
  const data = await shopifyFetch<CartCreateResponse>({
    query: CREATE_CART,
    variables: { input: {} },
    cache: 'no-store',
  });

  if (data.cartCreate.userErrors.length > 0) {
    throw new Error(data.cartCreate.userErrors[0].message);
  }

  return reshapeCart(data.cartCreate.cart);
}

export async function getCart(cartId: string): Promise<ShopifyCart | null> {
  const data = await shopifyFetch<ShopifyCartResponse>({
    query: GET_CART,
    variables: { cartId },
    cache: 'no-store',
  });

  if (!data.cart) return null;
  return reshapeCart(data.cart);
}

export async function addToCart(
  cartId: string,
  lines: { merchandiseId: string; quantity: number }[]
): Promise<ShopifyCart> {
  const data = await shopifyFetch<CartLinesAddResponse>({
    query: ADD_TO_CART,
    variables: { cartId, lines },
    cache: 'no-store',
  });

  if (data.cartLinesAdd.userErrors.length > 0) {
    throw new Error(data.cartLinesAdd.userErrors[0].message);
  }

  return reshapeCart(data.cartLinesAdd.cart);
}

export async function updateCartLines(
  cartId: string,
  lines: { id: string; quantity: number }[]
): Promise<ShopifyCart> {
  const data = await shopifyFetch<CartLinesUpdateResponse>({
    query: UPDATE_CART_LINES,
    variables: { cartId, lines },
    cache: 'no-store',
  });

  if (data.cartLinesUpdate.userErrors.length > 0) {
    throw new Error(data.cartLinesUpdate.userErrors[0].message);
  }

  return reshapeCart(data.cartLinesUpdate.cart);
}

export async function removeFromCart(cartId: string, lineIds: string[]): Promise<ShopifyCart> {
  const data = await shopifyFetch<CartLinesRemoveResponse>({
    query: REMOVE_FROM_CART,
    variables: { cartId, lineIds },
    cache: 'no-store',
  });

  if (data.cartLinesRemove.userErrors.length > 0) {
    throw new Error(data.cartLinesRemove.userErrors[0].message);
  }

  return reshapeCart(data.cartLinesRemove.cart);
}

// ============================================
// BLOG
// ============================================

const BLOG_HANDLE = 'reports'; // Der Handle deines Blogs in Shopify

export async function getBlogArticles(first = 20): Promise<ShopifyArticle[]> {
  const data = await shopifyFetch<ShopifyBlogArticlesResponse>({
    query: GET_BLOG_ARTICLES,
    variables: { blogHandle: BLOG_HANDLE, first },
    tags: ['blog'],
  });

  if (!data.blog) return [];

  return data.blog.articles.edges.map(({ node }) => node);
}

export async function getBlogArticle(articleHandle: string): Promise<ShopifyArticle | null> {
  const data = await shopifyFetch<ShopifyBlogArticleResponse>({
    query: GET_BLOG_ARTICLE,
    variables: { blogHandle: BLOG_HANDLE, articleHandle },
    tags: ['blog', articleHandle],
  });

  if (!data.blog?.articleByHandle) return null;

  return data.blog.articleByHandle;
}

// Re-export types and utils
export * from './types';
export * from './utils';
