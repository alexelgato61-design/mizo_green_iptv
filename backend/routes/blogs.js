const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const authMiddleware = require('../middleware/auth');

// Helper function to generate slug from title (auto-generates SEO-friendly URLs)
function generateSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Public: Get all published blogs (with pagination)
router.get('/blogs', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Get total count
    const [countResult] = await pool.query(
      'SELECT COUNT(*) as total FROM blogs WHERE status = ?',
      ['published']
    );
    const total = countResult[0].total;

    // Get blogs
    const [blogs] = await pool.query(
      `SELECT id, title, slug, excerpt, featured_image, author, published_at, created_at 
       FROM blogs 
       WHERE status = ? 
       ORDER BY published_at DESC 
       LIMIT ? OFFSET ?`,
      ['published', limit, offset]
    );

    res.json({
      blogs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
});

// Public: Get single blog by slug
router.get('/blogs/:slug', async (req, res) => {
  try {
    const [blogs] = await pool.query(
      'SELECT * FROM blogs WHERE slug = ? AND status = ?',
      [req.params.slug, 'published']
    );

    if (blogs.length === 0) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    res.json(blogs[0]);
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(500).json({ error: 'Failed to fetch blog' });
  }
});

// Admin: Get all blogs (including drafts)
router.get('/admin/blogs', authMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const status = req.query.status || 'all';

    let whereClause = '';
    let params = [];

    if (status !== 'all') {
      whereClause = 'WHERE status = ?';
      params.push(status);
    }

    // Get total count
    const [countResult] = await pool.query(
      `SELECT COUNT(*) as total FROM blogs ${whereClause}`,
      params
    );
    const total = countResult[0].total;

    // Get blogs
    const [blogs] = await pool.query(
      `SELECT * FROM blogs ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    res.json({
      blogs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching admin blogs:', error);
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
});

// Admin: Get single blog by ID (for editing)
router.get('/admin/blogs/:id', authMiddleware, async (req, res) => {
  try {
    const [blogs] = await pool.query('SELECT * FROM blogs WHERE id = ?', [req.params.id]);

    if (blogs.length === 0) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    res.json(blogs[0]);
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(500).json({ error: 'Failed to fetch blog' });
  }
});

// Admin: Create new blog
router.post('/admin/blogs', authMiddleware, async (req, res) => {
  try {
    const { title, content, excerpt, featured_image, author, status } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    // Generate slug from title
    let slug = generateSlug(title);
    
    // Check if slug exists and make it unique
    const [existing] = await pool.query('SELECT id FROM blogs WHERE slug = ?', [slug]);
    if (existing.length > 0) {
      slug = `${slug}-${Date.now()}`;
    }

    const published_at = status === 'published' ? new Date() : null;

    const [result] = await pool.query(
      `INSERT INTO blogs (title, slug, content, excerpt, featured_image, author, status, published_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, slug, content, excerpt || '', featured_image || '', author || 'Admin', status || 'draft', published_at]
    );

    const [newBlog] = await pool.query('SELECT * FROM blogs WHERE id = ?', [result.insertId]);

    res.status(201).json({ message: 'Blog created successfully', blog: newBlog[0] });
  } catch (error) {
    console.error('Error creating blog:', error);
    res.status(500).json({ error: 'Failed to create blog' });
  }
});

// Admin: Update blog
router.put('/admin/blogs/:id', authMiddleware, async (req, res) => {
  try {
    const { title, content, excerpt, featured_image, author, status } = req.body;
    const blogId = req.params.id;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    // Get current blog
    const [currentBlog] = await pool.query('SELECT * FROM blogs WHERE id = ?', [blogId]);
    if (currentBlog.length === 0) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    // Generate new slug if title changed
    let slug = currentBlog[0].slug;
    if (title !== currentBlog[0].title) {
      slug = generateSlug(title);
      const [existing] = await pool.query('SELECT id FROM blogs WHERE slug = ? AND id != ?', [slug, blogId]);
      if (existing.length > 0) {
        slug = `${slug}-${Date.now()}`;
      }
    }

    // Update published_at if status changed to published
    let published_at = currentBlog[0].published_at;
    if (status === 'published' && currentBlog[0].status !== 'published') {
      published_at = new Date();
    }

    await pool.query(
      `UPDATE blogs 
       SET title = ?, slug = ?, content = ?, excerpt = ?, featured_image = ?, author = ?, status = ?, published_at = ?
       WHERE id = ?`,
      [title, slug, content, excerpt || '', featured_image || '', author || 'Admin', status || 'draft', published_at, blogId]
    );

    const [updatedBlog] = await pool.query('SELECT * FROM blogs WHERE id = ?', [blogId]);

    res.json({ message: 'Blog updated successfully', blog: updatedBlog[0] });
  } catch (error) {
    console.error('Error updating blog:', error);
    res.status(500).json({ error: 'Failed to update blog' });
  }
});

// Admin: Delete blog
router.delete('/admin/blogs/:id', authMiddleware, async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM blogs WHERE id = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({ error: 'Failed to delete blog' });
  }
});

module.exports = router;
