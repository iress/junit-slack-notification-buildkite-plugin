#!/bin/bash

echo "Using Node version: $(node -v) & npm version: $(npm -v)"

if [ ${#NPM_REGISTRY} -gt 0 ] && [ ${#NPM_TOKEN} -gt 0 ]; then
  echo "Setting up npm credentials..."
    NPM_RC="${BASE_DIR:-.}/.npmrc"
cat <<EOF > "${NPM_RC}"
//${NPM_REGISTRY}:_authToken=${NPM_TOKEN}
registry=https://${NPM_REGISTRY}
unsafe-perm=true
always-auth=true
EOF

fi

echo "Installing dependencies..."
npm ci --omit=dev

echo "Building typescript files..."
npm run build-ts

echo "Running the application..."
node dist/index.js

