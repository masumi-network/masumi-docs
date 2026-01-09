# Staging Workflow Guide

This repository uses a staging branch workflow for testing changes before production.

## Branch Structure

- **`staging-docs`** - Testing/integration branch
- **`main`** - Production/stable branch

## Workflow

### 1. Create Feature Branch
```bash
git checkout staging-docs && git pull
git checkout -b feature/your-feature-name
```

### 2. Make Changes & Commit
```bash
# Make your changes, then:
git add .
git commit -m "docs: description of changes"
git push origin feature/your-feature-name
```

### 3. Merge to Staging
```bash
git checkout staging-docs && git pull
git merge feature/your-feature-name
git push origin staging-docs
```

### 4. Test in Staging
- Wait for deployment (if auto-deploy is configured)
- Verify changes work as expected
- Test thoroughly before promoting

### 5. Merge to Production
```bash
git checkout main && git pull
git merge staging-docs
git push origin main
```

### 6. Sync Staging Back
```bash
git checkout staging-docs
git merge main
git push origin staging-docs
```

## Quick Reference

```bash
# View differences between staging and main
git diff main..staging-docs

# See current branch
git branch

# View recent commits
git log --oneline --graph --all -10
```

## Best Practices

- ✅ Test in staging before merging to production
- ✅ Keep staging branch in sync with main
- ✅ Use descriptive commit messages following [Conventional Commits](https://www.conventionalcommits.org/)
- ✅ Don't merge broken code to staging

For detailed workflow and best practices, see [STAGING.md](./STAGING.md).
