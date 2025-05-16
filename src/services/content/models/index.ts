// src/services/content/models/index.ts

import { Sequelize } from 'sequelize';
import ContentItemModel from './ContentItem';
import UserContentModel from './UserContent';
import BusinessProfileModel from './BusinessProfile';

// Export the models directly for use in other files
export { default as ContentItem } from './ContentItem';
export { default as UserContent } from './UserContent';
export { default as BusinessProfile } from './BusinessProfile';

export default function initContentModels(sequelize: Sequelize) {
  // Initialize models
  const contentItem = ContentItemModel.init(
    ContentItemModel.getAttributes(),
    { 
      sequelize,
      tableName: 'content_items',
      timestamps: false,
    }
  );
  
  const userContent = UserContentModel.init(
    UserContentModel.getAttributes(),
    {
      sequelize,
      tableName: 'user_content',
      timestamps: false,
    }
  );
  
  const businessProfile = BusinessProfileModel.init(
    BusinessProfileModel.getAttributes(),
    {
      sequelize,
      tableName: 'business_profiles',
      timestamps: false,
    }
  );

  // Create models object for associations
  const models = {
    ContentItem: contentItem,
    UserContent: userContent,
    BusinessProfile: businessProfile
  };

  // Initialize associations
  UserContentModel.belongsTo(ContentItemModel, {
    foreignKey: 'content_id',
    as: 'content',
  });

  ContentItemModel.hasMany(UserContentModel, {
    foreignKey: 'content_id',
    as: 'userViews',
  });

  return models;
}
