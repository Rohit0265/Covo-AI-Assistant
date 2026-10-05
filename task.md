You are working on an existing project. **First, thoroughly scan and understand the entire codebase before making any changes. Do not assume the architecture, framework, database, authentication flow, existing payment logic, or credit system.**

### Primary Task

Integrate **Razorpay** into the existing application with both:

- Backend integration
- Frontend integration

The goal is to allow users to purchase credits through Razorpay.

### IMPORTANT: Permission Before Changes

**Do not modify, create, delete, install, or restructure anything without asking for my permission first.**

Your workflow must be:

1. Scan the entire project.
2. Understand the current architecture and identify:
   - Frontend framework and structure
   - Backend framework and structure
   - Database and relevant schemas/models
   - Authentication/user system
   - Existing API structure
   - Existing credit/balance system
   - Existing payment-related code
   - Environment variable configuration
   - Deployment configuration
3. Report your findings to me.
4. Identify exactly which files you propose to modify/create.
5. Explain the implementation approach.
6. **Ask for my explicit permission before making any changes.**
7. Only after I approve, implement the integration.

### Razorpay Integration Requirements

After approval, implement Razorpay using the project's existing architecture and coding conventions.

The payment flow should generally be:

1. User selects a credit package on the frontend.
2. Frontend requests the backend to create a Razorpay order.
3. Backend creates the Razorpay order using the official Razorpay SDK/API.
4. Backend returns the required order information to the frontend.
5. Frontend opens the Razorpay Checkout.
6. User completes the payment.
7. The frontend sends the payment/order details back to the backend as required.
8. Backend verifies the Razorpay payment signature securely.
9. **Only after successful server-side verification should credits be added to the user's account.**
10. Return the updated credit balance/status to the frontend.

### CRITICAL CREDIT RULE

**Purchasing a product/payment must ONLY increase the user's credits.**

Do not introduce any other behavior such as:

- Creating subscriptions
- Giving access to unrelated features
- Changing user roles
- Modifying user permissions
- Creating memberships
- Changing account plans
- Deducting credits during purchase
- Automatically consuming credits
- Changing existing credit usage logic

The existing credit consumption/deduction system must remain unchanged unless I explicitly ask you to modify it.

### Prevent Duplicate Credit Grants

The implementation must protect against a user receiving credits multiple times for the same successful payment.

Consider the project's existing database structure and implement an appropriate idempotency/payment-record mechanism.

For example, a successfully processed Razorpay payment/order should not be able to trigger the same credit addition again if the user refreshes the page, retries the request, or sends the verification request multiple times.

**Do not blindly implement a particular database schema. First inspect the existing database and ask for permission if a new model/table/field is required.**

### Security Requirements

Do not trust payment information sent directly from the frontend.

The backend must:

- Keep the Razorpay secret key server-side.
- Never expose the Razorpay secret key to the frontend.
- Verify Razorpay payment signatures on the server.
- Validate the user and credit package on the backend.
- Ensure the amount being paid corresponds to the selected package.
- Prevent unauthorized users from adding credits.
- Prevent duplicate credit allocation.
- Handle failed/cancelled payments correctly.
- Avoid adding credits before successful verification.

### Environment Variables

First inspect the project's existing `.env` and configuration conventions.

Do not expose or print existing secret values.

If new environment variables are required, tell me exactly which variables need to be added and where they should be configured.

For example, Razorpay may require credentials such as:

- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`

But **do not assume these exact names are appropriate for this project.** Follow the existing project's naming conventions after inspection.

### Frontend

Inspect the existing UI and implement the payment flow consistently with the current design.

Do not redesign the application unnecessarily.

The frontend should:

- Display the existing credit packages if they already exist.
- Allow the user to select a package.
- Start the Razorpay checkout flow.
- Handle loading states.
- Handle payment success.
- Handle payment failure/cancellation.
- Display appropriate errors.
- Refresh/display the user's updated credit balance after successful payment.

Do not create a new credit-package system if one already exists.

### Backend

Inspect the existing API architecture before deciding where payment endpoints belong.

Possible functionality may include:

- Create Razorpay order
- Verify Razorpay payment
- Retrieve payment/order status if required

However, **do not blindly create these endpoints if equivalent functionality already exists.**

Use the project's existing authentication, validation, error-handling, database, and API conventions.

### Database

Before modifying the database:

1. Inspect the existing user and credit models.
2. Determine how credits are currently stored.
3. Determine whether transactions/payment records already exist.
4. Determine whether the existing structure can safely support Razorpay.
5. If a migration or schema change is required, explain it to me first.
6. Ask for permission before applying the migration.

### Do NOT

- Assume the framework.
- Assume the database.
- Assume the authentication system.
- Assume how credits are stored.
- Assume the existing purchase flow.
- Rewrite unrelated code.
- Refactor unrelated components.
- Change the UI unnecessarily.
- Remove existing functionality.
- Add subscriptions.
- Add recurring payments.
- Change credit deduction/consumption behavior.
- Add credits before payment verification.
- Expose Razorpay secrets.
- Install packages without permission.
- Run database migrations without permission.
- Modify environment files without permission.
- Make architectural changes without permission.

### First Response Requirement

**Do NOT start coding immediately.**

Your first response must contain:

#### 1. Project Analysis
Summarize what you discovered about the project.

#### 2. Existing Payment/Credit Flow
Explain how payments and credits currently work, if they already exist.

#### 3. Proposed Razorpay Flow
Show the exact flow you recommend.

#### 4. Files to Change
List every file you expect to:
- Modify
- Create
- Delete, if any

#### 5. Dependencies
List any new packages that would need to be installed.

#### 6. Database Changes
Explain any required schema/migration changes.

#### 7. Environment Variables
List the required new environment variables **without revealing any existing secret values**.

#### 8. Risks / Questions
Mention anything you could not determine from the codebase.

#### 9. Permission Request

End by asking:

**"I have completed the project analysis. Do you approve these proposed changes and package/database modifications? I will not modify anything until you explicitly approve."**

Wait for my approval before making any changes.