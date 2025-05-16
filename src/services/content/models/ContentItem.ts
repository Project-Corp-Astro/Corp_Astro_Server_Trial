// src/services/content/models/ContentItem.ts

import { Model, Sequelize } from 'sequelize';
import * as SequelizeDataTypes from 'sequelize/lib/data-types';

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

// @ts-ignore - Ignoring TypeScript error for Model extension
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

  static initModel(sequelize: Sequelize): any {
    
    (ContentItem as any).init({
      id: {
        type: SequelizeDataTypes.UUID,
        primaryKey: true,
        defaultValue: SequelizeDataTypes.UUIDV4,
      },
      content_type: {
        type: SequelizeDataTypes.ENUM('daily_horoscope', 'monthly_report', 'business_forecast', 'article', 'tool_result'),
        allowNull: false,
      },
      title: {
        type: SequelizeDataTypes.STRING(255),
        allowNull: false,
      },
      content: {
        type: SequelizeDataTypes.TEXT,
        allowNull: false,
      },
      metadata: {
        type: SequelizeDataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
      },
      publish_date: {
        type: SequelizeDataTypes.DATE,
        allowNull: false,
      },
      expiry_date: {
        type: SequelizeDataTypes.DATE,
        allowNull: true,
      },
      subscription_tier_required: {
        type: SequelizeDataTypes.STRING(20),
        allowNull: false,
        defaultValue: 'free',
      },
      active: {
        type: SequelizeDataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      created_at: {
        type: SequelizeDataTypes.DATE,
        allowNull: false,
        defaultValue: SequelizeDataTypes.NOW,
      },
      updated_at: {
        type: SequelizeDataTypes.DATE,
        allowNull: false,
        defaultValue: SequelizeDataTypes.NOW,
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
    (ContentItem as any).hasMany(models.UserContent, { foreignKey: 'content_id', as: 'userViews' });
  }
}

export default ContentItem;
