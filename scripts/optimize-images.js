#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const MAX_WIDTH_PX = 2000;
const WEBP_QUALITY = 80;

const RAW_DIR = path.join(__dirname, '..', 'assets', 'images-raw');
const OUT_DIR = path.join(__dirname, '..', 'assets', 'images');

const force = process.argv.includes('--force');

function formatBytes(bytes) {
  return `${(bytes / 1024).toFixed(0)}KB`;
}

async function optimizeImage(filename) {
  const inputPath = path.join(RAW_DIR, filename);
  const basename = path.parse(filename).name;
  const outputPath = path.join(OUT_DIR, `${basename}.webp`);

  if (!force && fs.existsSync(outputPath)) {
    console.log(`skip  ${filename} (already optimized)`);
    return true;
  }

  let inputStats;
  try {
    inputStats = fs.statSync(inputPath);
  } catch (err) {
    console.error(`error ${filename}: cannot read file (${err.message})`);
    return false;
  }

  try {
    await sharp(inputPath)
      .resize({ width: MAX_WIDTH_PX, withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY })
      .toFile(outputPath);
  } catch (err) {
    console.error(`error ${filename}: ${err.message}`);
    return false;
  }

  const outputStats = fs.statSync(outputPath);
  console.log(
    `done  ${filename} -> ${basename}.webp  ${formatBytes(inputStats.size)} -> ${formatBytes(outputStats.size)}`,
  );
  return true;
}

async function main() {
  fs.mkdirSync(RAW_DIR, { recursive: true });
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const files = fs.readdirSync(RAW_DIR).filter((f) => !f.startsWith('.'));

  if (files.length === 0) {
    console.log('No files in assets/images-raw/. Nothing to do.');
    return;
  }

  let hadFailure = false;
  for (const file of files) {
    const ok = await optimizeImage(file);
    if (!ok) {
      hadFailure = true;
    }
  }

  if (hadFailure) {
    process.exitCode = 1;
  }
}

main();
