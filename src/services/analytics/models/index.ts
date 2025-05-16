import { Sequelize } from 'sequelize';
import AnalyticsEventModel from './AnalyticsEvent';
import UserJourneyModel from './UserJourney';
import FeatureUsageModel from './FeatureUsage';
import ABTestModel from './ABTest';
import ABTestAssignmentModel from './ABTestAssignment';
import DataExportModel from './DataExport';

// Export the models directly for use in other files
export { default as ABTest } from './ABTest';
export { default as ABTestAssignment } from './ABTestAssignment';
export { default as AnalyticsEvent } from './AnalyticsEvent';
export { default as UserJourney } from './UserJourney';
export { default as FeatureUsage } from './FeatureUsage';
export { default as DataExport } from './DataExport';

export default function initAnalyticsModels(sequelize: Sequelize) {
  // Initialize models
  const analyticsEvent = AnalyticsEventModel.initModel(sequelize);
  const userJourney = UserJourneyModel.initModel(sequelize);
  const featureUsage = FeatureUsageModel.initModel(sequelize);
  const abTest = ABTestModel.initModel(sequelize);
  const abTestAssignment = ABTestAssignmentModel.initModel(sequelize);
  const dataExport = DataExportModel.initModel(sequelize);

  // Create models object for associations
  const models = {
    AnalyticsEvent: analyticsEvent,
    UserJourney: userJourney,
    FeatureUsage: featureUsage,
    ABTest: abTest,
    ABTestAssignment: abTestAssignment,
    DataExport: dataExport
  };

  // Initialize associations
  Object.values(models).forEach((model: any) => {
    if (model.associate) {
      model.associate(models);
    }
  });

  return models;
}
