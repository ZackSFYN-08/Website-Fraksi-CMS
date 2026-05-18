/**
 * member controller
 */

import { factories } from '@strapi/strapi'

// Helper function to manually verify JWT token
const verifyToken = async (ctx, strapi) => {
  try {
    const token = await strapi.plugin('users-permissions').service('jwt').getToken(ctx);
    if (!token || !token.id) return false;
    const user = await strapi.entityService.findOne('plugin::users-permissions.user', token.id);
    return user || false;
  } catch (e) { return false; }
};

export default factories.createCoreController('api::member.member', ({ strapi }) => ({
  async find(ctx) {
    if (ctx.query.me === 'true' && ctx.state.user) {
      const members = await strapi.entityService.findMany('api::member.member', {
        filters: { user: ctx.state.user.id },
        populate: ctx.query.populate || '*',
      });
      const sanitizedEntity = await this.sanitizeOutput(members, ctx);
      return this.transformResponse(sanitizedEntity);
    }
    return super.find(ctx);
  },

  async uploadBypass(ctx) {
    const user = await verifyToken(ctx, strapi);
    if (!user) return ctx.unauthorized('Invalid or missing token');
    
    const files = ctx.request.files;
    if (!files || Object.keys(files).length === 0) return ctx.badRequest('No files found');
    
    try {
      const uploadService = strapi.plugin('upload').service('upload');
      const fileToUpload = files.files || files.file || Object.values(files)[0];
      const uploadedFiles = await uploadService.upload({ data: {}, files: fileToUpload });
      return Array.isArray(uploadedFiles) ? uploadedFiles : [uploadedFiles];
    } catch (err) { return ctx.internalServerError('Failed to upload file'); }
  },

  async createArticleBypass(ctx) {
    const user = await verifyToken(ctx, strapi);
    if (!user) return ctx.unauthorized('Invalid or missing token');
    try {
      const response = await strapi.entityService.create('api::aspiration-article.aspiration-article', {
        data: { ...ctx.request.body.data, publishedAt: new Date() }
      });
      return ctx.send({ data: response });
    } catch (err) { return ctx.internalServerError('Failed to create article'); }
  },

  async updateArticleBypass(ctx) {
    const user = await verifyToken(ctx, strapi);
    if (!user) return ctx.unauthorized('Invalid or missing token');
    try {
      const { documentId } = ctx.params;
      const response = await strapi.documents('api::aspiration-article.aspiration-article').update({
        documentId: documentId,
        data: ctx.request.body.data,
        status: 'published'
      });
      return ctx.send({ data: response });
    } catch (err) { return ctx.internalServerError('Failed to update article'); }
  },

  async deleteArticleBypass(ctx) {
    const user = await verifyToken(ctx, strapi);
    if (!user) return ctx.unauthorized('Invalid or missing token');
    try {
      const { documentId } = ctx.params;
      const response = await strapi.documents('api::aspiration-article.aspiration-article').delete({
        documentId: documentId
      });
      return ctx.send({ data: response });
    } catch (err) { return ctx.internalServerError('Failed to delete article'); }
  }
}));
