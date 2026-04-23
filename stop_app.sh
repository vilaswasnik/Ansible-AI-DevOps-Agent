#!/bin/sh

set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
PID_FILE="$SCRIPT_DIR/.app.pid"

if [ ! -f "$PID_FILE" ]; then
    echo "No PID file found. App may already be stopped."
    exit 0
fi

APP_PID=$(cat "$PID_FILE")

if [ -z "$APP_PID" ]; then
    echo "PID file is empty. Removing stale PID file."
    rm -f "$PID_FILE"
    exit 1
fi

if ! kill -0 "$APP_PID" 2>/dev/null; then
    echo "Process $APP_PID is not running. Removing stale PID file."
    rm -f "$PID_FILE"
    exit 0
fi

kill "$APP_PID"

for _ in 1 2 3 4 5; do
    if ! kill -0 "$APP_PID" 2>/dev/null; then
        rm -f "$PID_FILE"
        echo "App stopped."
        exit 0
    fi
    sleep 1
done

echo "App did not stop gracefully; sending SIGKILL."
kill -9 "$APP_PID"
rm -f "$PID_FILE"
echo "App stopped."