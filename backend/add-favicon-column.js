const db = require('./config/database');

async function addFaviconColumn() {
  try {
    console.log('Adding favicon_url column to settings table...');
    
    await db.query(`
      ALTER TABLE settings 
      ADD COLUMN favicon_url VARCHAR(500) DEFAULT NULL
    `);
    
    console.log('✓ Successfully added favicon_url column!');
    process.exit(0);
  } catch (error) {
    if (error.code === 'ER_DUP_FIELDNAME') {
      console.log('✓ Column favicon_url already exists!');
      process.exit(0);
    } else {
      console.error('Error adding favicon_url column:', error);
      process.exit(1);
    }
  }
}

addFaviconColumn();
