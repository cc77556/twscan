#!/bin/bash
# twscan 每日資料自動更新（launchd: com.cc.twscan-data-refresh，每日 17:30）
# 流程：refresh_data.py 重抓 TWSE 官方資料 → 只有 src/data 真的有變更才 commit+push
# （push 到 GitHub 後 Vercel 自動部署）。抓取失敗時腳本 exit 1、不會 commit，
# 舊資料留在站上——寧可舊資料也不要壞資料。
export PATH=/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin
REPO=/Users/cc/projects/twscan
LOG=/Users/cc/.openclaw/logs/twscan-data-refresh.log

cd "$REPO" || exit 1
echo "=== $(date) twscan data refresh ===" >> "$LOG"

if ! python3 scripts/refresh_data.py >> "$LOG" 2>&1; then
  echo "=== $(date) refresh FAILED, not committing ===" >> "$LOG"
  exit 1
fi

if git diff --quiet -- src/data; then
  echo "=== $(date) no data change, skip commit ===" >> "$LOG"
  exit 0
fi

git add src/data
git commit -m "Data refresh $(date +%F)" >> "$LOG" 2>&1 || exit 1
git push origin main >> "$LOG" 2>&1 || {
  echo "=== $(date) push FAILED (offline?) — will retry next run ===" >> "$LOG"
  exit 1
}
echo "=== $(date) refreshed + pushed ===" >> "$LOG"
