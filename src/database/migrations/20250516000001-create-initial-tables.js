'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create users table
    await queryInterface.createTable('users', {
      user_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      password_hash: {
        type: Sequelize.STRING,
        allowNull: false
      },
      first_name: {
        type: Sequelize.STRING,
        allowNull: true
      },
      last_name: {
        type: Sequelize.STRING,
        allowNull: true
      },
      date_of_birth: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      birth_time: {
        type: Sequelize.TIME,
        allowNull: true
      },
      birth_place: {
        type: Sequelize.STRING,
        allowNull: true
      },
      birth_coordinates: {
        type: Sequelize.JSONB,
        allowNull: true
      },
      role: {
        type: Sequelize.ENUM('user', 'admin', 'super_admin'),
        defaultValue: 'user'
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      last_login: {
        type: Sequelize.DATE,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Create user_devices table
    await queryInterface.createTable('user_devices', {
      device_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'user_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      device_type: {
        type: Sequelize.ENUM('ios', 'android', 'web', 'other'),
        allowNull: false
      },
      device_token: {
        type: Sequelize.STRING,
        allowNull: true
      },
      device_name: {
        type: Sequelize.STRING,
        allowNull: true
      },
      os_version: {
        type: Sequelize.STRING,
        allowNull: true
      },
      app_version: {
        type: Sequelize.STRING,
        allowNull: true
      },
      last_active: {
        type: Sequelize.DATE,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Create authentication_logs table
    await queryInterface.createTable('authentication_logs', {
      log_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'user_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      device_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'user_devices',
          key: 'device_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      action: {
        type: Sequelize.ENUM('login', 'logout', 'failed_login', 'password_reset', 'token_refresh'),
        allowNull: false
      },
      ip_address: {
        type: Sequelize.STRING,
        allowNull: true
      },
      user_agent: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('success', 'failure'),
        allowNull: false
      },
      details: {
        type: Sequelize.JSONB,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Create subscription_tiers table
    await queryInterface.createTable('subscription_tiers', {
      tier_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      billing_cycle: {
        type: Sequelize.ENUM('monthly', 'quarterly', 'annual'),
        allowNull: false,
        defaultValue: 'monthly'
      },
      features: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: {}
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Create user_subscriptions table
    await queryInterface.createTable('user_subscriptions', {
      subscription_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'user_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      tier_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'subscription_tiers',
          key: 'tier_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      start_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      end_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      auto_renew: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      status: {
        type: Sequelize.ENUM('active', 'expired', 'cancelled', 'pending'),
        allowNull: false,
        defaultValue: 'active'
      },
      payment_provider: {
        type: Sequelize.STRING,
        allowNull: true
      },
      payment_provider_subscription_id: {
        type: Sequelize.STRING,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Create subscription_history table
    await queryInterface.createTable('subscription_history', {
      history_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      subscription_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'user_subscriptions',
          key: 'subscription_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      action: {
        type: Sequelize.ENUM('created', 'renewed', 'cancelled', 'expired', 'tier_changed', 'payment_failed'),
        allowNull: false
      },
      previous_tier_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'subscription_tiers',
          key: 'tier_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      new_tier_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'subscription_tiers',
          key: 'tier_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      details: {
        type: Sequelize.JSONB,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Create payment_transactions table
    await queryInterface.createTable('payment_transactions', {
      transaction_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'user_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      subscription_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'user_subscriptions',
          key: 'subscription_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      currency: {
        type: Sequelize.STRING(3),
        allowNull: false,
        defaultValue: 'USD'
      },
      payment_provider: {
        type: Sequelize.STRING,
        allowNull: false
      },
      payment_provider_transaction_id: {
        type: Sequelize.STRING,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('pending', 'completed', 'failed', 'refunded'),
        allowNull: false
      },
      details: {
        type: Sequelize.JSONB,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Create businesses table
    await queryInterface.createTable('businesses', {
      business_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'user_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      registration_date: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      registration_time: {
        type: Sequelize.TIME,
        allowNull: true
      },
      registration_place: {
        type: Sequelize.STRING,
        allowNull: true
      },
      registration_coordinates: {
        type: Sequelize.JSONB,
        allowNull: true
      },
      industry: {
        type: Sequelize.STRING,
        allowNull: true
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      logo_url: {
        type: Sequelize.STRING,
        allowNull: true
      },
      website: {
        type: Sequelize.STRING,
        allowNull: true
      },
      contact_email: {
        type: Sequelize.STRING,
        allowNull: true
      },
      contact_phone: {
        type: Sequelize.STRING,
        allowNull: true
      },
      address: {
        type: Sequelize.JSONB,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Create content_templates table
    await queryInterface.createTable('content_templates', {
      template_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      content_type: {
        type: Sequelize.ENUM('daily_horoscope', 'monthly_report', 'business_analysis', 'name_analysis', 'color_analysis', 'tagline_analysis'),
        allowNull: false
      },
      template_content: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      required_variables: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: []
      },
      tier_access: {
        type: Sequelize.ENUM('free', 'subscription', 'premium', 'all'),
        allowNull: false,
        defaultValue: 'all'
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Create content_variables table
    await queryInterface.createTable('content_variables', {
      variable_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      variable_type: {
        type: Sequelize.ENUM('text', 'number', 'date', 'boolean', 'json'),
        allowNull: false
      },
      default_value: {
        type: Sequelize.JSONB,
        allowNull: true
      },
      possible_values: {
        type: Sequelize.JSONB,
        allowNull: true
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Create generated_content table
    await queryInterface.createTable('generated_content', {
      content_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'user_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      business_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'businesses',
          key: 'business_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      template_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'content_templates',
          key: 'template_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      content_type: {
        type: Sequelize.ENUM('daily_horoscope', 'monthly_report', 'business_analysis', 'name_analysis', 'color_analysis', 'tagline_analysis'),
        allowNull: false
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      variables_used: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: {}
      },
      generation_date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      valid_from: {
        type: Sequelize.DATE,
        allowNull: false
      },
      valid_to: {
        type: Sequelize.DATE,
        allowNull: false
      },
      is_read: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Create indices for performance
    await queryInterface.addIndex('users', ['email']);
    await queryInterface.addIndex('user_devices', ['user_id']);
    await queryInterface.addIndex('authentication_logs', ['user_id']);
    await queryInterface.addIndex('user_subscriptions', ['user_id']);
    await queryInterface.addIndex('user_subscriptions', ['tier_id']);
    await queryInterface.addIndex('user_subscriptions', ['status']);
    await queryInterface.addIndex('businesses', ['user_id']);
    await queryInterface.addIndex('generated_content', ['user_id']);
    await queryInterface.addIndex('generated_content', ['business_id']);
    await queryInterface.addIndex('generated_content', ['content_type']);
    await queryInterface.addIndex('generated_content', ['generation_date']);
    
    // Create analytics_events table
    await queryInterface.createTable('analytics_events', {
      event_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'user_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      session_id: {
        type: Sequelize.STRING,
        allowNull: true
      },
      event_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      event_category: {
        type: Sequelize.STRING,
        allowNull: false
      },
      event_action: {
        type: Sequelize.STRING,
        allowNull: false
      },
      properties: {
        type: Sequelize.JSONB,
        allowNull: true
      },
      client_timestamp: {
        type: Sequelize.DATE,
        allowNull: true
      },
      server_timestamp: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Create user_journeys table
    await queryInterface.createTable('user_journeys', {
      journey_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'user_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      journey_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      journey_stage: {
        type: Sequelize.STRING,
        allowNull: false
      },
      start_time: {
        type: Sequelize.DATE,
        allowNull: false
      },
      completion_time: {
        type: Sequelize.DATE,
        allowNull: true
      },
      is_completed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      journey_data: {
        type: Sequelize.JSONB,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Create feature_usage table
    await queryInterface.createTable('feature_usage', {
      usage_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'user_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      session_id: {
        type: Sequelize.STRING,
        allowNull: true
      },
      feature_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      feature_category: {
        type: Sequelize.STRING,
        allowNull: false
      },
      duration: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      result: {
        type: Sequelize.STRING,
        allowNull: true
      },
      usage_data: {
        type: Sequelize.JSONB,
        allowNull: true
      },
      timestamp: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Create ab_tests table
    await queryInterface.createTable('ab_tests', {
      test_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      test_name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      variants: {
        type: Sequelize.JSONB,
        allowNull: false
      },
      start_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      end_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Create ab_test_assignments table
    await queryInterface.createTable('ab_test_assignments', {
      assignment_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      test_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'ab_tests',
          key: 'test_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'user_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      session_id: {
        type: Sequelize.STRING,
        allowNull: true
      },
      variant: {
        type: Sequelize.STRING,
        allowNull: false
      },
      converted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      conversion_value: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      conversion_time: {
        type: Sequelize.DATE,
        allowNull: true
      },
      assigned_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Create heatmap_interactions table
    await queryInterface.createTable('heatmap_interactions', {
      interaction_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'user_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      session_id: {
        type: Sequelize.STRING,
        allowNull: true
      },
      page_url: {
        type: Sequelize.STRING,
        allowNull: false
      },
      interaction_type: {
        type: Sequelize.STRING,
        allowNull: false
      },
      coordinates: {
        type: Sequelize.JSONB,
        allowNull: false
      },
      timestamp: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Create astrology_metrics table
    await queryInterface.createTable('astrology_metrics', {
      metric_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'user_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      metric_type: {
        type: Sequelize.ENUM('chart_generation', 'horoscope_view', 'business_forecast', 'free_tool', 'subscription_change', 'ai_chat'),
        allowNull: false
      },
      business_id: {
        type: Sequelize.UUID,
        allowNull: true
      },
      content_id: {
        type: Sequelize.STRING,
        allowNull: true
      },
      metric_data: {
        type: Sequelize.JSONB,
        allowNull: true
      },
      timestamp: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Create indices for better query performance
    await queryInterface.addIndex('analytics_events', ['user_id']);
    await queryInterface.addIndex('analytics_events', ['event_category']);
    await queryInterface.addIndex('analytics_events', ['event_name']);
    await queryInterface.addIndex('analytics_events', ['server_timestamp']);
    
    await queryInterface.addIndex('user_journeys', ['user_id']);
    await queryInterface.addIndex('user_journeys', ['journey_name']);
    await queryInterface.addIndex('user_journeys', ['is_completed']);
    
    await queryInterface.addIndex('feature_usage', ['user_id']);
    await queryInterface.addIndex('feature_usage', ['feature_name']);
    await queryInterface.addIndex('feature_usage', ['timestamp']);
    
    await queryInterface.addIndex('ab_test_assignments', ['test_id']);
    await queryInterface.addIndex('ab_test_assignments', ['user_id']);
    await queryInterface.addIndex('ab_test_assignments', ['variant']);
    await queryInterface.addIndex('ab_test_assignments', ['converted']);
    
    await queryInterface.addIndex('astrology_metrics', ['user_id']);
    await queryInterface.addIndex('astrology_metrics', ['metric_type']);
    await queryInterface.addIndex('astrology_metrics', ['timestamp']);
  },

  down: async (queryInterface, Sequelize) => {
    // Drop tables in reverse order to avoid foreign key constraints
    await queryInterface.dropTable('generated_content');
    await queryInterface.dropTable('content_variables');
    await queryInterface.dropTable('content_templates');
    await queryInterface.dropTable('businesses');
    await queryInterface.dropTable('payment_transactions');
    await queryInterface.dropTable('subscription_history');
    await queryInterface.dropTable('user_subscriptions');
    await queryInterface.dropTable('subscription_tiers');
    // Drop analytics tables
    await queryInterface.dropTable('astrology_metrics');
    await queryInterface.dropTable('heatmap_interactions');
    await queryInterface.dropTable('ab_test_assignments');
    await queryInterface.dropTable('ab_tests');
    await queryInterface.dropTable('feature_usage');
    await queryInterface.dropTable('user_journeys');
    await queryInterface.dropTable('analytics_events');
    
    // Drop user tables
    await queryInterface.dropTable('authentication_logs');
    await queryInterface.dropTable('user_devices');
    await queryInterface.dropTable('users');
  }
};
