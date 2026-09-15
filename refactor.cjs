const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(file => {
    let filepath = path.join(dir, file);
    let stat = fs.statSync(filepath);
    if (stat.isDirectory()) {
      walk(filepath, callback);
    } else if (filepath.endsWith('.tsx') || filepath.endsWith('.ts')) {
      callback(filepath);
    }
  });
}

const replacements = [
  // Backgrounds
  { regex: /rgba\(15,\s*23,\s*42,\s*0\.8\)/g, replace: 'var(--bg-card)' },
  { regex: /rgba\(15,\s*23,\s*42,\s*0\.6\)/g, replace: 'var(--bg-card)' },
  { regex: /rgba\(15,\s*23,\s*42,\s*0\.7\)/g, replace: 'var(--bg-card)' },
  { regex: /rgba\(3,\s*7,\s*18,\s*0\.8\)/g, replace: 'var(--bg-card)' },
  { regex: /rgba\(3,\s*7,\s*18,\s*0\.9\)/g, replace: 'var(--bg-app)' },
  
  // Text Colors
  { regex: /#f8fafc/g, replace: 'var(--text-primary)' },
  { regex: /#94a3b8/g, replace: 'var(--text-secondary)' },
  { regex: /#64748b/g, replace: 'var(--text-muted)' },
  { regex: /#cbd5e1/g, replace: 'var(--text-secondary)' },
  { regex: /#475569/g, replace: 'var(--text-muted)' },
  
  // Borders and Dividers
  { regex: /rgba\(148,\s*163,\s*184,\s*0\.1\)/g, replace: 'var(--border-card)' },
  { regex: /rgba\(148,\s*163,\s*184,\s*0\.2\)/g, replace: 'var(--input-border)' },
  { regex: /rgba\(255,\s*255,\s*255,\s*0\.1\)/g, replace: 'var(--tag-border)' },
  { regex: /rgba\(255,\s*255,\s*255,\s*0\.05\)/g, replace: 'var(--tag-bg)' },
  { regex: /rgba\(255,\s*255,\s*255,\s*0\.03\)/g, replace: 'var(--tag-bg)' },
];

walk(srcDir, (filepath) => {
  let content = fs.readFileSync(filepath, 'utf8');
  let original = content;

  replacements.forEach(({ regex, replace }) => {
    content = content.replace(regex, replace);
  });

  if (original !== content) {
    fs.writeFileSync(filepath, content, 'utf8');
    console.log('Updated:', filepath);
  }
});
