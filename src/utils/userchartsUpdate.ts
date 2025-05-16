// //update all charts for all users
// import { updateRelationalChart } from "../services/business/controllers/relationalcontroler";
// import { updateDashaChart } from "../services/astrology/controllers/dashacontroler";
// import { updateProgressedChartByUserId } from "../services/business/controllers/userProgressedChart.controler";
// export const updateAllCharts = async (user_id: string) => {
//   await Promise.all([
//     updateRelationalChart(user_id, "user"),
//     updateDashaChart(
//       { params: { userId: user_id } } as any,
//       { status: () => ({ json: () => {} }) } as any
//     ),
//     updateProgressedChartByUserId(user_id),
//   ]);
// };

import logger from "../utils/logger";
import { updateRelationalChart } from "../services/business/controllers/relationalcontroler";
import { updateDashaChart } from "../services/astrology/controllers/dashacontroler";
import { updateProgressedChartByUserId } from "../services/business/controllers/userProgressedChart.controler";

export const updateAllCharts = async (user_id: string) => {
  logger.info(`[updateAllCharts] Starting chart updates for user_id: ${user_id}`);

  try {
    await Promise.all([
      (async () => {
        await updateRelationalChart(user_id, "user");
        logger.info(`[updateAllCharts] Relational chart updated for user_id: ${user_id}`);
      })(),

      (async () => {
        await updateDashaChart(
          { params: { userId: user_id } } as any,
          { status: () => ({ json: () => {} }) } as any
        );
        logger.info(`[updateAllCharts] Dasha chart updated for user_id: ${user_id}`);
      })(),

      (async () => {
        await updateProgressedChartByUserId(user_id);
        logger.info(`[updateAllCharts] Progressed chart updated for user_id: ${user_id}`);
      })(),
    ]);

    logger.info(`[updateAllCharts] All charts updated successfully for user_id: ${user_id}`);
  } catch (error: any) {
    logger.error(`[updateAllCharts] Error updating charts for user_id: ${user_id} - ${error.message}`, {
      stack: error.stack,
    });
    throw error; // re-throw to allow caller to handle if needed
  }
};
