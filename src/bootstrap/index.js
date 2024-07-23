'use strict'

const createPrompts = require('./createPrompts')
const createAdminUser = require('./createAdminUser')
const createAuthors = require('./createAuthors')
const createNewsletterBox = require('./createNewsletterBox')
const createNewsletterSection = require('./createNewsletterSection')

module.exports = async ({ strapi }) => {
  await createPrompts(strapi)
  await createAdminUser(strapi)
  await createAuthors(strapi)
  await createNewsletterBox(strapi)
  await createNewsletterSection(strapi)
}
