import fs from "fs-extra";
import path from "path";
import AdmZip from "adm-zip";
import { createRequire } from "module";
import { getOctokit, context } from "@actions/github";

const target = process.argv.slice(2)[0];
const alpha = process.argv.slice(2)[1];

const ARCH_MAP = {
  "x86_64-pc-windows-msvc": "x64",
  "i686-pc-windows-msvc": "x86",
  "aarch64-pc-windows-msvc": "arm64",
};

const PROCESS_MAP = {
  x64: "x64",
  ia32: "x86",
  arm64: "arm64",
};
const arch = target ? ARCH_MAP[target] : PROCESS_MAP[process.arch];
/// Script for ci
/// 打包绿色版/便携版 (only Windows)
async function resolvePortable() {
  if (process.platform !== "win32") return;

  const releaseDir = target
    ? `./src-tauri/target/${target}/release`
    : `./src-tauri/target/release`;
  const configDir = path.join(releaseDir, ".config");

  if (!(await fs.pathExists(releaseDir))) {
    throw new Error("could not found the release dir");
  }

  await fs.mkdir(configDir);
  await fs.createFile(path.join(configDir, "PORTABLE"));

  const zip = new AdmZip();

  zip.addLocalFile(path.join(releaseDir, "Moon.exe"));
  zip.addLocalFile(path.join(releaseDir, "verge-mihomo.exe"));
  zip.addLocalFolder(path.join(releaseDir, "resources"), "resources");
  zip.addLocalFolder(configDir, ".config");

  const require = createRequire(import.meta.url);
  const packageJson = require("../package.json");
  const { version } = packageJson;

  const zipFile = `Clash.Verge_${version}_${arch}_portable.zip`;
  zip.writeZip(zipFile);

  console.log("[INFO]: create portable zip successfully");
}

resolvePortable().catch(console.error);
