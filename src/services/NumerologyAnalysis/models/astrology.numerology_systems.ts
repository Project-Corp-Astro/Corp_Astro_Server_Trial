import { DataTypes, Model } from 'sequelize';
import sequelize from '../../../config/sequelize.config';

export interface NumerologySystemAttributes {
  system_id?: number;
  system_name: string;
  description?: string;
  base_numbers: number;
  calculation_rules: object;
  created_at?: Date;
  updated_at?: Date;
}

class NumerologySystem extends Model<NumerologySystemAttributes> implements NumerologySystemAttributes {
  public system_id!: number;
  public system_name!: string;
  public description?: string;
  public base_numbers!: number;
  public calculation_rules!: object;
  public created_at?: Date;
  public updated_at?: Date;
}

NumerologySystem.init(
  {
    system_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    system_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    base_numbers: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    calculation_rules: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'numerology_systems',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    //index for system_name
    indexes: [
      {
        unique: true,
        fields: ['system_name'],
      },
    ],
  }
);

export default NumerologySystem;
