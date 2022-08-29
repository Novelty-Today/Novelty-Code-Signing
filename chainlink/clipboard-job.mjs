import clipboard from "clipboardy";
import fs from "fs";
clipboard.writeSync(fs.readFileSync("job.toml", "utf-8"));
