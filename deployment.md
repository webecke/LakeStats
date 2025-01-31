# Deployment Guide for PowellStats
Getting the devops to work from local dev to GitHub to Google Cloud was kind of a nightmare. I eventually got it figured out with the help of Claude the AI. This guide was written by Claude to summarize everything we had to do to get it working, saved for future me.

>[!NOTE]
> This project is not open source in the way that anyone can just use this code for their own purposes. I retain and reserve all possible rights with this codebase. This is just for my knowledge.

It turns out that doing things from the command line was much easier than using their panel. If you want more official documentation, the tech used here is called `Google Buildpacks`

Everything after this paragraph is AI generated, except for my notes which are _in italics!_

## Prerequisites
- Google Cloud account with billing enabled
- GitHub repository
- Firebase project set up with service account credentials

## Initial Setup

1. Enable required Google Cloud APIs:
```bash
gcloud services enable run.googleapis.com \
    cloudbuild.googleapis.com \
    artifactregistry.googleapis.com \
    cloudresourcemanager.googleapis.com \
    iam.googleapis.com
```

2. Create service account for GitHub Actions:
```bash
gcloud iam service-accounts create github-actions-sa
```

3. Grant necessary permissions:

_You'll probably have to update the service account. This is just what I used._
```bash
gcloud projects add-iam-policy-binding powell-stats \
    --member="serviceAccount:github-actions-sa@powell-stats.iam.gserviceaccount.com" \
    --role="roles/artifactregistry.reader"

gcloud projects add-iam-policy-binding powell-stats \
    --member="serviceAccount:github-actions-sa@powell-stats.iam.gserviceaccount.com" \
    --role="roles/artifactregistry.writer"

gcloud projects add-iam-policy-binding powell-stats \
    --member="serviceAccount:github-actions-sa@powell-stats.iam.gserviceaccount.com" \
    --role="roles/cloudbuild.builds.builder"

gcloud projects add-iam-policy-binding powell-stats \
    --member="serviceAccount:github-actions-sa@powell-stats.iam.gserviceaccount.com" \
    --role="roles/cloudbuild.serviceAgent"

gcloud projects add-iam-policy-binding powell-stats \
    --member="serviceAccount:github-actions-sa@powell-stats.iam.gserviceaccount.com" \
    --role="roles/iam.serviceAccountUser"

gcloud projects add-iam-policy-binding powell-stats \
    --member="serviceAccount:github-actions-sa@powell-stats.iam.gserviceaccount.com" \
    --role="roles/run.admin"

gcloud projects add-iam-policy-binding powell-stats \
    --member="serviceAccount:github-actions-sa@powell-stats.iam.gserviceaccount.com" \
    --role="roles/storage.admin"
```

4. Set up Workload Identity Federation:

_Again, you'll have to swap out project name and stuff._

_Identity Federation is super cool. Basically Google Cloud trusts GitHub because of this._
```bash
# Create the pool
gcloud iam workload-identity-pools create "github-pool" \
    --location="global" \
    --display-name="GitHub Actions Pool" \
    --project="powell-stats"

# Create the provider
gcloud iam workload-identity-pools providers create-oidc "github-provider" \
    --workload-identity-pool="github-pool" \
    --location="global" \
    --display-name="GitHub provider" \
    --attribute-mapping="google.subject=assertion.sub,attribute.repository=assertion.repository" \
    --issuer-uri="https://token.actions.githubusercontent.com" \
    --attribute-condition="assertion.repository=='webecke/PowellStats'" \
    --project="powell-stats"
```

5. Store Firebase credentials in Secret Manager:
    - Name the secret: `FIREBASE_CREDENTIALS`
    - Content should be the entire Firebase service account JSON

6. Create GitHub Actions workflow file:
    - Create `.github/workflows/deploy.yml`
      - _It should be in the repo already. If its not, Claude did a really good job generating one for me._


## Deployment
After setup is complete, deployment happens automatically when code is pushed to the main branch. You can verify deployment by:

```bash
gcloud run services describe powellstats --region us-central1
```

## Cleanup
To remove deployment resources:

_I don't think this is something you do when you're developing. Do this once you delete it locally._
```bash
# Delete Cloud Run service
gcloud run services delete powellstats --region us-central1

# Delete service account
gcloud iam service-accounts delete github-actions-sa@powell-stats.iam.gserviceaccount.com

# Delete workload identity pool
gcloud iam workload-identity-pools delete github-pool --location global
```

## Troubleshooting
- Check GitHub Actions logs for build/deploy issues
- Check Cloud Run logs for runtime issues
- Verify service account permissions if deployment fails
- Ensure Firebase credentials secret is properly set
