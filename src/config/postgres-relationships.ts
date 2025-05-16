import BusinessPartner from "../services/business/models/business_partners";
import BusinessProfile from "../services/business/models/businessProfile";
import User from "../services/user-management/models/user";
import NatalChart from "../services/astrology/models/natal_chart";
import NatalPlanet from "../services/astrology/models/natal_planets";
import NatalHouse from "../services/astrology/models/natal_houses";
import TransitChart from "../services/astrology/models/transitChart";
import TransitPlanet from "../services/astrology/models/transit_chart_planet";
import DerivedChart from "../services/astrology/models/DerivedChartModel";
import ChartType from "../services/astrology/models/ChartType";
import UserDevice from "../services/user-management/models/user_devices";
import AuthenticationLog from "../services/user-management/models/authenticationLog";
import SubscriptionHistory from "../services/subscription/models/SubscriptionHistory";
import SubscriptionPlan from "../services/subscription/models/subscription";
// associations.ts  
export default function defineAssociations() {
    
  User.hasMany(BusinessProfile, { foreignKey: 'user_id' , onDelete: 'CASCADE'});
  BusinessProfile.belongsTo(User, { foreignKey: 'user_id' });
  
  User.hasMany(BusinessPartner, { foreignKey: 'user_id' , onDelete: 'CASCADE'});
  BusinessPartner.belongsTo(User, { foreignKey: 'user_id' });
  
  BusinessProfile.hasMany(BusinessPartner, { foreignKey: 'business_id' , onDelete: 'CASCADE'});
  BusinessPartner.belongsTo(BusinessProfile, { foreignKey: 'business_id' });
  
  

      //user with user-devices
      User.hasMany(UserDevice, {
        foreignKey: 'user_id',
        as: 'userDevices',
        onDelete: 'CASCADE',
      }); 

      UserDevice.belongsTo(User, {
        foreignKey: 'user_id',
        as: 'user',
        onDelete: 'CASCADE',
      }); 
      
      //user with authenticationLog
      User.hasMany(AuthenticationLog, {
        foreignKey: 'user_id',
        as: 'authenticationLogs',
        onDelete: 'CASCADE',
      }); 

      AuthenticationLog.belongsTo(User, {
        foreignKey: 'user_id',
        as: 'user',
        onDelete: 'CASCADE',
      }); 
      
      //user with subscription history
      User.hasMany(SubscriptionHistory, {
        foreignKey: 'user_id',
        as: 'subscriptionHistories',
        onDelete: 'CASCADE',
      }); 

      SubscriptionHistory.belongsTo(User, {
        foreignKey: 'user_id',
        as: 'user',
        onDelete: 'CASCADE',
      });  

      SubscriptionHistory.belongsTo(SubscriptionPlan, {
        foreignKey: 'plan_id',
        as: 'subscriptionPlan',
        onDelete: 'CASCADE',
      });    
      

      NatalChart.hasMany(NatalPlanet, {
        foreignKey: 'chart_id',
        as: 'planets',
        onDelete: 'CASCADE'
      });
      
      NatalPlanet.belongsTo(NatalChart, {
        foreignKey: 'chart_id',
        as: 'natalChart',
        onDelete: 'CASCADE'
      });
      
      NatalChart.hasMany(NatalHouse, {
        foreignKey: 'chart_id',
        as: 'houses',
        onDelete: 'CASCADE'
      });
      
      NatalHouse.belongsTo(NatalChart, {
        foreignKey: 'chart_id',
        as: 'natalChart',
        onDelete: 'CASCADE'
      });

      TransitChart.belongsTo(User, {
        foreignKey: 'user_id',
        targetKey: 'user_id',
        as: 'user'
      });

      TransitChart.hasMany(TransitPlanet, {
        foreignKey: 'transit_id',
        as: 'planets'
      });

      TransitPlanet.belongsTo(TransitChart, {
        foreignKey: 'transit_id',
        as: 'transitChart'
      });

      DerivedChart.belongsTo(ChartType, {
        foreignKey: 'chart_code',
        as: 'chartType',
        onDelete: 'CASCADE'
      });
      ChartType.hasMany(DerivedChart, {
        foreignKey: 'chart_code',
        as: 'derivedCharts',
        onDelete: 'CASCADE'
      });
      DerivedChart.belongsTo(User, {
        foreignKey: 'user_id',
        as: 'user',
        onDelete: 'CASCADE'
      });
      User.hasMany(DerivedChart, {
        foreignKey: 'user_id',
        as: 'derivedCharts',
        onDelete: 'CASCADE'
      });
  }
  