#!/bin/bash
set -e

# Run UI tests
echo "Running UI Tests..."
npx playwright test tests/ui --reporter=line,allure-playwright

# Run API tests
echo "Running API Tests..."
npx playwright test tests/api --reporter=line,allure-playwright

# Merge & generate Allure report
echo "Generating Allure Report..."
allure generate allure-results --clean -o allure-report

# Upload to S3
echo "Uploading report to S3..."
node utils/uploadReport.js

# Notify Slack
echo "Sending Slack notification..."
node utils/slackNotification.js

# Run only high priority tests
npx playwright test --project=high-priority

# Run high and medium priority tests
npx playwright test --project=high-priority,medium-priority

# Run all tests
npx playwright test
