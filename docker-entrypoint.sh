#!/bin/bash
yarn prisma:deploy
yarn prisma:generate
yarn start:prod