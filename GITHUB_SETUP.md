# GitHub Actions Setup

## Required Repository Variables

Go to your GitHub repository → Settings → Secrets and variables → Actions → Variables tab:

- `AWS_S3_BUCKET` - Your S3 bucket name (e.g., `my-app-bucket`)
- `AWS_REGION` - AWS region (e.g., `us-east-1`)
- `CLOUDFRONT_DISTRIBUTION_ID` - (Optional) CloudFront distribution ID for cache invalidation

## Required Repository Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions → Secrets tab:

- `AWS_ACCESS_KEY_ID` - AWS access key with S3 permissions
- `AWS_SECRET_ACCESS_KEY` - AWS secret access key

## AWS IAM Permissions

Your AWS user/role needs these permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:PutObjectAcl",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::your-bucket-name",
        "arn:aws:s3:::your-bucket-name/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "cloudfront:CreateInvalidation"
      ],
      "Resource": "*"
    }
  ]
}
```

## Workflows Created

1. **`.github/workflows/pr-check.yml`** - Runs on pull requests to main
   - Lints code only
   - Fast feedback for contributors

2. **`.github/workflows/deploy.yml`** - Runs on push to main branch
   - Lints → builds → deploys to S3
   - Includes optional CloudFront invalidation
   - Uses job dependencies to ensure proper sequencing