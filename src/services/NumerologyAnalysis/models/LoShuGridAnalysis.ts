import { DataTypes, Model } from 'sequelize';
import sequelize from '../../../config/sequelize.config';

export interface LoShuGridAnalysisAttributes {
  grid_id?: string;
  entity_type: 'user' | 'partner' | 'business';
  entity_id: string;
  birth_date: Date;
  gender:'male' | 'female' | 'others';
  grid_numbers: number[];
  grid_representation: object;
  missing_numbers: number[];
  excess_numbers?: object;
  diagonal_analysis?: object;
  element_balance?: object;
  personality_assessment?: string;
  strength_assessment?: string;
  recommendation?: string;
  numerology_system_id: number;
  created_at?: Date;
  updated_at?: Date;
}

class LoShuGridAnalysis extends Model<LoShuGridAnalysisAttributes> implements LoShuGridAnalysisAttributes {
  public grid_id!: string;
  public entity_type!: 'user' | 'partner' | 'business';
  public entity_id!: string;
  public birth_date!: Date;
  public gender!:'male' | 'female' | 'others';
  public grid_numbers!: number[];
  public grid_representation!: object;
  public missing_numbers!: number[];
  public excess_numbers?: object;
  public diagonal_analysis?: object;
  public element_balance?: object;
  public personality_assessment?: string;
  public strength_assessment?: string;
  public recommendation?: string;
  public numerology_system_id!: number;
  public created_at?: Date;
  public updated_at?: Date;
}

LoShuGridAnalysis.init(
  {
    grid_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    entity_type: {
      type: DataTypes.ENUM('user', 'partner', 'business'),
      allowNull: false,
    },
    entity_id: {
      type: DataTypes.UUID,
      allowNull: true,
      //reference from user table
      references: {
        model: 'users',
        key: 'user_id',
      },
    },
    birth_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    gender: {
      type: DataTypes.ENUM('male', 'female', 'other'),
      allowNull: false
    },
    grid_numbers: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: false,
    },
    grid_representation: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    missing_numbers: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: false,
    },
    excess_numbers: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    diagonal_analysis: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    element_balance: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    personality_assessment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    strength_assessment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    recommendation: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    numerology_system_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'numerology_systems',
        key: 'system_id',
      },
    },
  },
  {
    sequelize,
    tableName: 'lo_shu_grid_analyses',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    //index for entity_id
    indexes: [
      {
        fields: ['entity_id'],
      },
    ],
  } 
);

export default LoShuGridAnalysis;
