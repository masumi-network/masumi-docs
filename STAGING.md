# Staging Branch Workflow

**Branch:** `staging-docs`  
**Purpose:** Parallel development and testing environment for documentation changes

## Overview

The `staging-docs` branch serves as an integration and testing environment where changes can be validated before merging to `main` (production). This allows for:

- ✅ Parallel development without disrupting production
- ✅ Thorough testing of changes before deployment
- ✅ Collaborative review and iteration
- ✅ Safe experimentation with new features

## Branch Strategy

```
main (production/stable)
  ↑
staging-docs (integration/testing)
  ↑
feature branches (individual changes)
```

## Workflow

### 1. Feature Development
- Create feature branches from `staging-docs` or `main`
- Work on changes independently

### 2. Integration to Staging
```bash
# Switch to staging branch
git checkout staging-docs

# Pull latest changes
git pull origin staging-docs

# Merge your feature branch
git merge feature/your-feature-name

# Push to remote
git push origin staging-docs
```

### 3. Testing in Staging
- Deploy staging branch to staging environment (if configured)
- Perform testing and review
- Gather feedback from team

### 4. Merge to Production
Once staging is validated and approved:

```bash
# Switch to main branch
git checkout main

# Pull latest changes
git pull origin main

# Merge staging into main
git merge staging-docs

# Push to production
git push origin main
```

### 5. Keep Staging Updated
After merging to main, sync staging back:

```bash
# Switch to staging
git checkout staging-docs

# Merge latest from main to keep in sync
git merge main

# Push updated staging
git push origin staging-docs
```

## Best Practices

### ✅ Do's
- Regularly sync `staging-docs` with `main` to avoid large merge conflicts
- Test thoroughly in staging before merging to production
- Use descriptive commit messages following [Conventional Commits](https://www.conventionalcommits.org/)
- Keep staging branch deployable (no broken builds)
- Use Pull Requests for code review (recommended)

### ❌ Don'ts
- Don't merge broken code to staging
- Don't let staging diverge too far from main
- Don't use staging for long-term feature storage (create feature branches instead)
- Don't merge directly to main without testing in staging first

## CI/CD Integration

If you have CI/CD pipelines configured:

- **Staging:** Should deploy automatically on push to `staging-docs`
- **Production:** Should deploy automatically on push to `main` (after review/approval)
- Consider branch protection rules on `main` requiring PR reviews

## Rollback Strategy

If issues are found in staging:

```bash
# Revert specific commits
git revert <commit-hash>

# Or reset to a previous state (use with caution)
git reset --hard <commit-hash>
```

If issues are found in production after merging:

```bash
# Revert the merge commit
git revert -m 1 <merge-commit-hash>
```

## Quick Reference

```bash
# View current branch
git branch

# Switch to staging
git checkout staging-docs

# Switch to main
git checkout main

# Create new feature branch from staging
git checkout staging-docs
git checkout -b feature/new-feature

# View differences between staging and main
git diff main..staging-docs
```

## Status

- **Current Status:** Active
- **Last Updated:** 2026-01-09
- **Maintained By:** Development Team
