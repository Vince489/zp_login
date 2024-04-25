require("dotenv").config();
const cluster = require("cluster");
const numCPUs = require("os").cpus().length;
const app = require("./app");

// Check if the current process is the master or a worker
if (cluster.isMaster) {
  // If it's the master process, create worker processes
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // Listen for worker exit events and restart them
  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork();
  });
} else {
  // If it's a worker process, start the server
  const { PORT } = process.env || 3000;
  const startServer = () => {
    app.listen(PORT, () => {
      console.log(`Server ${process.pid} running on http://localhost:${PORT}`);
    });
  };

  startServer();
}
