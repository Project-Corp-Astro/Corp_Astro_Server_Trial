import User from '../user';
import sequelize from '../../../../config/sequelize.config';

const syncModels = async () => {
  const isDev = false; // toggle as needed for alter
  await Promise.all([
    User.sync({ alter: isDev }),
  ]);
};

const usermodelsync = async () => {
  await sequelize.authenticate();
  await syncModels();
};

export default usermodelsync;
