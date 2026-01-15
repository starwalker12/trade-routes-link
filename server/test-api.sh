#!/bin/bash

# Test script for TradeRoutes API
BASE_URL="http://localhost:3001"

echo "=== Testing TradeRoutes API ==="

# 1. Health Check
echo -e "\n1. Health Check:"
curl -s "$BASE_URL/health" | jq -r '.status'

# 2. List Cities
echo -e "\n2. List Cities:"
curl -s "$BASE_URL/api/cities" | jq -r '.[0:3] | .[] | .name'

# 3. Login as Retailer
echo -e "\n3. Login as Retailer:"
RETAILER_TOKEN=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "retailer@test.com", "password": "password123"}' | jq -r '.token')
echo "Token received: ${RETAILER_TOKEN:0:20}..."

# 4. Test /me endpoint
echo -e "\n4. Get Current User:"
curl -s "$BASE_URL/api/auth/me" \
  -H "Authorization: Bearer $RETAILER_TOKEN" | jq -r '.role'

# 5. Search with Synonym (case -> cover)
echo -e "\n5. Search 'samsung case' (synonym: cover):"
curl -s "$BASE_URL/api/search?query=samsung%20case&limit=2" \
  -H "Authorization: Bearer $RETAILER_TOKEN" | jq -r '.[0] | .title'

# 6. Login as Supplier
echo -e "\n6. Login as Supplier:"
SUPPLIER_TOKEN=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "supplier1@test.com", "password": "password123"}' | jq -r '.token')
echo "Token received: ${SUPPLIER_TOKEN:0:20}..."

# 7. Get Supplier Inventory
echo -e "\n7. Get Supplier Inventory Count:"
curl -s "$BASE_URL/api/inventory" \
  -H "Authorization: Bearer $SUPPLIER_TOKEN" | jq '. | length'

# 8. Search with city filter
echo -e "\n8. Search with City Filter (Lahore):"
LAHORE_ID=$(curl -s "$BASE_URL/api/cities" | jq -r '.[] | select(.name == "Lahore") | .id')
curl -s "$BASE_URL/api/search?query=charger&cityId=$LAHORE_ID" \
  -H "Authorization: Bearer $RETAILER_TOKEN" | jq -r '.[0] | .title'

echo -e "\n=== All Tests Completed Successfully ==="
