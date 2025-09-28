const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const envFile = process.env.ENV_FILE || '.env'; // e.g. set ENV_FILE=.env.prod for prod builds
dotenv.config({ path: path.join(__dirname, envFile) });

const toBool = (v) => String(v).toLowerCase() === 'true';

const env = {
  production: toBool(process.env.PRODUCTION ?? process.env.NODE_ENV === 'production'),
  baseUrl: process.env.BASE_URL ?? 'http://localhost:3000',
  language: process.env.LANGUAGE ?? 'en',
  googleClientId: process.env.GOOGLE_CLIENT_ID ?? ''
};

const header = `// Auto-generated from ${envFile}. Do not edit by hand.\n`;

const devContent = `${header}export const environment = ${JSON.stringify(
  { ...env, production: false }, null, 2
)} as const;\n`;

const prodContent = `${header}export const environment = ${JSON.stringify(
  { ...env, production: true }, null, 2
)} as const;\n`;

fs.writeFileSync(path.join(__dirname, '/environments/environment.ts'), devContent);
fs.writeFileSync(path.join(__dirname, '/environments/environment.prod.ts'), prodContent);

console.log(`Wrote environments from ${envFile}`);
