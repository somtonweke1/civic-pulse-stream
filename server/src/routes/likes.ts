import express from 'express';
import { PrismaClient } from '@prisma/client';
import { auth } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Like a post
router.post('/:postId', auth, async (req: any, res) => {
  try {
    const like = await prisma.like.create({
      data: {
        postId: parseInt(req.params.postId),
        userId: req.user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    res.status(201).json(like);
  } catch (error) {
    res.status(400).json({ error: 'Error liking post' });
  }
});

// Unlike a post
router.delete('/:postId', auth, async (req: any, res) => {
  try {
    await prisma.like.delete({
      where: {
        postId_userId: {
          postId: parseInt(req.params.postId),
          userId: req.user.id,
        },
      },
    });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: 'Error unliking post' });
  }
});

// Get likes for a post
router.get('/:postId', async (req, res) => {
  try {
    const likes = await prisma.like.findMany({
      where: { postId: parseInt(req.params.postId) },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    res.json(likes);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching likes' });
  }
});

export default router; 