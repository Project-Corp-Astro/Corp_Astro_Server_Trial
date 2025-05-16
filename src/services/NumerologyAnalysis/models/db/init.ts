import sequelize from '../../../../config/sequelize.config';
import NumerologySystem from '../astrology.numerology_systems';
import NumerologyAnalysis from '../astrology.numerology_analyses';
import LoShuGridAnalysis from '../LoShuGridAnalysis';

const syncModels = async () => {
  const isDev = false; // Toggle this if needed for development changes
  await Promise.all([
    NumerologySystem.sync({ alter: isDev }),
    NumerologyAnalysis.sync({ alter: isDev }),
    LoShuGridAnalysis.sync({ alter: isDev }),
  ]);
};

const numerologysystemsync = async () => {
  await sequelize.authenticate();
  await syncModels();
};

export default numerologysystemsync;
