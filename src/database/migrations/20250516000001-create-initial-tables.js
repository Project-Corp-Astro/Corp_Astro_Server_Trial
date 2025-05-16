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
    await queryInterface.dropTable('authentication_logs');
    await queryInterface.dropTable('user_devices');
    await queryInterface.dropTable('users');
  }
};
