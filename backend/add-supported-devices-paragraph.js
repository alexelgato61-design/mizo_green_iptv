const pool = require('./config/database');

async function addSupportedDevicesParagraph() {
  let connection;
  
  try {
    connection = await pool.getConnection();
    console.log('✓ MySQL Database connected successfully');
    
    // Add supported_devices_paragraph column
    console.log('Adding supported_devices_paragraph column to settings table...');
    
    try {
      await connection.execute(`
        ALTER TABLE settings 
        ADD COLUMN supported_devices_paragraph TEXT DEFAULT 'Watch your favorite content on any device, anywhere. Our IPTV service is compatible with all major platforms including Smart TVs, Android, iOS, Windows, Mac, Fire TV Stick, and more. Enjoy seamless streaming across multiple devices with just one subscription.'
      `);
      console.log('✓ supported_devices_paragraph column added successfully');
    } catch (err) {
      if (err.code === 'ER_DUP_FIELDNAME') {
        console.log('✓ supported_devices_paragraph column already exists!');
      } else {
        throw err;
      }
    }
    
    console.log('\n✓ All done! Supported devices paragraph column is ready.');
    
  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      connection.release();
    }
    process.exit(0);
  }
}

addSupportedDevicesParagraph();
