const strapi = require('@strapi/strapi');

(async () => {
  const app = await strapi({ distDir: './dist' }).load();
  try {
    const roleService = app.plugin('users-permissions').service('role');
    const roles = await roleService.find();
    const authRole = roles.find(r => r.type === 'authenticated');
    
    if (authRole) {
      console.log('Role found:', authRole.id);
      const role = await roleService.findOne(authRole.id);
      const newPerms = role.permissions;
      
      // Enable Upload
      if (newPerms['plugin::upload']) {
        if (newPerms['plugin::upload'].controllers.api) {
            newPerms['plugin::upload'].controllers.api.upload.enabled = true;
            newPerms['plugin::upload'].controllers.api.find.enabled = true;
        } else if (newPerms['plugin::upload'].controllers['admin-api']) {
            // fallback
            newPerms['plugin::upload'].controllers['admin-api'].upload.enabled = true;
        }
      }
      
      // Enable Aspiration Article CRUD
      if (newPerms['api::aspiration-article']) {
        newPerms['api::aspiration-article'].controllers['aspiration-article'].create.enabled = true;
        newPerms['api::aspiration-article'].controllers['aspiration-article'].update.enabled = true;
        newPerms['api::aspiration-article'].controllers['aspiration-article'].destroy.enabled = true;
      }
      
      await roleService.updateRole(authRole.id, newPerms);
      console.log('Role updated successfully.');
    }
  } catch(e) {
    console.error(e);
  }
  process.exit();
})();
