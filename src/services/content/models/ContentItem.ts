// src/services/content/models/ContentItem.ts

import { Model, Sequelize } from 'sequelize';

interface ContentItemAttributes {
  id: string;
  content_type: 'daily_horoscope' | 'monthly_report' | 'business_forecast' | 'article' | 'tool_result';
  title: string;
  content: string;
  metadata: Record<string, any>;
  publish_date: Date;
  expiry_date?: Date;
  subscription_tier_required: string;
  active: boolean;
  created_at: Date;
  updated_at: Date;
}

class ContentItem extends Model implements ContentItemAttributes {
  public id!: string;
  public content_type!: 'daily_horoscope' | 'monthly_report' | 'business_forecast' | 'article' | 'tool_result';
  public title!: string;
  public content!: string;
  public metadata!: Record<string, any>;
  public publish_date!: Date;
  public expiry_date?: Date;
  public subscription_tier_required!: string;
  public active!: boolean;
  public created_at!: Date;
  public updated_at!: Date;

  static initModel(sequelize: Sequelize): typeof ContentItem {
    const { DataTypes } = require('sequelize');
    
    ContentItem.init({
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      content_type: {
        type: DataTypes.ENUM('daily_horoscope', 'monthly_report', 'business_forecast', 'article', 'tool_result'),
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
      },
      publish_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      expiry_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      subscription_tier_required: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: 'free',
      },
      active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
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
    }, {
      sequelize,
      tableName: 'content_items',
      timestamps: false,
      indexes: [
        { fields: ['content_type'] },
        { fields: ['publish_date'] },
        { fields: ['subscription_tier_required'] },
        { fields: ['active'] },
      ],
    });

    return ContentItem;
  }

  static associate(models: any) {
    // Define associations here
    ContentItem.hasMany(models.UserContent, { foreignKey: 'content_id', as: 'userViews' });
  }
}

export default ContentItem;
