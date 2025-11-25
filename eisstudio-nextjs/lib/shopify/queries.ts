// GraphQL Queries für Shopify Storefront API

// Fragment für wiederverwendbare Produkt-Felder
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
    createdAt
    updatedAt
    category {
      id
      name
    }
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
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    variants(first: 100) {
      edges {
        node {
          id
          title
          availableForSale
          selectedOptions {
            name
            value
          }
          price {
            amount
            currencyCode
          }
          compareAtPrice {
            amount
            currencyCode
          }
          image {
            url
            altText
            width
            height
          }
        }
      }
    }
  }
`;

// Alle Produkte laden
export const GET_PRODUCTS = `
  ${PRODUCT_FRAGMENT}
  query GetProducts($first: Int = 20, $sortKey: ProductSortKeys = BEST_SELLING) {
    products(first: $first, sortKey: $sortKey) {
      edges {
        node {
          ...ProductFragment
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

// Einzelnes Produkt nach Handle
export const GET_PRODUCT_BY_HANDLE = `
  ${PRODUCT_FRAGMENT}
  query GetProductByHandle($handle: String!) {
    product(handle: $handle) {
      ...ProductFragment
    }
  }
`;

// Alle Kollektionen
export const GET_COLLECTIONS = `
  query GetCollections($first: Int = 10) {
    collections(first: $first) {
      edges {
        node {
          id
          handle
          title
          description
          image {
            url
            altText
            width
            height
          }
        }
      }
    }
  }
`;

// Kollektion mit Produkten
export const GET_COLLECTION_BY_HANDLE = `
  ${PRODUCT_FRAGMENT}
  query GetCollectionByHandle($handle: String!, $first: Int = 20) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      image {
        url
        altText
        width
        height
      }
      products(first: $first) {
        edges {
          node {
            ...ProductFragment
          }
        }
      }
    }
  }
`;

// Alle Blog-Artikel abrufen
export const GET_BLOG_ARTICLES = `
  query GetBlogArticles($blogHandle: String!, $first: Int = 20) {
    blog(handle: $blogHandle) {
      id
      handle
      title
      articles(first: $first, sortKey: PUBLISHED_AT, reverse: true) {
        edges {
          node {
            id
            handle
            title
            excerpt
            excerptHtml
            contentHtml
            publishedAt
            tags
            image {
              url
              altText
              width
              height
            }
            author: authorV2 {
              name
            }
          }
        }
      }
    }
  }
`;

// Einzelnen Blog-Artikel abrufen
export const GET_BLOG_ARTICLE = `
  query GetBlogArticle($blogHandle: String!, $articleHandle: String!) {
    blog(handle: $blogHandle) {
      articleByHandle(handle: $articleHandle) {
        id
        handle
        title
        excerpt
        excerptHtml
        contentHtml
        publishedAt
        tags
        image {
          url
          altText
          width
          height
        }
        author: authorV2 {
          name
        }
      }
    }
  }
`;

// Warenkorb abrufen
export const GET_CART = `
  query GetCart($cartId: ID!) {
    cart(id: $cartId) {
      id
      checkoutUrl
      totalQuantity
      cost {
        subtotalAmount {
          amount
          currencyCode
        }
        totalAmount {
          amount
          currencyCode
        }
        totalTaxAmount {
          amount
          currencyCode
        }
      }
      lines(first: 100) {
        edges {
          node {
            id
            quantity
            cost {
              totalAmount {
                amount
                currencyCode
              }
            }
            merchandise {
              ... on ProductVariant {
                id
                title
                selectedOptions {
                  name
                  value
                }
                product {
                  id
                  handle
                  title
                  featuredImage {
                    url
                    altText
                    width
                    height
                  }
                }
                price {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    }
  }
`;
