import { MetadataRoute } from 'next'
import { getProducts } from '@/actions/product.actions'
import { getCategories } from '@/actions/category.actions'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const productsReq = await getProducts();
  const products = Array.isArray((productsReq as any)?.data) ? (productsReq as any).data : [];
  
  const categoryReq = await getCategories();
  const categories = "data" in (categoryReq as any) ? (categoryReq as any).data : [];

  const productUrls = products.map((product: any) => ({
    url: `https://artsuzani.com/products/${product._id}`,
    lastModified: new Date(product.updatedAt || product.createdAt || new Date()),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const categoryUrls = categories.map((category: any) => ({
    url: `https://artsuzani.com/product-category/${category._id}`,
    lastModified: new Date(category.updatedAt || category.createdAt || new Date()),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [
    {
      url: 'https://artsuzani.com',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: 'https://artsuzani.com/about',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://artsuzani.com/products',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: 'https://artsuzani.com/blog',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    ...categoryUrls,
    ...productUrls,
  ]
}
