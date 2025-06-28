import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get current directory (needed for ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define paths to check
const EXPLANATIONS_PATH = path.join(__dirname, '../');
const PUBLIC_EXPLANATIONS_PATH = path.join(__dirname, 'public/explanations');
const USER_EXPLANATIONS_PATH = 'C:/Users/burak/Desktop/prep/DSA_Approaches/explanations';
const ABSOLUTE_EXPLANATIONS_PATH = path.resolve(USER_EXPLANATIONS_PATH);

console.log('DSA Content Path Check Tool');
console.log('=========================');
console.log('');

// Function to check if a directory exists and list its contents
function checkDirectory(label, dirPath) {
  console.log(`${label} [${dirPath}]:`);
  try {
    if (!fs.existsSync(dirPath)) {
      console.log(`  ❌ Directory doesn't exist`);
      return;
    }
    
    const stats = fs.statSync(dirPath);
    if (!stats.isDirectory()) {
      console.log(`  ❌ Path exists but is not a directory`);
      return;
    }
    
    console.log(`  ✅ Directory exists`);
    
    // List contents
    const items = fs.readdirSync(dirPath);
    console.log(`  📂 Contents (${items.length} items):`);
    
    items.forEach(item => {
      const itemPath = path.join(dirPath, item);
      try {
        const itemStats = fs.statSync(itemPath);
        const isDir = itemStats.isDirectory();
        console.log(`    ${isDir ? '📁' : '📄'} ${item}`);
        
        // If it's a directory and looks like a DSA topic, check for important files
        if (isDir && /^\d+_/.test(item)) {
          const topicFiles = fs.readdirSync(itemPath);
          const theoryFile = topicFiles.find(f => f.includes('THEORY'));
          const problemsFile = topicFiles.find(f => f.includes('PROBLEM'));
          
          if (theoryFile) {
            console.log(`      ✅ Found theory file: ${theoryFile}`);
          } else {
            console.log(`      ❌ No theory file found`);
          }
          
          if (problemsFile) {
            console.log(`      ✅ Found problems file: ${problemsFile}`);
          } else {
            console.log(`      ❌ No problems file found`);
          }
        }
      } catch (e) {
        console.log(`    ❌ Error reading ${item}: ${e.message}`);
      }
    });
  } catch (error) {
    console.log(`  ❌ Error: ${error.message}`);
  }
  console.log('');
}

// Check each path
checkDirectory('PUBLIC_EXPLANATIONS_PATH', PUBLIC_EXPLANATIONS_PATH);
checkDirectory('EXPLANATIONS_PATH', EXPLANATIONS_PATH);
checkDirectory('USER_EXPLANATIONS_PATH', USER_EXPLANATIONS_PATH);
checkDirectory('ABSOLUTE_EXPLANATIONS_PATH', ABSOLUTE_EXPLANATIONS_PATH);

console.log('Path Check Complete');
