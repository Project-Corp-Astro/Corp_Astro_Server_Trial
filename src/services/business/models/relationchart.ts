import { Model, DataTypes } from 'sequelize';
import sequelize from '../../../config/sequelize.config';

export interface RelationshipChartAttributes {
  relationship_chart_id?: string;
  chart_type_id: number;
  chart_name: string;
  description?: string;
  entity_ids: string[];
  chart_data: object;
  created_at?: Date;
  updated_at?: Date;
}

class RelationshipChart extends Model<RelationshipChartAttributes> implements RelationshipChartAttributes {
  public relationship_chart_id?: string;
  public chart_type_id!: number;
  public chart_name!: string;
  public description?: string;
  public entity_ids!: string[];
  public chart_data!: object;
  public created_at?: Date;
  public updated_at?: Date;
}

RelationshipChart.init(
  {
    relationship_chart_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: sequelize.fn('uuid_generate_v4'),
    },
    chart_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'chart_types',
        key: 'chart_type_id',
      },
      onDelete: 'CASCADE',
    },
    chart_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      references: {
        model: 'chart_types',
        key: 'chart_name',
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    entity_ids: {
      type: DataTypes.ARRAY(DataTypes.UUID),
      allowNull: false,
    },
    chart_data: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
  },
  {
    sequelize,
    tableName: 'relationship_charts',
    timestamps: false, // Because you're manually setting created_at, updated_at
    indexes: [  
      { fields: ['entity_ids'] },
      { fields: ['chart_type_id'] }, 
    ],
  }
);

export default RelationshipChart;
