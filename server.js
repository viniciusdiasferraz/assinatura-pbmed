import jsonServer from "json-server";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, "db.json"));
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

server.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`, req.body);
  next();
});

server.use(router);
server.listen(3001, () => {
  console.log("✅ JSON Server rodando em http://localhost:3001");
});
