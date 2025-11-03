import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkNotificationSchema() {
  try {
    console.log('Checking notification schema...');
    
    // Try to fetch a notification to see the schema
    const notifications = await prisma.notification.findMany({
      take: 1,
    });
    
    console.log('Sample notification:', notifications[0]);
    
    // Check if imageUrl field exists
    if (notifications[0] && 'imageUrl' in notifications[0]) {
      console.log('✅ imageUrl field exists in database');
      console.log('imageUrl value:', notifications[0].imageUrl);
    } else {
      console.log('❌ imageUrl field does not exist in database');
      console.log('Available fields:', Object.keys(notifications[0] || {}));
    }
    
  } catch (error) {
    console.error('Error checking schema:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkNotificationSchema();























