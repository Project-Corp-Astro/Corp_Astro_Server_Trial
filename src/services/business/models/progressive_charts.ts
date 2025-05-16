// src/models/core/user_progressed_chart.model.ts
import { Model, DataTypes } from 'sequelize';
import sequelize from '../../../config/sequelize.config';

export interface UserProgressedChartAttributes {
  chart_id?: string;
  user_id: string;
  house_cusps: object;
  interpretations: object;
  progressed_ascendant: object;
  progressed_midheaven: object;
  progressed_planets: object;
  created_at?: Date;
}

class UserProgressedChart extends Model<UserProgressedChartAttributes> implements UserProgressedChartAttributes {
  public chart_id!: string;
  public user_id!: string;
  public house_cusps!: object;
  public interpretations!: object;
  public progressed_ascendant!: object;
  public progressed_midheaven!: object;
  public progressed_planets!: object;
  public created_at!: Date;
}

UserProgressedChart.init(
  {
    chart_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: sequelize.literal('uuid_generate_v4()'),
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
    house_cusps: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    interpretations: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    progressed_ascendant: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    progressed_midheaven: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    progressed_planets: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
  },
  {
    sequelize,
    tableName: 'user_progressed_charts',
    timestamps: false, // no updatedAt or createdAt tracking unless needed
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'chart_id'], // Ensures that a user can have only one progressed chart per record
      },
      {
        fields: ['user_id'], // Index for fast querying by user_id
      },
      {
        fields: ['created_at'], // Index for querying based on creation date, useful for time-based queries
      },
    ],
  }
);

export default UserProgressedChart;
