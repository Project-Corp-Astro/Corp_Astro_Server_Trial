import { Model, DataTypes, Optional, Sequelize } from 'sequelize';

interface UserJourneyAttributes {
  journey_id: string;
  user_id: string;
  journey_name: string;
  current_step: string;
  total_steps: number;
  completed: boolean;
  started_at: Date;
  completed_at?: Date;
  journey_data?: Record<string, any>;
  created_at: Date;
  updated_at: Date;
}

interface UserJourneyCreationAttributes extends Optional<UserJourneyAttributes, 'journey_id' | 'completed' | 'completed_at' | 'created_at' | 'updated_at'> {}

class UserJourney extends Model<UserJourneyAttributes, UserJourneyCreationAttributes> implements UserJourneyAttributes {
  public journey_id!: string;
  public user_id!: string;
  public journey_name!: string;
  public current_step!: string;
  public total_steps!: number;
  public completed!: boolean;
  public started_at!: Date;
  public completed_at?: Date;
  public journey_data?: Record<string, any>;
  public created_at!: Date;
  public updated_at!: Date;

  static initModel(sequelize: Sequelize): typeof UserJourney {
    UserJourney.init({
      journey_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'user_id'
        }
      },
      journey_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      current_step: {
        type: DataTypes.STRING,
        allowNull: false
      },
      total_steps: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      started_at: {
        type: DataTypes.DATE,
        allowNull: false
      },
      completed_at: {
        type: DataTypes.DATE,
        allowNull: true
      },
      journey_data: {
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
      tableName: 'user_journeys',
      timestamps: true,
      indexes: [
        { fields: ['user_id'] },
        { fields: ['journey_name'] },
        { fields: ['completed'] }
      ]
    });

    return UserJourney;
  }

  static associate(models: any) {
    // Define associations here
    UserJourney.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  }
}

export default UserJourney;
