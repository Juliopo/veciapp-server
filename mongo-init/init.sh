#!/usr/bin/env bash
echo "Creating mongo users..."
mongo admin --host localhost -u "${MONGO_INITDB_ROOT_USERNAME}" -p "${MONGO_INITDB_ROOT_PASSWORD}"  --eval "db = db.getSiblingDB('${MONGO_INITDB_DATABASE}'); db.createUser({user: '${MONGO_APP_USERNAME}', pwd: '${MONGO_APP_PASSWORD}', roles: [{role: 'readWrite', db: '${MONGO_INITDB_DATABASE}'}]});"
echo "Mongo users created."