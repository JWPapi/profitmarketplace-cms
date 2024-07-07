module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/articles/:slug',
      handler: 'article.findOne',
      config: {
        auth: false,
        populate: {
          image: {
            fields: ['url', 'width', 'height'],
          }, author: {
            fields: ['name'],
          },
        }
      },
    }
  ]
}
