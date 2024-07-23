'use strict'

module.exports = async strapi => {
  const existingPrompts = await strapi.entityService.findMany('api::prompt.prompt', {
    fields: ['id'],
  })

  if (existingPrompts.length === 0) {
    const promptsToCreate = [
      {
        name: 'generateArticle',
        prompt:
          "Role: \n\nYou are an newspaper journalist.\n\nInstructions:\n\nYou write extensive news articles and deliver in markdown format. \n\nYour topic is {title} and this is a snippet: {snippet}. This has happened on {date}, but write the article as if it would've just happened.\n\nSteps:\n\nThink about how to make this topic interesting.\n\nDecide on a good title.\n\nWrite an interesting article.\n\nMake sure it's properly and easy to read formatted in markdown.\n\nEnd Goal:\n\nThe article shall get clicks on the newspaper and be enjoyable to read for the reader.\n\nNarrowing:\n\nWrite about 1200 words.\n\nIf helpful use bullet points subheadings and paragraphs. Feel free to link to external website if quoting.\n\nStick to facts, but deliver an article no matter what.\n\nRemove any author information. \n\nRemove any obvious fake testimonials Like John Doe, ABC corporation, or XYZ corporation etc.\n\nRemove all notes.\n\nRemove mentions of the date inside the text.\n\nWhen listing references, make sure to link them properly in markdown format, or disregard them.\n\n\nIn the end make sure you followed all instructions.\n\n",
      },
      {
        name: 'generateTags',
        prompt:
          'Role:\nYou are a tag generator.\n\nInstructions:\nYou have this {text}. Please generate 5 tags for it.\n\nSteps:\nFigure out topics of the article, that could be on a newspaper, magazine as well.\n\nEnd Goal:\nThese tags will be used to connect articles with each other.\n\nNarrowing:\nOnly single words, except for names, connect names with a dash. Do only respond with the tags, separated by comma.',
      },
      {
        name: 'generateSeoDescription',
        prompt:
          "You are tasked with generating an SEO meta description for a given article. This is crucial for improving click-througha rates from search engine results pages and providing an accurate summary of the article's content.\n\nYou will be provided with the article's title and content. Here they are:\n\n<title>\n{title}\n</title>\n\n<content>\n{content}\n</content>\n\nTo create an effective SEO meta description, follow these guidelines:\n\n1. Keep it concise and clear, between 150-160 characters.\n2. Include relevant keywords that accurately represent the content.\n3. Make it compelling and engaging to encourage clicks.\n4. Ensure it accurately summarizes the main points or value of the article.\n5. Where appropriate, include a call to action.\n\nFirst, analyze the title and content. Identify the main topic, key points, and any standout information or statistics. Look for relevant keywords that should be included in the description.\n\nNext, craft a meta description that adheres to the guidelines above. Ensure it captures the essence of the article, includes important keywords, and entices the reader to click through to the full content.\n\nProvide only the meta description and nothing else, no tags around it.",
      },
      {
        name: 'generateBulletPoints',
        prompt:
          'You will be given a piece of content to summarize. Your task is to create three bullet points that effectively summarize the main ideas or key points of the content. After analyzing the content, you should provide your summary in a specific JSON format.\n\nHere is the content you need to summarize:\n\n<content>\n{text}\n</content>\n\nPlease follow these steps:\n\n1. Carefully read and analyze the content provided above.\n\n2. Identify the three most important or central ideas from the content.\n\n3. Formulate these ideas into clear, concise bullet points.\n\n4. Present your summary in the following JSON format:\n {\n "summary": [\n "First bullet point",\n "Second bullet point",\n "Third bullet point"\n ]\n }\n\nBefore providing your final answer, use the scratchpad to think through your summary:\n\n<scratchpad>\nThink about the main topics discussed in the content.\nWhat are the key takeaways or central arguments?\nHow can you distill these into three distinct, important points?\nEnsure your bullet points are clear, concise, and capture the essence of the content.\n</scratchpad>\n\nNow, provide your final answer in the specified JSON format.',
      },
    ]

    for (const promptData of promptsToCreate) {
      const createdPrompt = await strapi.entityService.create('api::prompt.prompt', {
        data: promptData,
      })

      await strapi.entityService.update('api::prompt.prompt', createdPrompt.id, {
        data: {
          publishedAt: new Date(),
        },
      })
    }

    console.log('Initial prompts have been created and published.')
  } else {
    console.log('Prompts already exist. Skipping creation.')
  }
}
