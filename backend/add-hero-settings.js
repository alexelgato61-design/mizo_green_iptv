const db = require('./config/database');

async function addHeroSettings() {
  try {
    console.log('Adding hero settings columns to settings table...');
    
    // Add hero_heading column
    await db.query(`
      ALTER TABLE settings 
      ADD COLUMN hero_heading TEXT DEFAULT 'TITAN IPTV Premium TV Service'
    `);
    console.log('✓ Added hero_heading column');
    
    // Add hero_paragraph column
    await db.query(`
      ALTER TABLE settings 
      ADD COLUMN hero_paragraph TEXT DEFAULT 'Enjoy premium TV with Titan IPTV. Access a wide range of channels and exclusive content, with over 40,000 channels and more than 54,000 VOD.'
    `);
    console.log('✓ Added hero_paragraph column');
    
    console.log('✓ Successfully added all hero settings columns!');
    process.exit(0);
  } catch (error) {
    if (error.code === 'ER_DUP_FIELDNAME') {
      console.log('✓ Hero settings columns already exist!');
      process.exit(0);
    } else {
      console.error('Error adding hero settings columns:', error);
      process.exit(1);
    }
  }
}

addHeroSettings();
