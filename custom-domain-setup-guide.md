# Setting Up Custom Domains (AWS Amplify, Route 53, Cloudflare & Custom DNS)

This guide walks you through connecting a custom apex domain (e.g., `example.com`) and subdomains (e.g., `www.example.com`, `api.example.com`, `staging.example.com`) to your deployed application with automated SSL/TLS certificate management.

---

## 1. Connecting a Custom Domain in AWS Amplify Console

### Step 1: Open Amplify Domain Management
1. Navigate to the [AWS Amplify Console](https://console.aws.amazon.com/amplify/).
2. Select your application.
3. In the left navigation menu under **App settings**, click **Domain management**.
4. Click **Add domain** (or **Manage domains**).

### Step 2: Enter Domain Name
1. In the **Domain** field, enter your root domain (e.g., `bharatyatra.com`).
2. Click **Configure domain**.

### Step 3: Configure Branch Subdomain Mappings
Amplify automatically generates default subdomain routes. Configure them as needed:

| Subdomain | Target Branch | Redirect / Rewrite Target |
| :--- | :--- | :--- |
| `https://bharatyatra.com` (Apex) | `main` | Primary Root |
| `https://www.bharatyatra.com` | `main` | Redirect to `https://bharatyatra.com` (or vice-versa) |
| `https://staging.bharatyatra.com` | `staging` | Staging Preview Environment |
| `https://api.bharatyatra.com` | `main` | GraphQL & REST Gateway |

Click **Save**.

---

## 2. DNS Verification & Record Setup

### Scenario A: Your Domain is Managed in Amazon Route 53
- If your hosted zone is in the same AWS account as your Amplify app, Amplify automatically creates and configures the Route 53 `ALIAS` and `CNAME` records for you.
- Verification and SSL provisioning complete automatically within 5–15 minutes.

---

### Scenario B: Third-Party DNS Provider (Cloudflare, GoDaddy, Namecheap, Google Domains)
Amplify will provide two sets of DNS records:

#### 1. SSL Certificate Validation (CNAME Record)
Amplify requests a free managed SSL certificate from AWS Certificate Manager (ACM). Add this verification CNAME record to your DNS provider:

```text
Type:  CNAME
Name:  _a1b2c3d4e5f6.bharatyatra.com. (or the verification prefix provided)
Value: _x1y2z3a4b5c6.acm-validations.aws.
TTL:   Auto / 300 seconds
```

#### 2. Root Domain & Subdomain Routing (CNAME & ANAME / ALIAS Records)
Once the certificate validates, add your routing records:

- **For `www` and subdomains:**
  ```text
  Type:  CNAME
  Name:  www
  Value: d123456abcdef8.cloudfront.net (Amplify CloudFront distribution domain)
  TTL:   Auto / 300 seconds
  ```

- **For Apex / Root Domain (`@` or `bharatyatra.com`):**
  - **In Cloudflare / Route 53 / DNS Made Easy:** Add a `CNAME` or `ALIAS` record with CNAME Flattening enabled pointing `@` to `d123456abcdef8.cloudfront.net`.
  - **In GoDaddy / Namecheap (Providers without CNAME flattening):** Use Amplify's root domain forwarding or point the `A` record to the AWS CloudFront Anycast IPs provided in the Amplify Console.

---

## 3. SSL / HTTPS & Automated Renewal

- **Automated SSL**: Certificates are issued free of charge via AWS Certificate Manager (ACM).
- **Auto-Renewal**: ACM automatically renews certificates before expiration as long as the DNS validation CNAME remains in place.
- **HSTS & TLS 1.3**: Amplify automatically enforces HTTPS redirects and TLS 1.2 / 1.3 protocols.

---

## 4. Troubleshooting Custom Domain Issues

| Status | Cause | Resolution |
| :--- | :--- | :--- |
| **Pending verification** | DNS validation CNAME record has not propagated yet | Check DNS propagation using `dig CNAME _validation_name.yourdomain.com` |
| **Domain in use by another CloudFront distribution** | Domain was previously attached to another AWS account or CloudFront distribution | Remove the CNAME from the old distribution or open an AWS Support ticket to release the alias |
| **SSL Handshake Failed / Cloudflare 525** | Cloudflare SSL mode mismatch | In Cloudflare, set SSL/TLS encryption mode to **Full** or **Full (strict)** |
