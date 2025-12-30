import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import issueRoutes from "./routes/issue.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Smart Issue Board API running");
});


app.use("/api/auth", authRoutes);
app.use("/api/issues", issueRoutes);

export default app;
