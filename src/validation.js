import Joi from 'joi';

export const postSchema = Joi.object({
  title: Joi.string().max(100).required(),
  description: Joi.string().max(1000).required(),
  post_type: Joi.string().max(30).required(),
  image_url: Joi.string().max(255),
});

export const postUpdateSchema = Joi.object({
  title: Joi.string().max(100).optional(),
  description: Joi.string().max(1000).optional(),
  post_type: Joi.string().max(30).optional(),
  image_url: Joi.string().max(255).optional(),
});
