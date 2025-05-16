import { DataTypes, Model } from 'sequelize';
import sequelize from '../../../config/sequelize.config';

export interface NumerologyAnalysisAttributes {
  analysis_id?: string;
  entity_type: 'USER' | 'BUSINESS' | 'PARTNER';
  entity_id: string;
  analysis_name: string;
  input_text: string;
  input_date?: Date;
  numerology_system_id: number;
  compound_number: number;
  root_number: number;
  is_master_number: boolean;
  calculation_details: object;
  lo_shu_grid?: object;
  missing_numbers?: object;
  planet_correlations?: object;
  full_analysis: object;
  recommendations?: object;
  created_at?: Date;
  updated_at?: Date;
}

class NumerologyAnalysis extends Model<NumerologyAnalysisAttributes> implements NumerologyAnalysisAttributes {
  public analysis_id!: string;
  public entity_type!: 'USER' | 'BUSINESS' | 'PARTNER';
  public entity_id!: string;
  public analysis_name!: string;
  public input_text!: string;
  public input_date?: Date;
  public numerology_system_id!: number;
  public compound_number!: number;
  public root_number!: number;
  public is_master_number!: boolean;
  public calculation_details!: object;
  public lo_shu_grid?: object;
  public missing_numbers?: object;
  public planet_correlations?: object;
  public full_analysis!: object;
  public recommendations?: object;
  public created_at?: Date;
  public updated_at?: Date;
}

NumerologyAnalysis.init(
  {
    analysis_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    entity_type: {
      type: DataTypes.ENUM('USER', 'BUSINESS', 'PARTNER'),
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
    analysis_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    input_text: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    input_date: {
      type: DataTypes.DATEONLY,
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
    compound_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    root_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    is_master_number: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    calculation_details: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    lo_shu_grid: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    missing_numbers: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    planet_correlations: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    full_analysis: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    recommendations: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'numerology_analyses',
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

export default NumerologyAnalysis;
