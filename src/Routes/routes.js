import { Router } from 'express';
import postController from '../Controller/postController.js';

const router = Router();

router.post('/posts', postController.createPost);
router.get('/posts', postController.getAllPosts);
router.get(('/posts/paginated'), postController.getAllPostsPaginated);
router.get('/posts/:UUID', postController.findPost);
router.put('/posts/:UUID', postController.updatePost);
router.delete('/posts/:UUID', postController.deletePost);

export { router };
