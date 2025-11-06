import { getApiUrl } from '../lib/config'
import Header from '../components/Header'
import Footer from '../components/Footer'
import BlogPageClient from './BlogPageClient'

// Tell Next.js to use dynamic rendering for this page
export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getBlogs(page = 1) {
  try {
    const apiUrl = getApiUrl()
    const res = await fetch(`${apiUrl}/blogs?page=${page}&limit=9`, {
      cache: 'no-store',
      next: { revalidate: 0 }
    })
    if (!res.ok) throw new Error('Failed to fetch blogs')
    return await res.json()
  } catch (error) {
    console.error('Error loading blogs:', error)
    return { blogs: [], pagination: { totalPages: 1, currentPage: 1 } }
  }
}

export default async function BlogPage({ searchParams }) {
  const page = Number(searchParams?.page) || 1
  const data = await getBlogs(page)

  return (
    <>
      <Header />
      <BlogPageClient initialBlogs={data.blogs} initialPage={page} totalPages={data.pagination.totalPages} />
      <Footer />
    </>
  )
}
