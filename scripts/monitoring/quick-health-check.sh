#!/usr/bin/env bash
# quick-health-check.sh — Ping lawnmastersv5.com and report if the site is up

DOMAIN="lawnmastersv5.com"
URL="https://$DOMAIN"

echo ""
echo "========================================"
echo "  Lawn Masters V5 — Site Health Check"
echo "  $URL"
echo "========================================"
echo ""

# Check for curl
if ! command -v curl &>/dev/null; then
  echo "ERROR: curl is not installed. Install curl to run this check."
  exit 1
fi

echo "Checking site availability..."

HTTP_CODE=$(curl -o /dev/null -s -w "%{http_code}" --max-time 15 "$URL")
CURL_EXIT=$?

if [ "$CURL_EXIT" -ne 0 ]; then
  echo ""
  echo "  [DOWN] Could not reach $DOMAIN"
  echo "  curl exit code: $CURL_EXIT"
  echo "  Possible causes: no internet connection, DNS failure, server down"
  echo ""
  exit 1
fi

echo "  HTTP status: $HTTP_CODE"
echo ""

if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "301" ] || [ "$HTTP_CODE" = "302" ]; then
  echo "  [UP] $DOMAIN is responding normally (HTTP $HTTP_CODE)"
elif [ "$HTTP_CODE" = "503" ]; then
  echo "  [DOWN] $DOMAIN returned 503 — server unavailable (deploy failed or Vercel issue)"
elif [ "$HTTP_CODE" = "404" ]; then
  echo "  [ERROR] $DOMAIN returned 404 — domain misconfigured or deployment missing"
elif [ "$HTTP_CODE" = "500" ] || [ "$HTTP_CODE" = "502" ]; then
  echo "  [ERROR] $DOMAIN returned $HTTP_CODE — server error, check Vercel logs"
else
  echo "  [UNKNOWN] $DOMAIN returned HTTP $HTTP_CODE"
fi

# Optional: check key pages
echo ""
echo "Checking key pages..."

check_page() {
  local path="$1"
  local code
  code=$(curl -o /dev/null -s -w "%{http_code}" --max-time 10 "$URL$path")
  if [ "$code" = "200" ]; then
    echo "  [OK]   $path (HTTP 200)"
  else
    echo "  [WARN] $path (HTTP $code)"
  fi
}

check_page "/"
check_page "/services"
check_page "/contact"
check_page "/quote"
check_page "/gallery"
check_page "/spring-rush"

echo ""
echo "Timestamp: $(date)"
echo ""
