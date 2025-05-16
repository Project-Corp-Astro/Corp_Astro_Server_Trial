import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import { QueryInterface, DataTypes } from 'sequelize';

export = {
  up: async (queryInterface: QueryInterface, Sequelize: typeof DataTypes) => {
    // Create subscription tiers
    const tierIds = {
      free: uuidv4(),
      subscription: uuidv4(),
      premium: uuidv4()
    };

    await queryInterface.bulkInsert('subscription_tiers', [
      {
        tier_id: tierIds.free,
        name: 'Free',
        description: 'Basic access to Corp Astro services',
        price: 0.00,
        billing_cycle: 'monthly',
        features: JSON.stringify({
          'daily_horoscope': false,
          'monthly_report': false,
          'business_forecast': false,
          'free_tools': true,
          'astro_ratan_chat': false
        }),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        tier_id: tierIds.subscription,
        name: 'Basic',
        description: 'Standard subscription with daily horoscopes and monthly reports',
        price: 9.99,
        billing_cycle: 'monthly',
        features: JSON.stringify({
          'daily_horoscope': true,
          'monthly_report': true,
          'business_forecast': false,
          'free_tools': true,
          'astro_ratan_chat': true
        }),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        tier_id: tierIds.premium,
        name: 'Premium',
        description: 'Full access to all Corp Astro features including business forecasts',
        price: 19.99,
        billing_cycle: 'monthly',
        features: JSON.stringify({
          'daily_horoscope': true,
          'monthly_report': true,
          'business_forecast': true,
          'free_tools': true,
          'astro_ratan_chat': true
        }),
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);

    // Create admin user
    const adminId = uuidv4();
    const passwordHash = await bcrypt.hash('Admin@123', 10);
    
    await queryInterface.bulkInsert('users', [
      {
        user_id: adminId,
        email: 'admin@corpastro.com',
        password_hash: passwordHash,
        first_name: 'Admin',
        last_name: 'User',
        role: 'super_admin',
        subscription_tier: 'premium',
        account_status: 'active',
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);

    // Create sample content categories
    const categories = [
      {
        id: uuidv4(),
        name: 'Business Strategy',
        description: 'Content related to business strategy and planning',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Financial Astrology',
        description: 'Content related to financial aspects of business astrology',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Team Dynamics',
        description: 'Content related to team compatibility and dynamics',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Marketing Timing',
        description: 'Content related to auspicious timing for marketing campaigns',
        created_at: new Date(),
        updated_at: new Date()
      }
    ];
    
    await queryInterface.bulkInsert('content_categories', categories);

    // Create sample content templates
    const templates = [
      {
        id: uuidv4(),
        template_name: 'Daily Business Horoscope',
        content_type: 'daily_horoscope',
        template_content: 'Today, {{business_name}} may experience {{prediction}}. Focus on {{focus_area}} for best results. Avoid {{caution_area}}.',
        variables: JSON.stringify(['business_name', 'prediction', 'focus_area', 'caution_area']),
        active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        template_name: 'Monthly Business Report',
        content_type: 'monthly_report',
        template_content: 'Monthly Report for {{business_name}} - {{month}} {{year}}\n\nOverview: {{overview}}\n\nKey Focus Areas:\n1. {{focus_area_1}}\n2. {{focus_area_2}}\n3. {{focus_area_3}}\n\nChallenges to Navigate:\n{{challenges}}\n\nOpportunities:\n{{opportunities}}\n\nRecommended Actions:\n{{recommendations}}',
        variables: JSON.stringify(['business_name', 'month', 'year', 'overview', 'focus_area_1', 'focus_area_2', 'focus_area_3', 'challenges', 'opportunities', 'recommendations']),
        active: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ];
    
    await queryInterface.bulkInsert('content_templates', templates);
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkDelete('content_templates', {});
    await queryInterface.bulkDelete('content_categories', {});
    await queryInterface.bulkDelete('users', {});
    await queryInterface.bulkDelete('subscription_tiers', {});
  }
};
