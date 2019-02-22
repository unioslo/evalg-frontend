#!/usr/bin/env sh
set -eu

ENV_JSON=$(env | grep '^REACT_APP_*' | jq -c '. | split("\n") | map(select(. != "")) | map(split("=") | { (.[0]) : .[1] }) | reduce .[] as $item ({}; . * $item)' -R -s)
echo "window.ENV = $ENV_JSON" > /app/build/env.js

exec "$@"
