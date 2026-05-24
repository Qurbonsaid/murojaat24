#!/usr/bin/env bash
set -euo pipefail

OPENAPI_URL="${OPENAPI_URL:-https://api-staging.aqllishahar-termizsh.uz/docs/json}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUTPUT="${SCRIPT_DIR}/openapi.json"

curl -fsSL "${OPENAPI_URL}" -o "${OUTPUT}"
echo "Updated ${OUTPUT} from ${OPENAPI_URL}"
