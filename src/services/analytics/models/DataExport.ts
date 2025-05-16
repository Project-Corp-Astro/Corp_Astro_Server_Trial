import { Model, DataTypes, Optional, Sequelize } from 'sequelize';

type ExportType = 'events' | 'journeys' | 'feature_usage' | 'ab_tests' | 'custom';
type ExportStatus = 'pending' | 'processing' | 'completed' | 'failed';

interface DataExportAttributes {
  export_id: string;
  export_name: string;
  export_type: ExportType;
  status: ExportStatus;
  file_url?: string;
  file_size?: number;
  query_params?: Record<string, any>;
  requested_by: string;
  requested_at: Date;
  completed_at?: Date;
  created_at: Date;
  updated_at: Date;
}

interface DataExportCreationAttributes extends Optional<DataExportAttributes, 'export_id' | 'status' | 'file_url' | 'file_size' | 'completed_at' | 'created_at' | 'updated_at'> {}

class DataExport extends Model<DataExportAttributes, DataExportCreationAttributes> implements DataExportAttributes {
  public export_id!: string;
  public export_name!: string;
  public export_type!: ExportType;
  public status!: ExportStatus;
  public file_url?: string;
  public file_size?: number;
  public query_params?: Record<string, any>;
  public requested_by!: string;
  public requested_at!: Date;
  public completed_at?: Date;
  public created_at!: Date;
  public updated_at!: Date;

  static initModel(sequelize: Sequelize): typeof DataExport {
    DataExport.init({
      export_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      export_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      export_type: {
        type: DataTypes.ENUM('events', 'journeys', 'feature_usage', 'ab_tests', 'custom'),
        allowNull: false
      },
      status: {
        type: DataTypes.ENUM('pending', 'processing', 'completed', 'failed'),
        defaultValue: 'pending',
        allowNull: false
      },
      file_url: {
        type: DataTypes.STRING,
        allowNull: true
      },
      file_size: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      query_params: {
        type: DataTypes.JSONB,
        allowNull: true
      },
      requested_by: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'user_id'
        }
      },
      requested_at: {
        type: DataTypes.DATE,
        allowNull: false
      },
      completed_at: {
        type: DataTypes.DATE,
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
      tableName: 'data_exports',
      timestamps: true,
      indexes: [
        { fields: ['requested_by'] },
        { fields: ['export_type'] },
        { fields: ['status'] }
      ]
    });

    return DataExport;
  }

  static associate(models: any) {
    // Define associations here
    DataExport.belongsTo(models.User, { foreignKey: 'requested_by', as: 'requester' });
  }
}

export default DataExport;
