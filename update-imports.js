const fs = require('fs');
const path = require('path');

// Files to update
const filesToUpdate = [
  'src/services/astrology/db/inits.ts',
  'src/services/astrology/models/natal_planets.ts',
  'src/services/astrology/models/DerivedChartModel.ts',
  'src/services/astrology/models/derived_chart_planet.ts',
  'src/services/astrology/models/dailyTransit.ts',
  'src/services/astrology/models/dailyHoroscope.ts',
  'src/services/astrology/models/ChartType.ts',
  'src/services/astrology/models/natal_chart.ts',
  'src/services/astrology/models/derived_chart_house.ts',
  'src/services/astrology/models/natal_houses.ts',
  'src/services/astrology/models/transitChart.ts',
  'src/services/astrology/models/transit_chart_planet.ts',
  'src/services/user-management/models/authenticationLog.ts',
  'src/services/user-management/models/user_devices.ts',
  'src/services/AstroRatan/models/messages.ts',
  'src/services/AstroRatan/models/conversations.ts',
  'src/services/user-management/models/PaymentTransaction.ts',
  'src/services/AstroRatan/models/db/init.ts',
  'src/services/user/models/UserProfile.ts',
  'src/services/subscription/models/subscription.ts',
  'src/services/subscription/models/SubscriptionTier.ts',
  'src/services/subscription/models/SubscriptionHistory.ts',
  'src/services/subscription/models/UserSubscription.ts',
  'src/services/subscription/models/UserSubscription .ts',
  'src/services/subscription/models/db/inits.ts',
  'src/services/content/utils/scheduledJobs.ts',
  'src/services/content/models/ContentTemplate.ts',
  'src/services/content/models/GeneratedContent.ts',
  'src/services/content/models/ContentVariable.ts',
  'src/services/business/models/progressive_charts.ts',
  'src/services/business/models/business_partners.ts',
  'src/services/business/models/businessProfile.ts',
  'src/services/business/models/relationchart.ts',
  'src/services/business/models/db/init.ts',
  'src/services/NumerologyAnalysis/models/astrology.numerology_analyses.ts',
  'src/services/NumerologyAnalysis/models/astrology.numerology_systems.ts',
  'src/services/NumerologyAnalysis/models/LoShuGridAnalysis.ts',
  'src/services/NumerologyAnalysis/models/db/init.ts'
];

// Root directory
const rootDir = process.cwd();

// Update each file
filesToUpdate.forEach(filePath => {
  const fullPath = path.join(rootDir, filePath);
  
  try {
    // Read the file
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Replace the import statement
    content = content.replace(
      /import sequelize from ['"](.*)postgres\.config['"];/g,
      (match, p1) => `import sequelize from '${p1}sequelize.config';`
    );
    
    // Write the updated content back to the file
    fs.writeFileSync(fullPath, content, 'utf8');
    
    console.log(`✅ Updated: ${filePath}`);
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
  }
});

console.log('Import update complete!');
