'use strict'

const slugify = require('slugify')
/**
 * article controller
 */

const { createCoreController } = require('@strapi/strapi').factories

module.exports = createCoreController('api::article.article', ({ strapi }) => ({
  // Query by slug
  async findOne(ctx) {
    const { slug } = ctx.params
    const entity = await strapi.db.query('api::article.article').findOne({
      where: { slug },
      populate: {
        cover: {
          fields: ['url', 'width', 'height'],
        },
        author: {
          fields: ['name'],
        },
        category: {
          fields: ['name'],
        },
        tags: {
          fields: ['name', 'slug'],
        },
      },
    })

    return this.transformResponse(entity)
  },

  async create(ctx) {
    const { files, body } = ctx.request
    const { tags, ...articleData } = body
    const file = files['image']

    let createdFiles
    if (file) {
      createdFiles = await strapi.plugins.upload.services.upload.upload({
        data: {
          fileInfo: {
            name: articleData.slug + '-cover',
            caption: articleData.description,
            alternativeText: articleData.title + '-cover',
            publishedAt: new Date(),
          },
        },
        files: file,
      })
    }

    let tagIds
    if (tags) {
      const tagPromises = tags.split(',').map(async tag => {
        tag = tag.toLowerCase().trim()
        const existingTag = await strapi.db.query('api::tag.tag').findOne({ where: { name: tag } })

        if (existingTag) {
          return existingTag.id
        } else {
          const newTag = await strapi.db
            .query('api::tag.tag')
            .create({ data: { name: tag, publishedAt: new Date(), slug: slugify(tag) } })
          return newTag.id
        }
      })
      tagIds = await Promise.all(tagPromises)
    }

    const article = await strapi.db.query('api::article.article').create({
      data: {
        ...articleData,
        tags: tagIds,
        publishedAt: new Date(),
        cover: createdFiles ? createdFiles[0].id : null,
      },
    })
    return { article }
  },
}))
