import ChartType from '../models/ChartType';
import sequelize from '../../../config/sequelize.config';
import NatalChart from '../models/natal_chart';
import NatalPlanet from '../models/natal_planets';
import NatalHouse from '../models/natal_houses';
import DerivedChart from '../models/DerivedChartModel';
import DerivedChartPlanet from '../models/derived_chart_planet';
import DerivedChartHouse from '../models/derived_chart_house';
import TransitChart from '../models/transitChart';
import TransitPlanets from '../models/transit_chart_planet';
import logger from '../../../utils/logger'; // Adjust path as needed

const syncModels = async () => {
  try {
    const isDev = false;
    await Promise.all([
      ChartType.sync({ alter: isDev }),
      NatalChart.sync({ alter: isDev }),
      NatalPlanet.sync({ alter: isDev }),
      NatalHouse.sync({ alter: isDev }),
      DerivedChart.sync({ alter: isDev }),
      DerivedChartPlanet.sync({ alter: isDev }),
      DerivedChartHouse.sync({ alter: isDev }),
      TransitChart.sync({ alter: isDev }),
      TransitPlanets.sync({ alter: isDev }),
    ]);
    logger.info('Database synchronized successfully');
  } catch (error) {
    logger.error('Database synchronization failed:', error);
    throw error;
  }
};

const chartTypeSync = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Connection has been established successfully.');
    await syncModels();
  } catch (error) {
    logger.error('Unable to connect to the database:', error);
    throw error;
  }
};

chartTypeSync();

export default chartTypeSync;
