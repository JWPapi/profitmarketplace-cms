'use strict'

module.exports = async strapi => {
  const existingNewsletterSection = await strapi.entityService.findMany(
    'api::newsletter-section.newsletter-section',
    {
      fields: ['id'],
    }
  )

  if (!existingNewsletterSection) {
    try {
      const newsletterSection = await strapi.entityService.create(
        'api::newsletter-section.newsletter-section',
        {
          data: {
            heading: 'Join Our Newsletter',
            paragraph:
              'Get the latest news, updates, and exclusive content delivered straight to your inbox.',
            publishedAt: new Date(),
          },
        }
      )

      console.log('Newsletter section created successfully:', newsletterSection)
    } catch (error) {
      console.error('Error creating newsletter section:', error)
    }
  } else {
    console.log('Newsletter section already exists. Skipping creation.')
  }
}
