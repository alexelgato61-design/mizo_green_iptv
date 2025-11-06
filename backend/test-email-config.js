require('dotenv').config();
const { testEmailConfig, sendPasswordResetEmail } = require('./utils/emailService');

async function test() {
  console.log('\n🔍 Testing Email Configuration...\n');
  
  console.log('Environment Variables:');
  console.log('  SMTP_HOST:', process.env.SMTP_HOST || 'NOT SET');
  console.log('  SMTP_PORT:', process.env.SMTP_PORT || 'NOT SET');
  console.log('  SMTP_USER:', process.env.SMTP_USER || 'NOT SET');
  console.log('  SMTP_PASSWORD:', process.env.SMTP_PASSWORD ? '***SET***' : 'NOT SET');
  console.log('  EMAIL_HOST:', process.env.EMAIL_HOST || 'NOT SET');
  console.log('  EMAIL_PORT:', process.env.EMAIL_PORT || 'NOT SET');
  console.log('  EMAIL_USER:', process.env.EMAIL_USER || 'NOT SET');
  console.log('  EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? '***SET***' : 'NOT SET');
  console.log('  EMAIL_FROM:', process.env.EMAIL_FROM || 'NOT SET');
  console.log('\n');

  const isValid = await testEmailConfig();
  
  if (isValid) {
    console.log('\n✅ Email configuration is working correctly!');
    console.log('You can now use password recovery features.\n');
  } else {
    console.log('\n❌ Email configuration has errors. Please check your settings.\n');
  }
}

test();
