import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../../config/sequelize.config';

interface DerivedChartHouseAttributes {
  house_id: string;
  derived_chart_id: string;
  house_number: number;
  sign: string;
  start_longitude: number;
  start_longitude_formatted?: string;
  house_lord: string;
  additional_attributes?: object;
  created_at?: Date;
}

type DerivedChartHouseCreationAttributes = Optional<DerivedChartHouseAttributes, 'house_id' | 'created_at'>;

export class DerivedChartHouse extends Model<DerivedChartHouseAttributes, DerivedChartHouseCreationAttributes> implements DerivedChartHouseAttributes {
  public house_id!: string;
  public derived_chart_id!: string;
  public house_number!: number;
  public sign!: string;
  public start_longitude!: number;
  public start_longitude_formatted?: string;
  public house_lord!: string;
  public additional_attributes?: object;
  public readonly created_at!: Date;
}

DerivedChartHouse.init({
  house_id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  derived_chart_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'derived_charts',
      key: 'derived_chart_id'
    },
    onDelete: 'CASCADE'
  },
  house_number: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 12
    }
  },
  sign: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  start_longitude: {
    type: DataTypes.DECIMAL(10, 6),
    allowNull: false
  },
  start_longitude_formatted: {
    type: DataTypes.STRING(30),
    allowNull: true
  },
  house_lord: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  additional_attributes: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  tableName: 'derived_chart_houses',
  schema: 'public',
  timestamps: true
});

export default DerivedChartHouse;