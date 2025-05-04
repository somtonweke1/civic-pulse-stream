import express from 'express';
import { PrismaClient } from '@prisma/client';
import { auth } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching posts' });
  }
});

// Get a specific post
router.get('/:id', async (req, res) => {
  try {
    const post = await prisma.post.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching post' });
  }
});

// Create a new post
router.post('/', auth, async (req: any, res) => {
  try {
    const { title, content } = req.body;

    const post = await prisma.post.create({
      data: {
        title,
        content,
        authorId: req.user.id,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ error: 'Error creating post' });
  }
});

// Update a post
router.put('/:id', auth, async (req: any, res) => {
  try {
    const { title, content } = req.body;
    const postId = parseInt(req.params.id);

    // Check if post exists and belongs to user
    const existingPost = await prisma.post.findFirst({
      where: {
        id: postId,
        authorId: req.user.id,
      },
    });

    if (!existingPost) {
      return res.status(404).json({ error: 'Post not found or unauthorized' });
    }

    const post = await prisma.post.update({
      where: { id: postId },
      data: {
        title,
        content,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.json(post);
  } catch (error) {
    res.status(400).json({ error: 'Error updating post' });
  }
});

// Delete a post
router.delete('/:id', auth, async (req: any, res) => {
  try {
    const postId = parseInt(req.params.id);

    // Check if post exists and belongs to user
    const existingPost = await prisma.post.findFirst({
      where: {
        id: postId,
        authorId: req.user.id,
      },
    });

    if (!existingPost) {
      return res.status(404).json({ error: 'Post not found or unauthorized' });
    }

    await prisma.post.delete({
      where: { id: postId },
    });

    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: 'Error deleting post' });
  }
});

export default router; 