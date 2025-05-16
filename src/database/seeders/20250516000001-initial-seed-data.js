'use strict';
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
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
          nameAnalysis: true,
          taglineAnalysis: true,
          colorAnalysis: true,
          dailyHoroscope: false,
          monthlyReport: false,
          businessAnalysis: false,
          astroRatanChat: false,
          humanAstrologer: false
        }),
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        tier_id: tierIds.subscription,
        name: 'Business',
        description: 'Enhanced business astrology services',
        price: 29.99,
        billing_cycle: 'monthly',
        features: JSON.stringify({
          nameAnalysis: true,
          taglineAnalysis: true,
          colorAnalysis: true,
          dailyHoroscope: true,
          monthlyReport: true,
          businessAnalysis: true,
          astroRatanChat: true,
          humanAstrologer: false
        }),
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        tier_id: tierIds.premium,
        name: 'Premium',
        description: 'Complete business astrology services with human astrologer consultations',
        price: 99.99,
        billing_cycle: 'monthly',
        features: JSON.stringify({
          nameAnalysis: true,
          taglineAnalysis: true,
          colorAnalysis: true,
          dailyHoroscope: true,
          monthlyReport: true,
          businessAnalysis: true,
          astroRatanChat: true,
          humanAstrologer: true
        }),
        is_active: true,
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
        email: 'admin@corp-astro.com',
        password_hash: passwordHash,
        first_name: 'Admin',
        last_name: 'User',
        role: 'admin',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);

    // Create test user
    const testUserId = uuidv4();
    const testUserPasswordHash = await bcrypt.hash('Test@123', 10);
    
    await queryInterface.bulkInsert('users', [
      {
        user_id: testUserId,
        email: 'test@corp-astro.com',
        password_hash: testUserPasswordHash,
        first_name: 'Test',
        last_name: 'User',
        date_of_birth: '1990-01-15',
        birth_time: '08:30:00',
        birth_place: 'New York, USA',
        birth_coordinates: JSON.stringify({ latitude: 40.7128, longitude: -74.0060 }),
        role: 'user',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);

    // Create subscription for test user
    const subscriptionId = uuidv4();
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);

    await queryInterface.bulkInsert('user_subscriptions', [
      {
        subscription_id: subscriptionId,
        user_id: testUserId,
        tier_id: tierIds.subscription,
        start_date: startDate,
        end_date: endDate,
        auto_renew: true,
        status: 'active',
        payment_provider: 'stripe',
        payment_provider_subscription_id: 'sub_test123',
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);

    // Create business for test user
    const businessId = uuidv4();
    
    await queryInterface.bulkInsert('businesses', [
      {
        business_id: businessId,
        user_id: testUserId,
        name: 'Astro Tech Solutions',
        registration_date: '2020-03-10',
        registration_time: '10:15:00',
        registration_place: 'San Francisco, USA',
        registration_coordinates: JSON.stringify({ latitude: 37.7749, longitude: -122.4194 }),
        industry: 'Technology',
        description: 'A technology company focused on innovative solutions',
        website: 'https://astrotechsolutions.example.com',
        contact_email: 'info@astrotechsolutions.example.com',
        contact_phone: '+1-555-123-4567',
        address: JSON.stringify({
          street: '123 Tech Avenue',
          city: 'San Francisco',
          state: 'CA',
          postal_code: '94107',
          country: 'USA'
        }),
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);

    // Create content templates
    const dailyHoroscopeTemplateId = uuidv4();
    const monthlyReportTemplateId = uuidv4();
    const nameAnalysisTemplateId = uuidv4();
    
    await queryInterface.bulkInsert('content_templates', [
      {
        template_id: dailyHoroscopeTemplateId,
        name: 'Daily Business Horoscope',
        description: 'Template for daily business horoscopes',
        content_type: 'daily_horoscope',
        template_content: 'Today, {{business_name}}, the position of {{planet}} in {{zodiac_sign}} suggests {{prediction}}. Focus on {{focus_area}} for optimal results. {{advice}}',
        required_variables: JSON.stringify(['business_name', 'planet', 'zodiac_sign', 'prediction', 'focus_area', 'advice']),
        tier_access: 'subscription',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        template_id: monthlyReportTemplateId,
        name: 'Monthly Business Report',
        description: 'Template for monthly business astrological reports',
        content_type: 'monthly_report',
        template_content: '# Monthly Astrological Report for {{business_name}}\n\n## Overview\n{{monthly_overview}}\n\n## Key Dates\n{{key_dates}}\n\n## Focus Areas\n{{focus_areas}}\n\n## Challenges\n{{challenges}}\n\n## Opportunities\n{{opportunities}}\n\n## Recommendations\n{{recommendations}}',
        required_variables: JSON.stringify(['business_name', 'monthly_overview', 'key_dates', 'focus_areas', 'challenges', 'opportunities', 'recommendations']),
        tier_access: 'subscription',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        template_id: nameAnalysisTemplateId,
        name: 'Business Name Analysis',
        description: 'Template for business name numerological analysis',
        content_type: 'name_analysis',
        template_content: '# Numerological Analysis for {{business_name}}\n\n## Name Number\nThe numerological value of {{business_name}} is {{name_number}}.\n\n## Meaning\n{{number_meaning}}\n\n## Strengths\n{{strengths}}\n\n## Challenges\n{{challenges}}\n\n## Recommendations\n{{recommendations}}',
        required_variables: JSON.stringify(['business_name', 'name_number', 'number_meaning', 'strengths', 'challenges', 'recommendations']),
        tier_access: 'free',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);

    // Create content variables
    await queryInterface.bulkInsert('content_variables', [
      {
        variable_id: uuidv4(),
        name: 'planet',
        description: 'Astrological planet',
        variable_type: 'text',
        possible_values: JSON.stringify(['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto']),
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        variable_id: uuidv4(),
        name: 'zodiac_sign',
        description: 'Zodiac sign',
        variable_type: 'text',
        possible_values: JSON.stringify(['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces']),
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        variable_id: uuidv4(),
        name: 'focus_area',
        description: 'Business focus area',
        variable_type: 'text',
        possible_values: JSON.stringify(['marketing', 'sales', 'operations', 'finance', 'human resources', 'product development', 'customer service', 'strategic planning']),
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);

    // Create sample generated content
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    await queryInterface.bulkInsert('generated_content', [
      {
        content_id: uuidv4(),
        user_id: testUserId,
        business_id: businessId,
        template_id: dailyHoroscopeTemplateId,
        content_type: 'daily_horoscope',
        content: 'Today, Astro Tech Solutions, the position of Jupiter in Aries suggests a powerful opportunity for expansion. Focus on marketing for optimal results. Consider launching that new campaign you\'ve been planning.',
        variables_used: JSON.stringify({
          business_name: 'Astro Tech Solutions',
          planet: 'Jupiter',
          zodiac_sign: 'Aries',
          prediction: 'a powerful opportunity for expansion',
          focus_area: 'marketing',
          advice: 'Consider launching that new campaign you\'ve been planning.'
        }),
        generation_date: today,
        valid_from: today,
        valid_to: tomorrow,
        is_read: false,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    // Remove seeded data in reverse order
    await queryInterface.bulkDelete('generated_content', null, {});
    await queryInterface.bulkDelete('content_variables', null, {});
    await queryInterface.bulkDelete('content_templates', null, {});
    await queryInterface.bulkDelete('businesses', null, {});
    await queryInterface.bulkDelete('user_subscriptions', null, {});
    await queryInterface.bulkDelete('users', null, {});
    await queryInterface.bulkDelete('subscription_tiers', null, {});
  }
};
