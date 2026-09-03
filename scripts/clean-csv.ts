import * as fs from 'fs';
import * as path from 'path';

const csvPath = process.argv[2] || 'C:\\xampp\\htdocs\\shop-order-system\\technical-task\\Full-Stack\\300 user linkedin.txt';
const outputPath = process.argv[3] || path.join(__dirname, '..', 'data', 'linkedin_users.csv');

const content = fs.readFileSync(csvPath, 'utf-8');
const lines = content.split('\n').filter(l => l.trim());

// Parse CSV properly (handle quoted fields)
function parseLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

const headers = parseLine(lines[0]);
console.log(`Found ${headers.length} columns`);
console.log(`Headers: ${headers.slice(0, 10).join(', ')}...`);

// Convert to proper CSV
const outputLines = [lines[0]];
for (let i = 1; i < lines.length; i++) {
  outputLines.push(lines[i].replace(/^H:.+?\(/, '').trim());
}

// Write clean CSV
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, outputLines.join('\n'), 'utf-8');
console.log(`Cleaned CSV written to ${outputPath}`);
console.log(`Total rows: ${outputLines.length - 1}`);
