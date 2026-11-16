#!/usr/bin/env bash
# Issue 转 PR：创建分支并提交
set -euo pipefail

git config user.name "github-actions[bot]"
git config user.email \
  "github-actions[bot]@users.noreply.github.com"

ISSUE_NUM="${ISSUE_NUMBER}"
SLUG="${DOC_SLUG}"
CATEGORY="${DOC_CATEGORY}"
TITLE="${DOC_TITLE}"
PATH_MD="${DOC_PATH}"

BRANCH="submit/issue-${ISSUE_NUM}-${SLUG}"
git checkout -b "$BRANCH"
git add "$PATH_MD"

COMMIT_MSG="feat(${CATEGORY}): ${TITLE}"
COMMIT_MSG="${COMMIT_MSG}"$'\n\n'"由 Issue #${ISSUE_NUM} 自动转入库"
git commit -m "$COMMIT_MSG"
git push -u origin "$BRANCH"

echo "BRANCH=$BRANCH" >> "$GITHUB_ENV"
