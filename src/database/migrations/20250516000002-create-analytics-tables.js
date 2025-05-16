'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
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
        allowNull: false
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
      event_label: {
        type: Sequelize.STRING,
        allowNull: true
      },
      event_value: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      device_info: {
        type: Sequelize.JSONB,
        allowNull: true
      },
      page_url: {
        type: Sequelize.STRING,
        allowNull: true
      },
      referrer: {
        type: Sequelize.STRING,
        allowNull: true
      },
      properties: {
        type: Sequelize.JSONB,
        allowNull: true
      },
      client_timestamp: {
        type: Sequelize.DATE,
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
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
      total_steps: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      completed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      started_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      completed_at: {
        type: Sequelize.DATE,
        allowNull: true
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
      feature_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      feature_category: {
        type: Sequelize.STRING,
        allowNull: false
      },
      usage_count: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
        allowNull: false
      },
      last_used_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      usage_duration: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'Duration in seconds'
      },
      usage_result: {
        type: Sequelize.ENUM('success', 'failure', 'abandoned'),
        allowNull: true
      },
      usage_data: {
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
        allowNull: false,
        comment: 'Array of variant configurations'
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
        allowNull: false
      },
      variant: {
        type: Sequelize.STRING,
        allowNull: false
      },
      converted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      assigned_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      converted_at: {
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

    // Create data_exports table
    await queryInterface.createTable('data_exports', {
      export_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      export_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      export_type: {
        type: Sequelize.ENUM('events', 'journeys', 'feature_usage', 'ab_tests', 'custom'),
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
      file_size: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      query_params: {
        type: Sequelize.JSONB,
        allowNull: true
      },
      requested_by: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'user_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      requested_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      completed_at: {
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

    // Create indices for performance
    await queryInterface.addIndex('analytics_events', ['user_id']);
    await queryInterface.addIndex('analytics_events', ['session_id']);
    await queryInterface.addIndex('analytics_events', ['event_name']);
    await queryInterface.addIndex('analytics_events', ['event_category']);
    await queryInterface.addIndex('analytics_events', ['client_timestamp']);
    
    await queryInterface.addIndex('user_journeys', ['user_id']);
    await queryInterface.addIndex('user_journeys', ['journey_name']);
    await queryInterface.addIndex('user_journeys', ['completed']);
    
    await queryInterface.addIndex('feature_usage', ['user_id']);
    await queryInterface.addIndex('feature_usage', ['feature_name']);
    await queryInterface.addIndex('feature_usage', ['feature_category']);
    
    await queryInterface.addIndex('ab_tests', ['test_name']);
    await queryInterface.addIndex('ab_tests', ['is_active']);
    
    await queryInterface.addIndex('ab_test_assignments', ['test_id']);
    await queryInterface.addIndex('ab_test_assignments', ['user_id']);
    await queryInterface.addIndex('ab_test_assignments', ['session_id']);
    await queryInterface.addIndex('ab_test_assignments', ['variant']);
    await queryInterface.addIndex('ab_test_assignments', ['converted']);
  },

  down: async (queryInterface, Sequelize) => {
    // Drop tables in reverse order
    await queryInterface.dropTable('data_exports');
    await queryInterface.dropTable('ab_test_assignments');
    await queryInterface.dropTable('ab_tests');
    await queryInterface.dropTable('feature_usage');
    await queryInterface.dropTable('user_journeys');
    await queryInterface.dropTable('analytics_events');
  }
};
