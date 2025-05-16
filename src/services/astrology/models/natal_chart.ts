import { DataTypes, Model } from 'sequelize';
import sequelize from '../../../config/sequelize.config';

export enum EntityType {
  USER = 'USER',
  BUSINESS = 'BUSINESS',
  PARTNER = 'PARTNER'
}

export enum Ayanamsa {
  LAHIRI = 'LAHIRI',
  RAMAN = 'RAMAN',
  KP = 'KP',
  TROPICAL = 'TROPICAL'
}

export enum HouseSystem {
  WHOLE_SIGN = 'WHOLE_SIGN',
  PLACIDUS = 'PLACIDUS',
  KOCH = 'KOCH',
  EQUAL = 'EQUAL'
}

export enum ZodiacSystem {
  TROPICAL = 'TROPICAL',
  SIDEREAL = 'SIDEREAL'
}

export interface NatalChartAttributes {
  chart_id: string;
  entity_type: EntityType;
  user_id?: string;
  business_id?: string;
  partner_id?: string;
  birth_date: string;
  birth_time: string;
  birth_location: string;
  birth_coordinates: string; // GEOMETRY(Point, 4326) as WKT string
  timezone_offset: number;
  ayanamsa: Ayanamsa;
  ayanamsa_value: number;
  house_system: HouseSystem;
  zodiac_system: ZodiacSystem;
  ascendant_sign: string;
  ascendant_degree: number;
  ascendant_degree_formatted?: string;
  chart_data: Record<string, any>;
  created_at: Date;
  updated_at: Date;
}

class NatalChart extends Model<NatalChartAttributes> implements NatalChartAttributes {
  public chart_id!: string;
  public entity_type!: EntityType;
  public user_id?: string;
  public business_id?: string;
  public partner_id?: string;
  public birth_date!: string;
  public birth_time!: string;
  public birth_location!: string;
  public birth_coordinates!: string;
  public timezone_offset!: number;
  public ayanamsa!: Ayanamsa;
  public ayanamsa_value!: number;
  public house_system!: HouseSystem;
  public zodiac_system!: ZodiacSystem;
  public ascendant_sign!: string;
  public ascendant_degree!: number;
  public ascendant_degree_formatted?: string;
  public chart_data!: Record<string, any>;
  public created_at!: Date;
  public updated_at!: Date;
}

NatalChart.init(
    {
      chart_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
      entity_type: {
        type: DataTypes.ENUM(...Object.values(EntityType)),
        allowNull: false
      },
      user_id: {
        type: DataTypes.UUID,
        references: {
          model: 'users',
          key: 'user_id'
        }

      },
      business_id: {
        type: DataTypes.UUID,
        references: {
          model: 'business_profiles',
          key: 'business_id'
        }
      },
      partner_id: {
        type: DataTypes.UUID,
        references: {
          model: 'business_partners',
          key: 'partner_id'
        }
      },
      birth_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      birth_time: {
        type: DataTypes.TIME,
        allowNull: false
      },
      birth_location: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      birth_coordinates: {
        type: DataTypes.STRING, // Store as WKT (e.g., 'POINT(-122.4194 37.7749)')
        allowNull: false,
        comment: 'GEOMETRY(Point, 4326) stored as WKT string; use sequelize-geo for PostGIS'
      },
      timezone_offset: {
        type: DataTypes.DECIMAL(6, 2),
        allowNull: false,
        validate: {
          min: -720.0,
          max: 720.0
        }
      },
      ayanamsa: {
        type: DataTypes.ENUM(...Object.values(Ayanamsa)),
        defaultValue: Ayanamsa.LAHIRI,
        allowNull: false
      },
      ayanamsa_value: {
        type: DataTypes.DECIMAL(10, 6),
        allowNull: false
      },
      house_system: {
        type: DataTypes.ENUM(...Object.values(HouseSystem)),
        defaultValue: HouseSystem.WHOLE_SIGN,
        allowNull: false
      },
      zodiac_system: {
        type: DataTypes.ENUM(...Object.values(ZodiacSystem)),
        defaultValue: ZodiacSystem.SIDEREAL,
        allowNull: false
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
    },
    {
      sequelize,
      tableName: 'natal_charts',
      timestamps: true,
      underscored: true,
      validate: {
        entityReferenceCheck() {
          if (
            (this.entity_type === EntityType.USER && !this.user_id) ||
            (this.entity_type === EntityType.BUSINESS && !this.business_id) ||
            (this.entity_type === EntityType.PARTNER && !this.partner_id) ||
            (this.entity_type === EntityType.USER && (this.business_id || this.partner_id)) ||
            (this.entity_type === EntityType.BUSINESS && (this.user_id || this.partner_id)) ||
            (this.entity_type === EntityType.PARTNER && (this.user_id || this.business_id))
          ) {
            throw new Error(
              'entity_reference_check constraint violated: exactly one of user_id, business_id, or partner_id must be set based on entity_type'
            );
          }
        }
      }
    }
  );
  export default NatalChart;