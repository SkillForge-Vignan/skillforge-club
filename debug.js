const { execSync } = require('child_process');
const fs = require('fs');
try {
  execSync('npx vite build', { stdio: 'pipe' });
  console.log('Success');
} catch (e) {
  fs.writeFileSync('build_error.txt', e.stderr ? e.stderr.toString() : e.message);
  fs.writeFileSync('build_out.txt', e.stdout ? e.stdout.toString() : '');
}
