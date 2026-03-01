# VERITAS AI - Asset Transfer & Ownership Guide

## 1. Overview
This document outlines the steps to transfer full ownership and operational control of the VERITAS AI asset to a new owner.

## 2. Credential Transfer

The system relies on a single external dependency: The Google Gemini API Key.

**To transfer ownership:**
1. The Buyer must generate their own API Key from Google AI Studio (https://aistudio.google.com/).
2. The Buyer must replace the `GEMINI_API_KEY` environment variable in the hosting platform.
3. The Seller must revoke the original API Key immediately after transfer to ensure no residual access or billing liability.

## 3. Source Code Handover

1. **Repository Transfer**: Transfer the GitHub/GitLab repository ownership to the Buyer's account.
2. **Local Copy**: Provide a zipped archive of the latest stable source code.
3. **Documentation**: Ensure all documentation (Deployment, Legal, Security) is included.

## 4. Infrastructure Handover

If transferring the hosting account (e.g., Vercel, AWS):
1. Update the billing information to the Buyer's payment method.
2. Transfer the account ownership or invite the Buyer as an Admin and then leave the organization.

## 5. Liability Shielding

Upon transfer, the Seller should execute a formal "Asset Purchase Agreement" that includes:
- **"As-Is" Clause**: The software is sold as-is without continuing warranty.
- **Indemnification**: The Buyer agrees to indemnify the Seller against future claims arising from the operation of the software.
- **No Future Control**: Confirmation that the Seller retains no access to the system or data.

## 6. Post-Transfer Verification

The Buyer should:
1. Rotate all secrets (if any others were added).
2. Verify that the application runs successfully with their own API Key.
3. Audit the code to ensure no hardcoded credentials remain (The current codebase uses `process.env` exclusively).
