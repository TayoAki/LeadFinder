# Backlog b01: Get a Fabric REST API Token with a Service Principal (Python + PowerShell)

## Evidence
The most-viewed auth questions on Stack Overflow's `microsoft-fabric` tag:

| Views | Question | Answered |
|---|---|---|
| 10,208 | Generating token for Fabric Rest api using client secret | yes |
| 3,009 | Authentication not granted for service principal token in MS Fabric API using Python | yes |
| 2,511 | How to grant permissions to my application to use Microsoft Fabric services? | yes |
| 2,215 | Accessing Azure Fabric in a Multi-Tenant Scenario | yes |
| 1,982 | Getting InsufficientPrivileges / PrincipalTypeNotSupported error while calling Fabric REST API's | yes |
| 1,089 | Getting error while creating access token using OAuth 2.0 for MS Fabric | yes |
| 100 | Fabric REST API Using Service Principal Works for One Dataset but Fails with 401 for Another | **no** |

Together that's about 21K views on one job: get a token, then get past the 401/403.

On Reddit, service principal support keeps coming up in CI/CD and automation threads (e.g. "Service Principals are now Supported in Variable Libraries!", "When will Identity support become mature in Fabric?").

---

# Fabric REST API with a Service Principal: Token to First Call in 8 Minutes
- **Runtime target:** 8 min
- **Pillar:** search-driven how-to
- **Target keywords:** fabric rest api, fabric api service principal, fabric api token, PrincipalTypeNotSupported

**Title options**
1. Fabric REST API with a Service Principal: Token to First Call in 8 Minutes
2. Fix 401 / PrincipalTypeNotSupported on the Microsoft Fabric API
3. The ONLY Fabric API Auth Guide You Need (Python + PowerShell)

**Thumbnail:** "401 → 200" in big type, with a key icon and the Fabric logo.

**Verify before recording**
- **Tenant setting names in the Admin portal → Developer settings.** It has been called "Service principals can use Fabric APIs" and was later reorganized (e.g. "Service principals can create workspaces, connections, and deployment pipelines" / "Service principals can call Fabric public APIs"). Show today's exact labels.
- **Which endpoints still reject service principals** (`PrincipalTypeNotSupported`). Check each endpoint's "Microsoft Entra supported identities" table in the REST docs.
- **Whether API permissions in the Entra app registration are needed for client-credentials calls.** The script says Fabric authorizes a service principal through tenant settings and workspace roles, not through Entra API permissions. Confirm.
- **`Get-AzAccessToken` return type.** Az.Accounts 5.x / Az 14+ returns `Token` as a SecureString by default; older versions return plain text. The script handles both.
- **`sempy.fabric.FabricRestClient`** is still available in the default runtime.
- **Long-running operation polling headers** (`Location`, `x-ms-operation-id`, `Retry-After`).

## Hook (0:00–0:30)
"You have a client ID, a client secret and a tenant ID. You call the Fabric API and get a 401. Or worse, a 403 that says PrincipalTypeNotSupported. In the next eight minutes I'll get a token in Python and in PowerShell, make a real call, and show you the three settings behind almost every Fabric auth error. Copy the code from the description and you'll be calling the API before this video ends."

## Script

### 0:30 What you need (three things, in this order)
"Here's the whole setup in one picture."

[ON SCREEN: Entra app registration → Fabric tenant setting → workspace role → token → API]

"Three things have to be true. Miss one and you get a 401 or 403.

One: an app registration in Microsoft Entra ID with a client secret. That's your service principal.

Two: a Fabric admin has to let service principals use the APIs. It's a tenant setting, and it's usually scoped to a security group. So you put your service principal in that group.

Three: the service principal needs a role on the workspace you're calling. Admin, Member, Contributor or Viewer, depending on what you're doing.

You don't need to grant 'Power BI Service' API permissions on the app registration for this flow. Service principal access is decided by the tenant setting and the workspace role. People add those permissions, it doesn't help, and they lose an afternoon."

### 1:30 Step 1: create the app registration
[DEMO: Entra admin center → App registrations → New registration → name `sp-fabric-automation` → Register. Copy Application (client) ID and Directory (tenant) ID. Certificates & secrets → New client secret → copy the Value, not the Secret ID.]

"Copy the secret's Value column. The Secret ID column looks similar and it's the number one copy-paste mistake."

### 2:15 Step 2: tenant setting and workspace role
[DEMO: Entra → Groups → New security group `sg-fabric-api` → add `sp-fabric-automation` as member.]
[DEMO: Fabric → Settings (gear) → Admin portal → Tenant settings → Developer settings → enable the service principal API setting → "Specific security groups" → `sg-fabric-api` → Apply.]
[DEMO: open target workspace → Manage access → Add people or groups → search `sp-fabric-automation` → Contributor → Add.]

"Tenant settings can take a few minutes to apply. If your first call fails right after you flip it, wait five minutes before you start debugging."

### 3:00 Step 3: get a token in Python
"Two libraries do this. I'll show azure-identity because it's shorter."

[DEMO: VS Code, terminal: `pip install azure-identity requests`]

```python
import os, requests
from azure.identity import ClientSecretCredential

TENANT_ID = os.environ["FABRIC_TENANT_ID"]
CLIENT_ID = os.environ["FABRIC_CLIENT_ID"]
CLIENT_SECRET = os.environ["FABRIC_CLIENT_SECRET"]

cred = ClientSecretCredential(TENANT_ID, CLIENT_ID, CLIENT_SECRET)
token = cred.get_token("https://api.fabric.microsoft.com/.default").token

headers = {"Authorization": f"Bearer {token}"}
r = requests.get("https://api.fabric.microsoft.com/v1/workspaces", headers=headers)
r.raise_for_status()
for ws in r.json()["value"]:
    print(ws["id"], ws["displayName"])
```

"Look at the scope. It's the Fabric API URL plus `/.default`. With a service principal it's always `.default`, never a specific permission name.

And notice what comes back: only the workspaces the service principal is a member of. If you see an empty list, the token worked. You just haven't added it to a workspace."

[ON SCREEN: "Empty list ≠ broken token"]

"If you prefer MSAL, here's the same thing:"

```python
import msal
app = msal.ConfidentialClientApplication(
    CLIENT_ID,
    authority=f"https://login.microsoftonline.com/{TENANT_ID}",
    client_credential=CLIENT_SECRET,
)
result = app.acquire_token_for_client(scopes=["https://api.fabric.microsoft.com/.default"])
token = result["access_token"]  # if missing, print result["error_description"]
```

### 4:15 Step 4: the same in PowerShell
[DEMO: PowerShell 7]

```powershell
Install-Module Az.Accounts -Scope CurrentUser   # once
$secure = ConvertTo-SecureString $env:FABRIC_CLIENT_SECRET -AsPlainText -Force
$cred   = New-Object System.Management.Automation.PSCredential($env:FABRIC_CLIENT_ID, $secure)
Connect-AzAccount -ServicePrincipal -Tenant $env:FABRIC_TENANT_ID -Credential $cred | Out-Null

$t = Get-AzAccessToken -ResourceUrl "https://api.fabric.microsoft.com"
$token = if ($t.Token -is [securestring]) { $t.Token | ConvertFrom-SecureString -AsPlainText } else { $t.Token }

Invoke-RestMethod -Uri "https://api.fabric.microsoft.com/v1/workspaces" `
  -Headers @{ Authorization = "Bearer $token" } | Select-Object -ExpandProperty value
```

"Newer Az versions return the token as a secure string. That `if` line handles both old and new, so the script doesn't break when someone updates Az on the build agent."

### 5:00 Step 5: a call that does something (and long-running operations)
"Listing workspaces is a read. Creating things is where people get stuck, because many create calls return 202, not 201."

```python
import time
ws_id = "<workspace-guid>"
body = {"displayName": "lh_from_api", "type": "Lakehouse"}
r = requests.post(f"https://api.fabric.microsoft.com/v1/workspaces/{ws_id}/items",
                  headers=headers, json=body)
if r.status_code == 202:                      # long-running operation
    op_url = r.headers["Location"]
    while True:
        time.sleep(int(r.headers.get("Retry-After", 5)))
        r = requests.get(op_url, headers=headers)
        status = r.json().get("status")
        if status in ("Succeeded", "Failed"):
            print(status); break
else:
    r.raise_for_status(); print(r.json())
```

"202 means 'accepted, working on it'. Follow the Location header until the status says Succeeded or Failed."

### 6:00 The three errors and what they mean
[ON SCREEN: table]

| Error | Cause | Fix |
|---|---|---|
| 401 Unauthorized | Wrong scope, expired token, or the tenant setting is off | Scope `https://api.fabric.microsoft.com/.default`; check the tenant setting and group |
| 403 InsufficientPrivileges | The service principal has no role (or too low a role) on the workspace | Add it to the workspace as Contributor or higher |
| 403 PrincipalTypeNotSupported | That endpoint doesn't accept service principals yet | Use a user token or workspace identity for that call; check the endpoint's supported identities table |

"About the 401 on one dataset but not another in the same workspace: that's usually item-level. The item has its own permissions, or it lives on a different capacity or in a tenant region with different settings. Check the item, not the token."

### 6:45 Inside a Fabric notebook you don't need any of this
"If your code runs in a Fabric notebook, skip the secret entirely:"

```python
import sempy.fabric as fabric
client = fabric.FabricRestClient()
print(client.get("/v1/workspaces").json())
```

"FabricRestClient uses the identity of whoever runs the notebook. For automation outside Fabric, like GitHub Actions or Azure DevOps, use the service principal flow we just built, and keep the secret in your pipeline's secret store, not in code."

### 7:15 Wrap
"So: an app registration with a secret, the tenant setting scoped to a group, a workspace role, and a token with the `.default` scope. Get those four right and the Fabric API just works. The code is in the description. If you're doing CI/CD next, my Dev, Test and Prod video uses this exact service principal. Link on screen."

## Chapters
0:00 The 401 problem
0:30 What you need (3 things)
1:30 Create the app registration
2:15 Tenant setting + workspace role
3:00 Token in Python (azure-identity, MSAL)
4:15 Token in PowerShell
5:00 Create an item + long-running operations
6:00 401 vs 403 vs PrincipalTypeNotSupported
6:45 Inside notebooks: FabricRestClient
7:15 Wrap

## Description + tags
Call the Microsoft Fabric REST API with a service principal: get the token in Python (azure-identity, MSAL) and PowerShell, then fix 401, InsufficientPrivileges and PrincipalTypeNotSupported errors.
Code: [link]. Covers the tenant setting, workspace roles, long-running operations and FabricRestClient in notebooks.

Tags: microsoft fabric rest api, fabric api service principal, fabric api token python, fabric api powershell, PrincipalTypeNotSupported, fabric automation

## Shorts cutdowns
**Short 1: "Your Fabric API token is fine" (35s)**
"Calling the Fabric API and getting an empty list? Your token is fine. The service principal just isn't in any workspace. Fabric only returns workspaces it's a member of. Manage access, add it as Contributor, run again. Full auth guide on my channel."
[ON SCREEN: "Empty list ≠ broken token"]

**Short 2: "The scope everyone gets wrong" (30s)**
"Fabric API, service principal, 401? Check your scope. It's `https://api.fabric.microsoft.com/.default`. Not the Power BI scope, not a permission name: `.default`. That's all of it."
[ON SCREEN: the scope string, big]

## LinkedIn post
Most "Fabric API doesn't work" posts I see are one of three things:

1️⃣ The tenant setting for service principals is off, or not scoped to the SP's group → 401
2️⃣ The SP has no workspace role → 403 InsufficientPrivileges
3️⃣ The endpoint doesn't support SPs yet → 403 PrincipalTypeNotSupported

What it is *not*: missing API permissions on the app registration. Fabric decides SP access through tenant settings and workspace roles.

Scope: `https://api.fabric.microsoft.com/.default`. Long-running creates return 202. Follow the Location header.

[Diagram: App reg → tenant setting (group) → workspace role → token → API]

Which of the three got you?

---

## Blog version

# How to Call the Microsoft Fabric REST API with a Service Principal

The Fabric REST API lets you automate workspaces, items, deployments and refreshes. Most people get stuck on the first step: getting a token that works. This guide covers the setup, the token code in Python and PowerShell, and the three errors behind most failed calls.

## Fabric API service principal setup: the three requirements
A service principal can call the Fabric API only when all three of these are true:

1. **An Entra ID app registration with a client secret** (or a certificate).
2. **The Fabric tenant setting that lets service principals use the APIs** is enabled, usually scoped to a security group that contains the service principal. It's under Admin portal → Tenant settings → Developer settings.
3. **A workspace role** (Viewer, Contributor, Member or Admin) on every workspace the service principal touches.

You don't need to add Power BI API permissions to the app registration for the client-credentials flow. Access comes from the tenant setting and the workspace role.

## Get a Fabric API token in Python
```python
from azure.identity import ClientSecretCredential
import requests, os

cred = ClientSecretCredential(os.environ["FABRIC_TENANT_ID"],
                              os.environ["FABRIC_CLIENT_ID"],
                              os.environ["FABRIC_CLIENT_SECRET"])
token = cred.get_token("https://api.fabric.microsoft.com/.default").token
r = requests.get("https://api.fabric.microsoft.com/v1/workspaces",
                 headers={"Authorization": f"Bearer {token}"})
print(r.json())
```
The scope must be `https://api.fabric.microsoft.com/.default`. An empty `value` list means the token works but the service principal isn't a member of any workspace yet.

With MSAL, use `ConfidentialClientApplication(...).acquire_token_for_client(scopes=["https://api.fabric.microsoft.com/.default"])`.

## Get a Fabric API token in PowerShell
```powershell
$secure = ConvertTo-SecureString $env:FABRIC_CLIENT_SECRET -AsPlainText -Force
$cred = New-Object System.Management.Automation.PSCredential($env:FABRIC_CLIENT_ID, $secure)
Connect-AzAccount -ServicePrincipal -Tenant $env:FABRIC_TENANT_ID -Credential $cred | Out-Null
$t = Get-AzAccessToken -ResourceUrl "https://api.fabric.microsoft.com"
$token = if ($t.Token -is [securestring]) { $t.Token | ConvertFrom-SecureString -AsPlainText } else { $t.Token }
```
Newer Az.Accounts versions return the token as a SecureString. The last line handles both.

## Handle long-running operations (HTTP 202)
Creating items often returns **202 Accepted** with a `Location` header. Poll that URL, waiting for the `Retry-After` seconds between calls, until `status` is `Succeeded` or `Failed`. Treating 202 as an error is a common bug in first scripts.

## Fix 401, InsufficientPrivileges and PrincipalTypeNotSupported
- **401 Unauthorized:** wrong scope, an expired token, or the tenant setting is disabled or not scoped to the service principal's group. New tenant settings can take several minutes to apply.
- **403 InsufficientPrivileges:** the service principal lacks a workspace role, or has too low a role for the operation.
- **403 PrincipalTypeNotSupported:** that endpoint doesn't accept service principals. Check its "supported identities" table in the docs and use a user identity or workspace identity for that call.
- **Works for one item but not another:** check that item's own permissions and capacity, not the token.

## Inside Fabric notebooks: use FabricRestClient
In a notebook, `sempy.fabric.FabricRestClient()` authenticates as the user running it. No secret is needed:
```python
import sempy.fabric as fabric
fabric.FabricRestClient().get("/v1/workspaces").json()
```
Use the service principal flow for automation outside Fabric (GitHub Actions, Azure DevOps). Keep the secret in the pipeline's secret store or Key Vault, never in code.
