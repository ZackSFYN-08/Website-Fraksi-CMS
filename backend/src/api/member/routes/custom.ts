export default {
  routes: [
    {
      method: 'POST',
      path: '/members/upload',
      handler: 'member.uploadBypass',
      config: { auth: false },
    },
    {
      method: 'POST',
      path: '/members/articles',
      handler: 'member.createArticleBypass',
      config: { auth: false },
    },
    {
      method: 'PUT',
      path: '/members/articles/:documentId',
      handler: 'member.updateArticleBypass',
      config: { auth: false },
    },
    {
      method: 'DELETE',
      path: '/members/articles/:documentId',
      handler: 'member.deleteArticleBypass',
      config: { auth: false },
    },
  ],
};
