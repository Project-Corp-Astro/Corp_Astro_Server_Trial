// src/services/content/models/ContentTemplate.ts

import { Model, DataTypes } from 'sequelize';
import sequelize from '../../../config/sequelize.config';

export interface ContentTemplateAttributes {
  id?: string;
  template_type: string; // 'daily_horoscope', 'monthly_report', 'business_insight', etc.
  zodiac_sign?: string; // For zodiac-specific templates
  planet?: string; // For planet-specific templates
  house?: number; // For house-specific templates
  aspect?: string; // For aspect-specific templates
  template_content: string; // The template content with placeholders
  variables: string[]; // Array of variables/placeholders used in the template
  tags?: string[]; // Tags for categorizing templates
  created_at?: Date;
  updated_at?: Date;
  active: boolean;
}

class ContentTemplate extends Model<ContentTemplateAttributes> implements ContentTemplateAttributes {
  public id!: string;
  public template_type!: string;
  public zodiac_sign?: string;
  public planet?: string;
  public house?: number;
  public aspect?: string;
  public template_content!: string;
  public variables!: string[];
  public tags?: string[];
  public created_at!: Date;
  public updated_at!: Date;
  public active!: boolean;
}

ContentTemplate.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    template_type: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    zodiac_sign: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    planet: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    house: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1,
        max: 12,
      },
    },
    aspect: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    template_content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    variables: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: [],
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
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'content_templates',
    timestamps: false,
    indexes: [
      {
        fields: ['template_type'],
      },
      {
        fields: ['zodiac_sign'],
      },
      {
        fields: ['planet'],
      },
      {
        fields: ['house'],
      },
      {
        fields: ['aspect'],
      },
      {
        fields: ['active'],
      },
    ],
  }
);

export default ContentTemplate;
