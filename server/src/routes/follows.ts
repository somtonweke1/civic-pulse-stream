import express from 'express';
import { PrismaClient } from '@prisma/client';
import { auth } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Follow a user
router.post('/:userId', auth, async (req: any, res) => {
  try {
    if (parseInt(req.params.userId) === req.user.id) {
      return res.status(400).json({ error: 'Cannot follow yourself' });
    }

    const follow = await prisma.follow.create({
      data: {
        followerId: req.user.id,
        followingId: parseInt(req.params.userId),
      },
      include: {
        follower: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        following: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    });
    res.status(201).json(follow);
  } catch (error) {
    res.status(400).json({ error: 'Error following user' });
  }
});

// Unfollow a user
router.delete('/:userId', auth, async (req: any, res) => {
  try {
    await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId: req.user.id,
          followingId: parseInt(req.params.userId),
        },
      },
    });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: 'Error unfollowing user' });
  }
});

// Get followers
router.get('/followers/:userId', async (req, res) => {
  try {
    const followers = await prisma.follow.findMany({
      where: { followingId: parseInt(req.params.userId) },
      include: {
        follower: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    });
    res.json(followers);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching followers' });
  }
});

// Get following
router.get('/following/:userId', async (req, res) => {
  try {
    const following = await prisma.follow.findMany({
      where: { followerId: parseInt(req.params.userId) },
      include: {
        following: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    });
    res.json(following);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching following' });
  }
});

export default router; 