// src/models/conversations/conversation.model.ts

import { Model, DataTypes } from 'sequelize';
import sequelize from '../../../config/sequelize.config';

export interface ConversationAttributes {
  id?: string;
  user_id: string;
  title: string;
  thread_id?: string;
  message_count?: number;
  created_at?: Date;
  updated_at?: Date;
  last_message_at?: Date;
}

class Conversation extends Model<ConversationAttributes> implements ConversationAttributes {
  public id!: string;
  public user_id!: string;
  public title!: string;
  public thread_id?: string;
  public message_count?: number;
  public created_at?: Date;
  public updated_at?: Date;
  public last_message_at?: Date;
}

Conversation.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: sequelize.literal('uuid_generate_v4()'),
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_id',
      },
      onDelete: 'CASCADE',
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    thread_id: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    message_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('NOW()'),
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('NOW()'),
    },
    last_message_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('NOW()'),
    },
  },
  {
    sequelize,
    tableName: 'conversations',
    timestamps: false,
    indexes: [
      {
        fields: ['user_id'],
      },
      {
        fields: ['created_at'],
      },
    ],
  }
);

export default Conversation;
