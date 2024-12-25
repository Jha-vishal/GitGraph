import os
import subprocess
from datetime import datetime, timedelta

# Configuration
start_year = 2018
end_year = 2019
repo_path = ".Github_projects/git-graph-hack"  # Path to the local repository
commit_message = "Automated commit for Git graph hack"
commits_per_day = 6
interval_days = 2

# Ensure the repository exists
if not os.path.exists(repo_path):
    os.makedirs(repo_path)
    subprocess.run(["git", "init"], cwd=repo_path)

# Start creating commits
start_date = datetime(start_year, 1, 1)
end_date = datetime(end_year, 12, 31)

current_date = start_date
while current_date <= end_date:
    for commit in range(commits_per_day):
        # Modify a dummy file
        file_path = os.path.join(repo_path, "dummy_file.txt")
        with open(file_path, "a") as f:
            f.write(f"Commit on {current_date} - {commit + 1}\n")
        
        # Add changes to git
        subprocess.run(["git", "add", "."], cwd=repo_path)
        
        # Commit with a fake date
        fake_date = current_date.strftime("%Y-%m-%d %H:%M:%S")
        env = {"GIT_COMMITTER_DATE": fake_date, "GIT_AUTHOR_DATE": fake_date}
        subprocess.run(["git", "commit", "-m", commit_message], cwd=repo_path, env=env)
    
    # Move to the next interval
    current_date += timedelta(days=interval_days)

print("Fake Git graph commits have been created!")
