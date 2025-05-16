import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../../config/sequelize.config';

interface DerivedChartAttributes {
  derived_chart_id: string;
  chart_code: string;
  api_endpoint?: string;
  user_id: string;
  chart_type_id: number;
  calculation_parameters?: object;
  ascendant_sign: string;
  ascendant_degree: number;
  ascendant_degree_formatted?: string;
  chart_data: object;
  notes?: string;
  created_at?: Date;
  updated_at?: Date;
}

type DerivedChartCreationAttributes = Optional<DerivedChartAttributes, 'derived_chart_id' | 'created_at' | 'updated_at'>;

export class DerivedChart extends Model<DerivedChartAttributes, DerivedChartCreationAttributes> implements DerivedChartAttributes {
  public derived_chart_id!: string;
  public chart_code!: string;
  public api_endpoint?: string;
  public user_id!: string;
  public chart_type_id!: number;
  public calculation_parameters?: object;
  public ascendant_sign!: string;
  public ascendant_degree!: number;
  public ascendant_degree_formatted?: string;
  public chart_data!: object;
  public notes?: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}
    DerivedChart.init({
      derived_chart_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      chart_code: {
        type: DataTypes.STRING(50),
        allowNull: false,
        references: {
          model: 'chart_types',
          key: 'chart_code'
        }
      },
      api_endpoint: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'user_id'
        },
        onDelete: 'CASCADE'
      },
      chart_type_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'chart_types',
          key: 'chart_type_id'
        }
      },
      calculation_parameters: {
        type: DataTypes.JSONB,
        allowNull: true
      },
      ascendant_sign: {
        type: DataTypes.STRING(20),
        allowNull: false
      },
      ascendant_degree: {
        type: DataTypes.DECIMAL(10, 6),
        allowNull: false
      },
      ascendant_degree_formatted: {
        type: DataTypes.STRING(30),
        allowNull: true
      },
      chart_data: {
        type: DataTypes.JSONB,
        allowNull: false
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    }, {
      sequelize,
      tableName: 'derived_charts',
      timestamps: false,
      indexes: [
        {
          unique: true,
          fields: ['user_id', 'chart_type_id']
        }
      ]
    });

export default DerivedChart;
