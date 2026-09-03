# AWS Amplify Service Role Setup Guide

An **AWS Amplify Service Role** grants the Amplify service permission to provision, build, and deploy backend resources (such as CloudFormation, S3, Cognito, DynamoDB, and AppSync) on your behalf during CI/CD deployments.

---

## Method 1: Create & Attach via AWS Management Console (Recommended)

### Step 1: Open AWS IAM Console
1. Navigate to the [AWS IAM Roles Console](https://console.aws.amazon.com/iam/home#/roles).
2. Click **Create role**.

### Step 2: Select Trusted Entity
1. Under **Trusted entity type**, select **AWS service**.
2. Under **Use case**, search for and select **Amplify**.
3. Choose **Amplify - Backend Deployment** (or choose custom trust policy `amplify.amazonaws.com`).
4. Click **Next**.

### Step 3: Attach Permission Policies
Attach the standard managed policy:
- **`AdministratorAccess-Amplify`** (Required for Amplify to create and manage full-stack cloud resources).
- *(Optional for custom pipelines)*: `AWSCloudFormationFullAccess`, `AmazonS3FullAccess`.

### Step 4: Name and Create Role
1. Set **Role name**: `AmplifySSRBackendServiceRole` (or `amplifyconsole-backend-role`).
2. Description: `Allows AWS Amplify to provision backend cloud resources and execute SSR builds.`
3. Click **Create role**.

### Step 5: Attach Role to Your Amplify App
1. Open the [AWS Amplify Console](https://console.aws.amazon.com/amplify/).
2. Select your application.
3. In the left navigation sidebar, go to **App settings** > **General settings**.
4. Scroll to **Service role** and click **Edit**.
5. Select your newly created role (`AmplifySSRBackendServiceRole`) from the dropdown.
6. Click **Save**.

---

## Method 2: Create Service Role Using AWS CLI

Run the following commands using the AWS CLI in your terminal:

### 1. Create the IAM Role with Trust Policy
```bash
aws iam create-role \
  --role-name AmplifySSRBackendServiceRole \
  --assume-role-policy-document file://amplify-service-role-trust-policy.json \
  --description "Service role for AWS Amplify backend deployments and SSR"
```

### 2. Attach the Amplify Admin Policy
```bash
aws iam attach-role-policy \
  --role-name AmplifySSRBackendServiceRole \
  --policy-arn arn:aws:iam::aws:policy/AdministratorAccess-Amplify
```

### 3. Associate the Role with Your Amplify App
```bash
aws amplify update-app \
  --app-id <YOUR_AMPLIFY_APP_ID> \
  --iam-service-role-arn arn:aws:iam::<YOUR_ACCOUNT_ID>:role/AmplifySSRBackendServiceRole
```

---

## Summary of Permissions Granted

| Policy Name | Description |
| :--- | :--- |
| `AdministratorAccess-Amplify` | Enables Amplify to provision AppSync GraphQL, Cognito User Pools, S3 buckets, and Lambda compute |
| `sts:AssumeRole` (Trust Policy) | Grants `amplify.amazonaws.com` permission to assume this role during automated Git pushes |
