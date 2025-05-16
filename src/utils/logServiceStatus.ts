import logger from "./logger"; // Adjust the path if needed

type ServiceStatus = {
  [serviceName: string]: string;
};

export const logServiceStatus = (services: ServiceStatus, port: string | number) => {
  const separator = "-----------------------------------------\n";

  const statusLines = Object.entries(services)
    .map(([service, status]) => {
      const icon = status === "Connected" ? "✅" : "❌";
      return `${icon} ${service.padEnd(20)} | ${status}`;
    })
    .join("\n");

  const url = `http://localhost:${port}`;
  const docsUrl = `${url}/api-docs`;

  const fullLog = [
    "\n🚀 Server Initialization Status",
    separator,
    statusLines,
    separator,
    `🌐 Server Running At: ${url}`,
    `📘 Swagger Docs:      ${docsUrl}\n`,
  ].join("\n");

  logger.info(fullLog);
};
