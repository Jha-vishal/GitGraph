const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

// Configuration
const startYear = 2019;
const endYear = 2021;
const repoPath = path.join(__dirname, 'fake_git_graph'); // Path to the local repository
const commitMessage = 'Automated commit for Git graph hack';
const commitsPerDay = 16;
const intervalDays = 2;

// Ensure the repository exists and is initialized
if (!fs.existsSync(repoPath)) {
  fs.mkdirSync(repoPath, { recursive: true });
  execSync('git init', { cwd: repoPath });
}

// Set up an initial branch (if not already set)
try {
  execSync('git branch -M main', { cwd: repoPath });
} catch (error) {
  console.error('Error setting branch:', error.message);
}

// Create a dummy file if it doesn't exist
const filePath = path.join(repoPath, 'dummy_file.txt');
if (!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, 'Initial content\n');
  execSync('git add dummy_file.txt', { cwd: repoPath });
  execSync('git commit -m "Initial commit"', { cwd: repoPath });
}

// Start creating commits
const startDate = new Date(startYear, 0, 1); // Jan 1, startYear
const endDate = new Date(endYear, 11, 31); // Dec 31, endYear

let currentDate = startDate;
while (currentDate <= endDate) {
  for (let commit = 1; commit <= commitsPerDay; commit++) {
    // Modify the dummy file
    fs.appendFileSync(filePath, `Commit on ${currentDate.toISOString()} - ${commit}\n`);

    // Stage changes
    execSync('git add dummy_file.txt', { cwd: repoPath });

    // Set custom commit date
    const fakeDate = currentDate.toISOString();
    const env = {
      ...process.env,
      GIT_AUTHOR_DATE: fakeDate,
      GIT_COMMITTER_DATE: fakeDate,
    };

    // Make the commit
    try {
      execSync(`git commit -m "${commitMessage} (${currentDate.toISOString()} - Commit ${commit})"`, {
        cwd: repoPath,
        env,
      });
      console.log(`Created commit ${commit} on ${currentDate.toISOString()}`);
    } catch (error) {
      console.error(`Error creating commit ${commit}:`, error.message);
    }
  }

  // Move to the next interval
  currentDate.setDate(currentDate.getDate() + intervalDays);
}

console.log('Fake Git graph commits have been created!');

// To push the repository, follow these steps:
// 1. Add remote: git remote add origin <your-repo-url>
// 2. Push: git push -u origin main
