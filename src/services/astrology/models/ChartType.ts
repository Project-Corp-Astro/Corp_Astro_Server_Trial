import { Model, DataTypes, Sequelize } from 'sequelize';
import sequelize from '../../../config/sequelize.config';

// Define the attributes interface
export interface ChartTypeAttributes {
  chart_type_id: number;
  chart_code: string;
  chart_name: string;
  chart_category: string;
  divisional_factor?: number;
  description?: string;
  calculation_method: string;
  api_endpoint: string;
  created_at?: Date;
  updated_at?: Date;
}

class ChartType extends Model<ChartTypeAttributes> implements ChartTypeAttributes {
  public chart_type_id!: number;
  public chart_code!: string; // <-- ADD THIS
  public chart_name!: string;
  public chart_category!: string;
  public divisional_factor?: number;
  public description?: string;
  public calculation_method!: string;
  public api_endpoint!: string;
  public created_at?: Date;
  public updated_at?: Date;
}

ChartType.init(
  {
    chart_type_id: {
      type: DataTypes.INTEGER,
      primaryKey: true, 
      autoIncrement: true,
    },
    chart_code: {
      type: DataTypes.STRING(20),
      unique: true,
      allowNull: false,
    },
    chart_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,   // <-- ADD THIS
    },    
    chart_category: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    divisional_factor: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    calculation_method: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    api_endpoint: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
  },
  {
    sequelize,
    tableName: 'chart_types',
    timestamps: true,
    underscored: true,
  }
);

export default ChartType;