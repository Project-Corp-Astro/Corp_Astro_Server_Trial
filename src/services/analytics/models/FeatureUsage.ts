import { Model, DataTypes, Optional, Sequelize } from 'sequelize';

interface FeatureUsageAttributes {
  usage_id: string;
  user_id?: string;
  feature_name: string;
  feature_category: string;
  usage_count: number;
  last_used_at: Date;
  usage_duration?: number; // Duration in seconds
  usage_result?: 'success' | 'failure' | 'abandoned';
  usage_data?: Record<string, any>;
  created_at: Date;
  updated_at: Date;
}

interface FeatureUsageCreationAttributes extends Optional<FeatureUsageAttributes, 'usage_id' | 'usage_count' | 'created_at' | 'updated_at'> {}

class FeatureUsage extends Model<FeatureUsageAttributes, FeatureUsageCreationAttributes> implements FeatureUsageAttributes {
  public usage_id!: string;
  public user_id?: string;
  public feature_name!: string;
  public feature_category!: string;
  public usage_count!: number;
  public last_used_at!: Date;
  public usage_duration?: number;
  public usage_result?: 'success' | 'failure' | 'abandoned';
  public usage_data?: Record<string, any>;
  public created_at!: Date;
  public updated_at!: Date;

  static initModel(sequelize: Sequelize): typeof FeatureUsage {
    FeatureUsage.init({
      usage_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'user_id'
        }
      },
      feature_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      feature_category: {
        type: DataTypes.STRING,
        allowNull: false
      },
      usage_count: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false
      },
      last_used_at: {
        type: DataTypes.DATE,
        allowNull: false
      },
      usage_duration: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Duration in seconds'
      },
      usage_result: {
        type: DataTypes.ENUM('success', 'failure', 'abandoned'),
        allowNull: true
      },
      usage_data: {
        type: DataTypes.JSONB,
        allowNull: true
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      }
    }, {
      sequelize,
      tableName: 'feature_usage',
      timestamps: true,
      indexes: [
        { fields: ['user_id'] },
        { fields: ['feature_name'] },
        { fields: ['feature_category'] }
      ]
    });

    return FeatureUsage;
  }

  static associate(models: any) {
    // Define associations here
    FeatureUsage.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  }
}

export default FeatureUsage;
