### How to correctly connect to google calendar api

1. Add Calendar Api service on Google Console https://console.cloud.google.com/apis/dashboard?project=
2. IAM > Service Accounts https://console.cloud.google.com/iam-admin/serviceaccounts
3. Create new service account with owner role
4. Setup and download key (Actions > Manage Keys)
5. Export variables to .env
6. Go to the settings of your calendar and add email from downloaded JSON (client_email) to "Share with specific people or groups"
