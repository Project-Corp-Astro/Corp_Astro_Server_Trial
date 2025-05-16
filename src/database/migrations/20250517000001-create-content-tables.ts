import { QueryInterface, DataTypes } from 'sequelize';

export = {
  up: async (queryInterface: QueryInterface, Sequelize: typeof DataTypes) => {
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
        allowNull: true
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
        type: Sequelize.ENUM('free', 'basic', 'premium'),
        defaultValue: 'basic',
        allowNull: false
      },
      active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });

    // Create content_categories table
    await queryInterface.createTable('content_categories', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });

    // Create content_item_categories junction table
    await queryInterface.createTable('content_item_categories', {
      content_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'content_items',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        primaryKey: true
      },
      category_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'content_categories',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        primaryKey: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });

    // Create content_templates table
    await queryInterface.createTable('content_templates', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      template_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
      },
      content_type: {
        type: Sequelize.ENUM('daily_horoscope', 'monthly_report', 'business_forecast', 'article', 'tool_result'),
        allowNull: false
      },
      template_content: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      variables: {
        type: Sequelize.JSONB,
        allowNull: true
      },
      active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });

    // Create indexes
    await queryInterface.addIndex('content_items', ['content_type']);
    await queryInterface.addIndex('content_items', ['publish_date']);
    await queryInterface.addIndex('content_items', ['subscription_tier_required']);
    await queryInterface.addIndex('content_items', ['active']);
    await queryInterface.addIndex('content_categories', ['name']);
    await queryInterface.addIndex('content_templates', ['template_name']);
    await queryInterface.addIndex('content_templates', ['content_type']);
    await queryInterface.addIndex('content_templates', ['active']);
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('content_item_categories');
    await queryInterface.dropTable('content_templates');
    await queryInterface.dropTable('content_categories');
    await queryInterface.dropTable('content_items');
  }
};
