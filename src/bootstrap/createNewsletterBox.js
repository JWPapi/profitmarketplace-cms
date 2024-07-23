'use strict'

module.exports = async strapi => {
  const existingNewsletterBox = await strapi.entityService.findMany(
    'api::newsletter-box.newsletter-box',
    {
      fields: ['id'],
    }
  )

  if (!existingNewsletterBox) {
    try {
      const newsletterBox = await strapi.entityService.create(
        'api::newsletter-box.newsletter-box',
        {
          data: {
            heading: 'Subscribe to Our Newsletter',
            paragraph:
              'Stay up-to-date with our latest news, articles, and exclusive offers. Join our community and never miss an important update!',
            publishedAt: new Date(),
          },
        }
      )

      console.log('Newsletter box created successfully:', newsletterBox)
    } catch (error) {
      console.error('Error creating newsletter box:', error)
    }
  } else {
    console.log('Newsletter box already exists. Skipping creation.')
  }
}
