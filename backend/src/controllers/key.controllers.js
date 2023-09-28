import { shell } from "../libs/os.js";
import path from "path";
export const createKey = async (req, res) => {
  const cmd = await shell("whoami");
  res.json({ message: cmd });
};
