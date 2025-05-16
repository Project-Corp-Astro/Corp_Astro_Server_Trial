// src/services/content/models/GeneratedContent.ts

import { Model, DataTypes } from 'sequelize';
import sequelize from '../../../config/sequelize.config';

export interface GeneratedContentAttributes {
  id?: string;
  user_id?: string; // Optional, for user-specific content
  business_id?: string; // Optional, for business-specific content
  content_type: string; // 'daily_horoscope', 'monthly_report', 'business_insight', etc.
  zodiac_sign?: string; // For zodiac-specific content
  content: string; // The generated content
  metadata?: object; // Additional metadata about the content
  astrological_data?: object; // Relevant astrological data used for generation
  valid_from: Date; // When the content becomes valid
  valid_until: Date; // When the content expires
  created_at?: Date;
  updated_at?: Date;
}

class GeneratedContent extends Model<GeneratedContentAttributes> implements GeneratedContentAttributes {
  public id!: string;
  public user_id?: string;
  public business_id?: string;
  public content_type!: string;
  public zodiac_sign?: string;
  public content!: string;
  public metadata?: object;
  public astrological_data?: object;
  public valid_from!: Date;
  public valid_until!: Date;
  public created_at!: Date;
  public updated_at!: Date;
}

GeneratedContent.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'user_id',
      },
      onDelete: 'CASCADE',
    },
    business_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'business_profiles',
        key: 'business_id',
      },
      onDelete: 'CASCADE',
    },
    content_type: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    zodiac_sign: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    astrological_data: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    valid_from: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    valid_until: {
      type: DataTypes.DATE,
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
    tableName: 'generated_content',
    timestamps: false,
    indexes: [
      {
        fields: ['user_id'],
      },
      {
        fields: ['business_id'],
      },
      {
        fields: ['content_type'],
      },
      {
        fields: ['zodiac_sign'],
      },
      {
        fields: ['valid_from', 'valid_until'],
      },
    ],
  }
);

export default GeneratedContent;
