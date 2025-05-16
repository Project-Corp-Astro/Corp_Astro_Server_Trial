import { DataTypes, Model } from 'sequelize';
import sequelize from '../../../config/sequelize.config';

interface TransitChartPlanetAttributes {
  position_id: string;
  transit_id: string;
  planet: string;
  sign: string | null;
  house: number | null;
  degree_formatted: string | null;
  is_retrograde: boolean;
  retrograde_indicator: string;
  created_at: Date;
  updated_at: Date;
}

class TransitChartPlanet extends Model<TransitChartPlanetAttributes> implements TransitChartPlanetAttributes {
  public position_id!: string;
  public transit_id!: string;
  public planet!: string;
  public sign!: string | null;
  public house!: number | null;
  public degree_formatted!: string | null;
  public is_retrograde!: boolean;
  public retrograde_indicator!: string;
  public created_at!: Date;
  public updated_at!: Date;
}

TransitChartPlanet.init(
  {
    position_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    transit_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'transit_charts',
        key: 'transit_chart_id',
      },
      onDelete: 'CASCADE',
    },
    planet: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    sign: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    house: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    degree_formatted: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    is_retrograde: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    retrograde_indicator: {
      type: DataTypes.STRING(5),
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
    tableName: 'transit_chart_planets',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        fields: ['transit_id'],
      },
    ],
  }
);

export default TransitChartPlanet;