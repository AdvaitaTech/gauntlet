#!/bin/bash
DBNAME="$1"
DIR=$(pwd)
FILE="$DIR/scripts/schema.sql"
if [ -f "$FILE" ] && [ "$DBNAME" != "" ]
then
  echo "DBNAME - $DBNAME"
  echo "psql -f $FILE $DBNAME"
  dropdb "$DBNAME"
  createdb "$DBNAME"
  psql -f "$FILE" "$DBNAME"
else
  echo "please run this from the root of the app directory and provide the DBNAME as first argument"
fi
