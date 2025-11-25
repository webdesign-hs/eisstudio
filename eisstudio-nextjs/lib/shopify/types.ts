// Shopify Storefront API Types

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
  selectedOptions: {
    name: string;
    value: string;
  }[];
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
  options: {
    id: string;
    name: string;
    values: string[];
  }[];
  variants: ShopifyProductVariant[];
  priceRange: {
    minVariantPrice: ShopifyPrice;
    maxVariantPrice: ShopifyPrice;
  };
  tags: string[];
  productType: string;
  vendor: string;
  createdAt: string;
  updatedAt: string;
  category: {
    id: string;
    name: string;
  } | null;
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
  cost: {
    totalAmount: ShopifyPrice;
  };
  merchandise: {
    id: string;
    title: string;
    selectedOptions: {
      name: string;
      value: string;
    }[];
    product: {
      id: string;
      handle: string;
      title: string;
      featuredImage: ShopifyImage | null;
    };
    price: ShopifyPrice;
  };
}

// API Response Types
export interface ShopifyProductsResponse {
  products: {
    edges: { node: ShopifyProduct }[];
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string | null;
    };
  };
}

export interface ShopifyProductResponse {
  product: ShopifyProduct | null;
}

export interface ShopifyCollectionsResponse {
  collections: {
    edges: { node: ShopifyCollection }[];
  };
}

export interface ShopifyCollectionResponse {
  collection: ShopifyCollection | null;
}

export interface ShopifyCartResponse {
  cart: ShopifyCart | null;
}

export interface CartCreateResponse {
  cartCreate: {
    cart: ShopifyCart;
    userErrors: { field: string; message: string }[];
  };
}

export interface CartLinesAddResponse {
  cartLinesAdd: {
    cart: ShopifyCart;
    userErrors: { field: string; message: string }[];
  };
}

export interface CartLinesUpdateResponse {
  cartLinesUpdate: {
    cart: ShopifyCart;
    userErrors: { field: string; message: string }[];
  };
}

export interface CartLinesRemoveResponse {
  cartLinesRemove: {
    cart: ShopifyCart;
    userErrors: { field: string; message: string }[];
  };
}

// Blog Types
export interface ShopifyArticle {
  id: string;
  handle: string;
  title: string;
  excerpt: string | null;
  excerptHtml: string | null;
  contentHtml: string;
  publishedAt: string;
  tags: string[];
  image: ShopifyImage | null;
  author: {
    name: string;
  } | null;
}

export interface ShopifyBlog {
  id: string;
  handle: string;
  title: string;
  articles: ShopifyArticle[];
}

export interface ShopifyBlogArticlesResponse {
  blog: {
    id: string;
    handle: string;
    title: string;
    articles: {
      edges: { node: ShopifyArticle }[];
    };
  } | null;
}

export interface ShopifyBlogArticleResponse {
  blog: {
    articleByHandle: ShopifyArticle | null;
  } | null;
}
