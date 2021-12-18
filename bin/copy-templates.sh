#!/bin/bash
rsync -av --delete --exclude 'node_modules/' --exclude 'dist/' --exclude '*.db' --exclude package-lock.json playground/template-* packages/create-flux/dist
