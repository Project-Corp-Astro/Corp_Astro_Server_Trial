'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create content_items table
    await queryInterface.createTable('content_items', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      content_type: {
        type: Sequelize.ENUM('daily_horoscope', 'monthly_report', 'business_forecast', 'article', 'tool_result'),
        allowNull: false
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      metadata: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: {}
      },
      publish_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      expiry_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      subscription_tier_required: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: 'free'
      },
      active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Create user_content table
    await queryInterface.createTable('user_content', {
      id: {
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
      content_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'content_items',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      viewed_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      favorite: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      user_rating: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: {
          min: 1,
          max: 5
        }
      },
      user_feedback: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Create business_profiles table
    await queryInterface.createTable('business_profiles', {
      id: {
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
      business_name: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      founding_date: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      founding_time: {
        type: Sequelize.STRING(10),
        allowNull: true
      },
      founding_location: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      industry: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      business_description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      logo_url: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      business_size: {
        type: Sequelize.ENUM('startup', 'small', 'medium', 'large', 'enterprise'),
        allowNull: false,
        defaultValue: 'small'
      },
      key_personnel: {
        type: Sequelize.JSONB,
        allowNull: true
      },
      metadata: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: {}
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Create indices for better query performance
    await queryInterface.addIndex('content_items', ['content_type']);
    await queryInterface.addIndex('content_items', ['publish_date']);
    await queryInterface.addIndex('content_items', ['subscription_tier_required']);
    await queryInterface.addIndex('content_items', ['active']);

    await queryInterface.addIndex('user_content', ['user_id']);
    await queryInterface.addIndex('user_content', ['content_id']);
    await queryInterface.addIndex('user_content', ['viewed_at']);
    await queryInterface.addIndex('user_content', ['favorite']);

    await queryInterface.addIndex('business_profiles', ['user_id']);
    await queryInterface.addIndex('business_profiles', ['business_name']);
    await queryInterface.addIndex('business_profiles', ['industry']);
  },

  down: async (queryInterface, Sequelize) => {
    // Drop tables in reverse order to avoid foreign key constraints
    await queryInterface.dropTable('business_profiles');
    await queryInterface.dropTable('user_content');
    await queryInterface.dropTable('content_items');
  }
};
