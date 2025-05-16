// src/models/conversations/message.model.ts

import { Model, DataTypes } from 'sequelize';
import sequelize from '../../../config/sequelize.config';

export interface MessageAttributes {
  id?: string;
  user_id: string;
  conversation_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  metadata?: object;
  created_at?: Date;
}

class Message extends Model<MessageAttributes> implements MessageAttributes {
  public id!: string;
  public user_id!: string;
  public conversation_id!: string;
  public role!: 'user' | 'assistant' | 'system';
  public content!: string;
  public metadata?: object;
  public created_at?: Date;
}

Message.init(
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
    conversation_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'conversations',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    role: {
      type: DataTypes.ENUM('user', 'assistant', 'system'),
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('NOW()'),
    },
  },
  {
    sequelize,
    tableName: 'messages',
    timestamps: false,
    indexes: [
      {
        fields: ['conversation_id'],
      },
      {
        fields: ['created_at'],
      },
    ],
  }
);

export default Message;
