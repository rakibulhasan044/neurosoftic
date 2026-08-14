import { Server } from "http";
import app from "./app";
import config from "./app/config";

import { seedSuperAdmin } from "./app/utils/seed";

async function main() {
  try {
    // Seed database with Super Admin if it doesn't exist
    await seedSuperAdmin();

    const server: Server = app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });

    // graceful shutdown
    process.on("SIGTERM", () => {
      server.close(() => {
        console.log("Server closed");
        process.exit(0);
      });
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
}

main();
