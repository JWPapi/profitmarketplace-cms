'use strict'

const OpenAI = require('openai')

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

async function generateAuthor() {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content: 'You are a creative writer tasked with creating a fictional author profile.',
      },
      {
        role: 'user',
        content:
          'Generate a random author name and a short bio (around 50 words) in JSON format. The JSON should have' +
          " 'name' and 'bio' fields. Only respond with JSON. Nothing else.",
      },
    ],
  })

  return JSON.parse(completion.choices[0].message.content)
}

module.exports = async strapi => {
  const existingAuthors = await strapi.entityService.findMany('api::author.author', {
    fields: ['id'],
  })

  if (existingAuthors.length < 5) {
    const authorsToCreate = 5 - existingAuthors.length
    console.log(`Creating ${authorsToCreate} new authors...`)

    for (let i = 0; i < authorsToCreate; i++) {
      try {
        const authorData = await generateAuthor()
        await strapi.entityService.create('api::author.author', {
          data: {
            name: authorData.name,
            publishedAt: new Date(),
          },
        })
        console.log(`Created author: ${authorData.name}`)
      } catch (error) {
        console.error('Error creating author:', error)
      }
    }
  } else {
    console.log('Sufficient authors already exist. Skipping creation.')
  }
}
