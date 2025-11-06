'use client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function BlogPageClient({ initialBlogs, initialPage, totalPages }) {
  const router = useRouter()

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  const handlePageChange = (newPage) => {
    router.push(`/blog?page=${newPage}`)
  }

  return (
    <main className="blog-page">
      <section className="blog-hero">
        <div className="container">
          <h1>Our Blog</h1>
          <p>Stay updated with the latest news, tips, and insights about IPTV streaming</p>
        </div>
      </section>

      <section className="blog-grid-section">
        <div className="container">
          {initialBlogs.length === 0 ? (
            <div className="no-blogs">
              <p>No blog posts available yet. Check back soon!</p>
            </div>
          ) : (
            <>
              <div className="blog-grid">
                {initialBlogs.map((blog) => (
                  <article key={blog.id} className="blog-card">
                    {blog.featured_image && (
                      <div className="blog-image">
                        <img src={blog.featured_image} alt={blog.title} />
                      </div>
                    )}
                    <div className="blog-content">
                      <div className="blog-meta">
                        <span className="blog-author">{blog.author}</span>
                        <span className="blog-date">{formatDate(blog.published_at)}</span>
                      </div>
                      <h2>
                        <Link href={`/blog/${blog.slug}`}>{blog.title}</Link>
                      </h2>
                      <p className="blog-excerpt">{blog.excerpt}</p>
                      <Link href={`/blog/${blog.slug}`} className="read-more">
                        Read More →
                      </Link>
                    </div>
                  </article>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    onClick={() => handlePageChange(Math.max(1, initialPage - 1))}
                    disabled={initialPage === 1}
                    className="pagination-btn"
                  >
                    ← Previous
                  </button>
                  <span className="page-info">
                    Page {initialPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(Math.min(totalPages, initialPage + 1))}
                    disabled={initialPage === totalPages}
                    className="pagination-btn"
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  )
}
