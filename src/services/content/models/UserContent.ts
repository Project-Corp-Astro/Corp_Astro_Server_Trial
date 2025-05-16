// src/services/content/models/UserContent.ts

import { Model } from 'sequelize';
import * as SequelizeDataTypes from 'sequelize/lib/data-types';
import sequelize from '../../../config/sequelize.config';
import ContentItem from './ContentItem';

export interface UserContentAttributes {
  id?: string;
  user_id: string;
  content_id: string;
  viewed_at?: Date;
  favorite: boolean;
  user_rating?: number;
  user_feedback?: string;
  created_at?: Date;
  updated_at?: Date;
}

// @ts-ignore - Ignoring TypeScript error for Model extension
class UserContent extends Model implements UserContentAttributes {
  public id!: string;
  public user_id!: string;
  public content_id!: string;
  public viewed_at?: Date;
  public favorite!: boolean;
  public user_rating?: number;
  public user_feedback?: string;
  public created_at!: Date;
  public updated_at!: Date;
}

(UserContent as any).init(
  {
    id: {
      type: SequelizeDataTypes.UUID,
      primaryKey: true,
      defaultValue: SequelizeDataTypes.UUIDV4,
    },
    user_id: {
      type: SequelizeDataTypes.UUID,
      allowNull: false,
    },
    content_id: {
      type: SequelizeDataTypes.UUID,
      allowNull: false,
      references: {
        model: 'content_items',
        key: 'id',
      },
    },
    viewed_at: {
      type: SequelizeDataTypes.DATE,
      allowNull: true,
    },
    favorite: {
      type: SequelizeDataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    user_rating: {
      type: SequelizeDataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1,
        max: 5,
      },
    },
    user_feedback: {
      type: SequelizeDataTypes.TEXT,
      allowNull: true,
    },
    created_at: {
      type: SequelizeDataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updated_at: {
      type: SequelizeDataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
  },
  {
    sequelize,
    tableName: 'user_content',
    timestamps: false,
    indexes: [
      {
        fields: ['user_id'],
      },
      {
        fields: ['content_id'],
      },
      {
        fields: ['viewed_at'],
      },
      {
        fields: ['favorite'],
      },
    ],
  }
);

// Define association with ContentItem
(UserContent as any).belongsTo(ContentItem, {
  foreignKey: 'content_id',
  as: 'content',
});

// Add association types
declare global {
  namespace Express {
    interface UserContent {
      content?: ContentItem;
    }
  }
}

export { UserContent };
export default UserContent;
