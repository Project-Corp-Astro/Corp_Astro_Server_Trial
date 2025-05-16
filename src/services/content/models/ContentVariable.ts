// src/services/content/models/ContentVariable.ts

import { Model, DataTypes } from 'sequelize';
import sequelize from '../../../config/sequelize.config';

export interface ContentVariableAttributes {
  id?: string;
  variable_name: string; // The name of the variable (e.g., 'planet_name', 'aspect_description')
  variable_type: string; // The type of variable (e.g., 'planet', 'aspect', 'house', 'zodiac')
  context: string; // The context in which this variable is used (e.g., 'daily_horoscope', 'monthly_report')
  values: object; // JSON object containing possible values for this variable
  created_at?: Date;
  updated_at?: Date;
}

class ContentVariable extends Model<ContentVariableAttributes> implements ContentVariableAttributes {
  public id!: string;
  public variable_name!: string;
  public variable_type!: string;
  public context!: string;
  public values!: object;
  public created_at!: Date;
  public updated_at!: Date;
}

ContentVariable.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    variable_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    variable_type: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    context: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    values: {
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
    tableName: 'content_variables',
    timestamps: false,
    indexes: [
      {
        fields: ['variable_name'],
      },
      {
        fields: ['variable_type'],
      },
      {
        fields: ['context'],
      },
    ],
  }
);

export default ContentVariable;
