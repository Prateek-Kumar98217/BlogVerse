import joi from 'joi'

export const commentValidator=joi.object({
    blogId: joi.string().required(),
    name:joi.string().required().min(3),
    content:joi.string().required(),
})