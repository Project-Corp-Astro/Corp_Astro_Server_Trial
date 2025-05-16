import { Model, DataTypes, Optional, Sequelize } from 'sequelize';

interface AnalyticsEventAttributes {
  event_id: string;
  user_id?: string;
  session_id: string;
  event_name: string;
  event_category: string;
  event_action: string;
  event_label?: string;
  event_value?: number;
  device_info?: Record<string, any>;
  page_url?: string;
  referrer?: string;
  properties?: Record<string, any>;
  client_timestamp: Date;
  created_at: Date;
}

interface AnalyticsEventCreationAttributes extends Optional<AnalyticsEventAttributes, 'event_id' | 'created_at'> {}

class AnalyticsEvent extends Model<AnalyticsEventAttributes, AnalyticsEventCreationAttributes> implements AnalyticsEventAttributes {
  public event_id!: string;
  public user_id?: string;
  public session_id!: string;
  public event_name!: string;
  public event_category!: string;
  public event_action!: string;
  public event_label?: string;
  public event_value?: number;
  public device_info?: Record<string, any>;
  public page_url?: string;
  public referrer?: string;
  public properties?: Record<string, any>;
  public client_timestamp!: Date;
  public created_at!: Date;

  static initModel(sequelize: Sequelize): typeof AnalyticsEvent {
    AnalyticsEvent.init({
      event_id: {
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
      session_id: {
        type: DataTypes.STRING,
        allowNull: false
      },
      event_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      event_category: {
        type: DataTypes.STRING,
        allowNull: false
      },
      event_action: {
        type: DataTypes.STRING,
        allowNull: false
      },
      event_label: {
        type: DataTypes.STRING,
        allowNull: true
      },
      event_value: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      device_info: {
        type: DataTypes.JSONB,
        allowNull: true
      },
      page_url: {
        type: DataTypes.STRING,
        allowNull: true
      },
      referrer: {
        type: DataTypes.STRING,
        allowNull: true
      },
      properties: {
        type: DataTypes.JSONB,
        allowNull: true
      },
      client_timestamp: {
        type: DataTypes.DATE,
        allowNull: false
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      }
    }, {
      sequelize,
      tableName: 'analytics_events',
      timestamps: false,
      indexes: [
        { fields: ['user_id'] },
        { fields: ['session_id'] },
        { fields: ['event_name'] },
        { fields: ['event_category'] },
        { fields: ['client_timestamp'] }
      ]
    });

    return AnalyticsEvent;
  }

  static associate(models: any) {
    // Define associations here
    AnalyticsEvent.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  }
}

export default AnalyticsEvent;
