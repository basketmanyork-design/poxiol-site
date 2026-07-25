const fs = require('fs');
const p = 'scripts/check-cms-final-preflight.mjs';
let c = fs.readFileSync(p, 'utf8');
const ss = "const selfScripts = ['check-cms-final-preflight.mjs', 'check-cms-final-preflight-test.mjs', 'check-cms-safety.mjs', 'cms-migration-dry-run.ts'];\n";
c = c.replace("const ROOT = join(__dirname, '..');", "const ROOT = join(__dirname, '..');\n" + ss);
const s8s = "// ===== 8. Security: committed secrets =====";
const s8e = "// ===== 9. Security: workflow permissions =====";
const n8Lines = [
  "// ===== 8. Security: committed secrets =====",
  "const BINARY_EXTS = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.ico', '.woff', '.woff2', '.ttf', '.eot', '.gz', '.svg', '.pack'];",
  "const secretPatterns = [",
  "  /\\bsk_[a-zA-Z0-9]{32,}\\b/,",
  "  /\\bNEXT_PUBLIC_.*TOKEN\\b/i,",
  "  /\\bBearer\\s+[A-Za-z0-9\\-_\\.]{20,}\\b/,",
  "  /\\bCLOUDFLARE_API_TOKEN\\b/i,",
  "  /\\bDEPLOY_HOOK.*[A-Za-z0-9]{20,}\\b/,",
  "  /\\bsanity.*token\\b/i",
  "];",
  "",
  "function scanForSecrets() {",
  "  let count = 0;",
  "  const dirsToScan = ['.github/workflows', 'scripts', 'lib/sanity', 'studio'];",
  "  const trackedFiles = execSync('git ls-files', {cwd: ROOT, stdio: ['pipe','pipe','pipe']}).toString().trim().split('\\n')",
  "    .filter(f => dirsToScan.some(d => f.startsWith(d)));",
  "  ",
  "  for (const file of trackedFiles) {",
  "    if (!file) continue;",
  "    const isSelf = selfScripts.some(s => file.includes(s));",
  "    if (isSelf) continue;",
  "    if (BINARY_EXTS.some(ext => file.endsWith(ext))) continue;",
  "    const fullPath = join(ROOT, file);",
  "    if (!existsSync(fullPath)) continue;",
  "    const content = readFileSync(fullPath, 'utf8');",
  "    const lines = content.split('\\n');",
  "    for (const line of lines) {",
  "      const trimmed = line.trim();",
  "      if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('#') || trimmed.startsWith('/*')) continue;",
  "      if (trimmed.match(/secrets\\..*TOKEN/) || trimmed.match(/env\\..*TOKEN/) || trimmed.includes('$' + '{') || trimmed.includes('{{')) continue;",
  "      if (trimmed.includes('sk_xxxxxxxxxxxxxxxx') || trimmed.includes('process.env.') || trimmed.includes('::error::') || trimmed.includes('echo ')) continue;",
  "      if (trimmed.match(/\\/.*\\/[gimuy]*/) || trimmed.match(/^(if|then|else|fi|case|esac|for|do|done)\\b/)) continue;",
  "      for (const pattern of secretPatterns) {",
  "        if (pattern.test(line)) { count++; break; }",
  "      }",
  "    }",
  "  }",
  "  return count;",
  "}",
  "let committedSecretCount = scanForSecrets();",
  "if (committedSecretCount > 0) totalFail++;"
];
c = c.substring(0, c.indexOf(s8s)) + n8Lines.join('\n') + "\n\n" + c.substring(c.indexOf(s8e));
fs.writeFileSync(p, c);
