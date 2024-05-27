import { PrismaClient } from '@prisma/client';
import { postSchema, postUpdateSchema } from './validation.js';

const prisma = new PrismaClient();

export default {
  async createPost(req, res) {
    try {
      const { title, description, post_type, image_url } = req.body;
      const { error } = postSchema.validate(req.body);

      if (error)
        return res.status(400).json({ error: error.details[0].message });

      const post = await prisma.post.create({
        data: {
          title,
          description,
          post_type,
          image_url,
        },
      });

      return res.status(201).json(post);
    } catch (error) {
      return res.status(500).json({ error });
    }
  },

  async getAllPosts(req, res) {
    try {
      const posts = await prisma.post.findMany();
      return res.json(posts);
    } catch (error) {
      return res.status(500).json({ error });
    }
  },

  async getAllPostsPaginated(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      if (page < 1 && limit < 1)
        return res
          .status(400)
          .json({ error: 'page and limit must be positive intergers.' });

      const offset = (page - 1) * limit;

      const posts = await prisma.post.findMany({
        skip: offset,
        take: limit,
        orderBy: {
          creation_date: 'desc',
        },
      });

      if (posts.length === 0)
        return res
          .status(404)
          .json({
            error:
              'the page you are trying to access exceeds the number of pages that contain posts.',
          });

      return res.status(200).json(posts);
    } catch (error) {
      return res.status(500).json({ error });
    }
  },

  async findPost(req, res) {
    try {
      const { UUID } = req.params;
      const post = await prisma.post.findUnique({ where: { UUID: UUID } });

      if (!post) return res.status(404).json({ error: 'Post not found' });

      return res.json(post);
    } catch (error) {
      return res.status(500).json({ error });
    }
  },

  async updatePost(req, res) {
    try {
      const { UUID } = req.params;
      const { title, description, post_type, image_url } = req.body;
      const { error } = postUpdateSchema.validate(req.body);

      let post = await prisma.post.findUnique({ where: { UUID: UUID } });

      if (!post) return res.status(404).json({ error: 'Post not found' });
      if (error) return res.status(400).send(error.details[0].message);

      post = await prisma.post.update({
        where: { UUID: UUID },
        data: {
          title,
          description,
          post_type,
          image_url,
        },
      });
      return res.json(post);
    } catch (error) {
      return res.status(500).json({ error });
    }
  },

  async deletePost(req, res) {
    try {
      const { UUID } = req.params;
      let post = await prisma.post.findUnique({ where: { UUID: UUID } });

      if (!post) return res.status(404).json({ error: 'Post not found' });

      post = await prisma.post.delete({ where: { UUID: UUID } });

      return res.status(200).json(post);
    } catch (error) {
      return res.status(500).json({ error });
    }
  },
};
