import { DataTypes, Model } from 'sequelize';
import sequelize from '../../../config/sequelize.config';

interface TransitChartAttributes {
  transit_chart_id: string;
  user_id: string;
  chart_data: object;
  transit_time: Date;
  notes: string;
  created_at: Date;
  updated_at: Date;
}

class TransitChart extends Model<TransitChartAttributes> implements TransitChartAttributes {
  public transit_chart_id!: string;
  public user_id!: string;
  public chart_data!: object;
  public transit_time!: Date;
  public notes!: string;
  public created_at!: Date;
  public updated_at!: Date;
}

TransitChart.init(
  {
    transit_chart_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_id',
      },
      onDelete: 'CASCADE',
    },
    chart_data: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
    },
    transit_time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'transit_charts',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

export default TransitChart;