import { QueryInterface, DataTypes } from 'sequelize';

export = {
  up: async (queryInterface: QueryInterface, Sequelize: typeof DataTypes) => {
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
      event_type: {
        type: Sequelize.STRING,
        allowNull: false
      },
      event_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      event_data: {
        type: Sequelize.JSONB,
        allowNull: true
      },
      device_info: {
        type: Sequelize.JSONB,
        allowNull: true
      },
      session_id: {
        type: Sequelize.STRING,
        allowNull: true
      },
      ip_address: {
        type: Sequelize.STRING,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });

    // Create feature_usage table
    await queryInterface.createTable('feature_usage', {
      id: {
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
      feature_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      usage_count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      last_used_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      first_used_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      metadata: {
        type: Sequelize.JSONB,
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
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      end_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('active', 'paused', 'completed'),
        defaultValue: 'active',
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

    // Create ab_test_assignments table
    await queryInterface.createTable('ab_test_assignments', {
      id: {
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
        allowNull: false,
        references: {
          model: 'users',
          key: 'user_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      variant: {
        type: Sequelize.STRING,
        allowNull: false
      },
      converted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      conversion_data: {
        type: Sequelize.JSONB,
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
      current_step: {
        type: Sequelize.STRING,
        allowNull: false
      },
      completed_steps: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: []
      },
      start_date: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      completion_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('in_progress', 'completed', 'abandoned'),
        defaultValue: 'in_progress',
        allowNull: false
      },
      metadata: {
        type: Sequelize.JSONB,
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

    // Create data_exports table
    await queryInterface.createTable('data_exports', {
      export_id: {
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
      export_type: {
        type: Sequelize.STRING,
        allowNull: false
      },
      file_format: {
        type: Sequelize.ENUM('csv', 'json', 'excel'),
        defaultValue: 'csv',
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('pending', 'processing', 'completed', 'failed'),
        defaultValue: 'pending',
        allowNull: false
      },
      file_url: {
        type: Sequelize.STRING,
        allowNull: true
      },
      parameters: {
        type: Sequelize.JSONB,
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

    // Create indexes
    await queryInterface.addIndex('analytics_events', ['user_id']);
    await queryInterface.addIndex('analytics_events', ['event_type']);
    await queryInterface.addIndex('analytics_events', ['event_name']);
    await queryInterface.addIndex('analytics_events', ['created_at']);
    await queryInterface.addIndex('feature_usage', ['user_id']);
    await queryInterface.addIndex('feature_usage', ['feature_name']);
    await queryInterface.addIndex('ab_tests', ['test_name']);
    await queryInterface.addIndex('ab_tests', ['status']);
    await queryInterface.addIndex('ab_test_assignments', ['test_id']);
    await queryInterface.addIndex('ab_test_assignments', ['user_id']);
    await queryInterface.addIndex('user_journeys', ['user_id']);
    await queryInterface.addIndex('user_journeys', ['journey_name']);
    await queryInterface.addIndex('user_journeys', ['status']);
    await queryInterface.addIndex('data_exports', ['user_id']);
    await queryInterface.addIndex('data_exports', ['status']);
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('data_exports');
    await queryInterface.dropTable('user_journeys');
    await queryInterface.dropTable('ab_test_assignments');
    await queryInterface.dropTable('ab_tests');
    await queryInterface.dropTable('feature_usage');
    await queryInterface.dropTable('analytics_events');
  }
};
