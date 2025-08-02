import joi from 'joi'

export const blogValidator=joi.object({
    title:joi.string().min(10),
    subTitle:joi.string().required(),
    description:joi.string().required(),
    category:joi.string().required(),
    isPublished:joi.boolean().required(),

})