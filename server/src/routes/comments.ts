import express from 'express';
import { PrismaClient } from '@prisma/client';
import { auth } from '../middleware/auth';
import { validate, commentSchema } from '../middleware/validation';

const router = express.Router();
const prisma = new PrismaClient();

// Get comments for a post
router.get('/post/:postId', async (req, res) => {
  try {
    const comments = await prisma.comment.findMany({
      where: { postId: parseInt(req.params.postId) },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching comments' });
  }
});

// Create a comment
router.post('/', auth, validate(commentSchema), async (req: any, res) => {
  try {
    const comment = await prisma.comment.create({
      data: {
        content: req.body.content,
        postId: req.body.postId,
        authorId: req.user.id,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    });
    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ error: 'Error creating comment' });
  }
});

// Delete a comment
router.delete('/:id', auth, async (req: any, res) => {
  try {
    const comment = await prisma.comment.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    if (comment.authorId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this comment' });
    }

    await prisma.comment.delete({
      where: { id: parseInt(req.params.id) },
    });

    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: 'Error deleting comment' });
  }
});

export default router; 