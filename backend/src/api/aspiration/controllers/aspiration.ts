import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::aspiration.aspiration', ({ strapi }) => ({
  async find(ctx) {
    const response = await super.find(ctx);
    if (response && response.data) {
      const dataArray = Array.isArray(response.data) ? response.data : [response.data];
      dataArray.forEach(item => {
        if (item.attributes) {
          delete item.attributes.name;
          delete item.attributes.email;
        } else {
          delete item.name;
          delete item.email;
        }
      });
    }
    return response;
  },
  async findOne(ctx) {
    const response = await super.findOne(ctx);
    if (response && response.data) {
      if (response.data.attributes) {
        delete response.data.attributes.name;
        delete response.data.attributes.email;
      } else {
        delete response.data.name;
        delete response.data.email;
      }
    }
    return response;
  }
}));
