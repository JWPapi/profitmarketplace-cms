'use strict'

module.exports = async strapi => {
  const existingPrompts = await strapi.entityService.findMany('api::prompt.prompt', {
    fields: ['id'],
  })

  if (existingPrompts.length === 0) {
    const promptsToCreate = [
      {
        name: 'generateArticle',
        prompt: `Role:

You are an newspaper journalist.

Instructions:

You write extensive news articles and deliver in markdown format.

Your topic is {title} and this is a snippet: {snippet}. This has happened on {date}, but write the article as if it would've just happened.

Steps:

Think about how to make this topic interesting.

Decide on a good title.

Write an interesting article.

Make sure it's properly and easy to read formatted in markdown.

End Goal:

The article shall get clicks on the newspaper and be enjoyable to read for the reader.

Narrowing:

Write about 1200 words.

If helpful use bullet points subheadings and paragraphs. Feel free to link to external website if quoting.

Stick to facts, but deliver an article no matter what.

Remove any author information.

Remove any obvious fake testimonials Like John Doe, ABC corporation, or XYZ corporation etc.

Remove all notes.

Remove mentions of the date inside the text.

When listing references, make sure to link them properly in markdown format, or disregard them. Only list references that are related to the article context, not references you used for writing the article interesting or references you used to generate Markdown.


In the end make sure you followed all instructions.

`,
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
      {
        name: 'controllingPrompt',
        prompt: `You are tasked with validating an  article based on specific criteria. Your goal is to determine if the article is valid or invalid according to the given conditions.

Here is the  article to analyze:

<article>
{article}
</article>

Conditions to check:
The article must not contain any fictive examples. Fictive examples are hypothetical scenarios or made-up companies used to illustrate a point. These often include phrases like "Ein Beispiel hierfür ist..." (An example of this is...) followed by a description of a non-existent company or situation.

The article must not contain the word topic or Überschrift.

Instructions:
1. Carefully read through the entire article.
2. Look for any instances of fictive examples, paying special attention to:
   - Made-up company names (e.g., "Unternehmen XYZ")
   - Hypothetical scenarios that are clearly not based on real events
   - Phrases introducing examples that seem generic or placeholder-like
3. If you find any fictive examples, the article is invalid.
4. If you find the word markdown or undefined, the article is invalid.
5. If you find mentions of references, that are not properly linked in markdown format the article is invalid. If it’s just the link, that is linked that is enough.
6. If you can proof that the references are not related to the article, it’s invalid.

Provide your analysis in the following format:
<analysis>
[Your detailed explanation of why the article is valid or invalid, including specific examples if any fictive content was found]
</analysis>

<verdict>
[VALID] or [INVALID]
</verdict>

Remember, the article must be marked as invalid if it contains any fictive examples, even if the rest of the content is acceptable.`,
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
