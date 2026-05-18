const db = require('better-sqlite3')('.tmp/data.db');

// Get Authenticated Role ID
const authRoleRow = db.prepare("SELECT id FROM up_roles WHERE type = 'authenticated'").get();
if (!authRoleRow) {
  console.log('Authenticated role not found!');
  process.exit(1);
}
const roleId = authRoleRow.id;

// Actions to enable
const actions = [
  'plugin::upload.api.upload',
  'plugin::upload.api.find',
  'plugin::upload.api.destroy',
  'api::aspiration-article.aspiration-article.create',
  'api::aspiration-article.aspiration-article.update',
  'api::aspiration-article.aspiration-article.destroy'
];

const insertStmt = db.prepare('INSERT OR IGNORE INTO up_permissions (action, role_id) VALUES (?, ?)');

db.transaction(() => {
  for (const action of actions) {
    insertStmt.run(action, roleId);
    console.log('Granted:', action);
  }
})();

console.log('All required permissions granted successfully!');
