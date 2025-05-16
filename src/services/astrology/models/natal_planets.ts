import { Model, DataTypes } from 'sequelize';
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

export interface NatalPlanetAttributes {
  position_id: string;
  chart_id: string;
  planet: Planet;
  sign: string;
  house: number;
  longitude: number;
  degree_formatted?: string;
  is_retrograde: boolean;
  retrograde_indicator?: string;
  speed?: number;
  nakshatra?: string;
  nakshatra_pada?: number;
  created_at: Date;
}

export class NatalPlanet extends Model<NatalPlanetAttributes> implements NatalPlanetAttributes {
  public position_id!: string;
  public chart_id!: string;
  public planet!: Planet;
  public sign!: string;
  public house!: number;
  public longitude!: number;
  public degree_formatted?: string;
  public is_retrograde!: boolean;
  public retrograde_indicator?: string;
  public speed?: number;
  public nakshatra?: string;
  public nakshatra_pada?: number;
  public created_at!: Date;
}

  NatalPlanet.init(
    {
      position_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
      chart_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'natal_charts',
          key: 'chart_id',
        }
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
      speed: {
        type: DataTypes.DECIMAL(10, 6),
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
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      }
    },
    {
      sequelize,
      tableName: 'natal_planets',
      timestamps: true,
      updatedAt: false, // No updated_at column
      underscored: true
    }
  );
  export default NatalPlanet;