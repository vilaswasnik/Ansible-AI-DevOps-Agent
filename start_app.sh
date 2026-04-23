#!/bin/sh

set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
PID_FILE="$SCRIPT_DIR/.app.pid"
LOG_DIR="$SCRIPT_DIR/logs"
LOG_FILE="$LOG_DIR/app.log"

mkdir -p "$LOG_DIR"

if [ -f "$PID_FILE" ]; then
    EXISTING_PID=$(cat "$PID_FILE")
    if [ -n "$EXISTING_PID" ] && kill -0 "$EXISTING_PID" 2>/dev/null; then
        echo "App is already running with PID $EXISTING_PID"
        echo "Log file: $LOG_FILE"
        exit 0
    fi
    rm -f "$PID_FILE"
fi

cd "$SCRIPT_DIR"
nohup npm start > "$LOG_FILE" 2>&1 &
APP_PID=$!
echo "$APP_PID" > "$PID_FILE"

sleep 2

if kill -0 "$APP_PID" 2>/dev/null; then
    echo "App started with PID $APP_PID"
    echo "URL: http://localhost:3000"
    echo "Log file: $LOG_FILE"
else
    echo "App failed to start. Check $LOG_FILE"
    rm -f "$PID_FILE"
    exit 1
fi