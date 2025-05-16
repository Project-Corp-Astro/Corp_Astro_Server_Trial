import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../../config/sequelize.config';

export enum Planet {
  SUN = 'SUN',
  MOON = 'MOON',
  MERCURY = 'MERCURY',
  VENUS = 'VENUS',
  MARS = 'MARS',
  JUPITER = 'JUPITER',
  SATURN = 'SATURN',
  RAHU = 'RAHU',
  KETU = 'KETU',
  URANUS = 'URANUS',
  NEPTUNE = 'NEPTUNE',
  PLUTO = 'PLUTO'
}

interface DerivedChartPlanetAttributes {
  position_id: string;
  derived_chart_id: string;
  planet: Planet;
  sign: string;
  house: number;
  longitude: number;
  degree_formatted?: string;
  is_retrograde: boolean;
  retrograde_indicator?: string;
  nakshatra?: string;
  nakshatra_pada?: number;
  additional_attributes?: object;
  deity?: string;
  shashtiamsha?: string;
  sub_lord?: string;
  created_at?: Date;
}

type DerivedChartPlanetCreationAttributes = Optional<DerivedChartPlanetAttributes, 'position_id' | 'created_at'>;

export class DerivedChartPlanet extends Model<DerivedChartPlanetAttributes, DerivedChartPlanetCreationAttributes> implements DerivedChartPlanetAttributes {
  public position_id!: string;
  public derived_chart_id!: string;
  public planet!: Planet;
  public sign!: string;
  public house!: number;
  public longitude!: number;
  public degree_formatted?: string;
  public is_retrograde!: boolean;
  public retrograde_indicator?: string;
  public nakshatra?: string;
  public nakshatra_pada?: number;
  public additional_attributes?: object;
  public readonly created_at!: Date;
  public deity?: string;
  public shashtiamsha?: string;
  public sub_lord?: string;
}

DerivedChartPlanet.init({
  position_id: {
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
  planet: {
    type: DataTypes.ENUM(...Object.values(Planet)),
    allowNull: false
  },
  sign: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  house: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 12
    }
  },
  longitude: {
    type: DataTypes.DECIMAL(10, 6),
    allowNull: false
  },
  degree_formatted: {
    type: DataTypes.STRING(30),
    allowNull: true
  },
  is_retrograde: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  retrograde_indicator: {
    type: DataTypes.STRING(1),
    allowNull: true
  },
  nakshatra: {
    type: DataTypes.STRING(30),
    allowNull: true
  },
  nakshatra_pada: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  additional_attributes: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  deity: {
    type: DataTypes.STRING(30),
    allowNull: true
  },
  shashtiamsha: {
    type: DataTypes.STRING(30),
    allowNull: true
  },
  sub_lord: {
    type: DataTypes.STRING,
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  tableName: 'derived_chart_planets',
  schema: 'public',
  timestamps: true
});

export default DerivedChartPlanet;