# Backlog b05: Store Secrets in Fabric Notebooks with Azure Key Vault

## Evidence
Stack Overflow `microsoft-fabric` tag:

| Views | Question | Answered |
|---|---|---|
| 10,208 | Generating token for Fabric Rest api using client secret (the secret has to live somewhere) | yes |
| 1,831 | Accessing Azure Key Vault Secrets list from Fabric Notebook using Managed Private Endpoint | yes |
| 1,094 | Handling secrets in Fabric Notebooks | **no** |
| 798 | How to authenticate via service principal in Webv2 activity for key vault secret read | yes |

Related r/MicrosoftFabric threads:
- "Connectors - surviving staff turnover..." (23 comments)
- "Lakehouse ownership: What happens if the owner's password expires?"
- "Do you like Workspace Identity?" (48)
- "When will Identity support become mature in Fabric?"

Identity and secrets also show up in most of the CI/CD threads.

The highest-intent question, "Handling secrets in Fabric Notebooks", has no accepted answer.

---

# Stop Hard-Coding Secrets in Fabric Notebooks (Key Vault in 7 Minutes)
- **Runtime target:** 7 min
- **Pillar:** search-driven how-to
- **Target keywords:** fabric notebook key vault, notebookutils getSecret, fabric secrets, fabric notebook api key, fabric managed private endpoint key vault

**Title options**
1. Stop Hard-Coding Secrets in Fabric Notebooks (Key Vault in 7 Minutes)
2. notebookutils.credentials.getSecret: The Right Way to Handle API Keys in Fabric
3. Why Your Key Vault Secret Works for You but Fails at 2 a.m.

**Thumbnail:** an API key crossed out in a notebook cell, a padlock icon, and the text "NO MORE KEYS IN CODE".

**Verify before recording**
- **`notebookutils.credentials.getSecret(akvName, secret)` signature,** and whether a vault name or the full vault URI is required.
- **Which identity is used for scheduled runs and pipeline runs** (notebook owner / last modifier / pipeline invoker), and whether workspace identity can be used to read Key Vault. This has changed over time.
- **Managed private endpoints for Key Vault:** SKU requirements, approval flow and regional availability.
- **Azure Key Vault references in Fabric connections** (preview in 2025). Current status.
- **Output redaction** of secret values ("[REDACTED]") in notebook output. Confirm the behavior.
- **Variable libraries in notebooks** (GA per community) and whether they support secret types. As of mid-2026, use them for non-secret config only.

## Hook (0:00–0:30)
"If your Fabric notebook has an API key pasted into a cell, anyone with access to the workspace, its Git repo or its version history can read it. In seven minutes I'll move that secret into Azure Key Vault, read it with one line, and fix the error that makes it work for you and fail in the 2 a.m. schedule."

## Script

### 0:30 Why not just paste it?
[ON SCREEN: notebook cell with `API_KEY = "sk-live-..."` → Git commit → workspace viewers]

"A notebook is an item in a workspace. Everyone with Contributor or higher can open it. If the workspace is connected to Git, the key is now in your repo's history forever. And when the key rotates, you have to find every notebook that has it. Key Vault fixes all three: one place, access control, rotation without code changes."

### 1:15 Step 1: create the vault and the secret
[DEMO: Azure portal → Key vaults → Create → RBAC permission model → Create. Secrets → Generate/Import → name `weather-api-key` → value → Create.]

"Use the RBAC permission model. It's the current default and it makes the next step one role assignment."

### 2:00 Step 2: give the right identity access
[DEMO: Key vault → Access control (IAM) → Add role assignment → "Key Vault Secrets User" → assign to yourself (for development) and to the identity that runs scheduled jobs.]

"Key Vault Secrets User means it can read secret values, and that's all. Give it to two identities: you, so it works while you develop, and whoever the scheduled run executes as. That second one is where people get stuck. More in a minute."

### 2:45 Step 3: read it in the notebook
```python
VAULT = "https://kv-fabric-prod.vault.azure.net/"
api_key = notebookutils.credentials.getSecret(VAULT, "weather-api-key")

import requests
r = requests.get("https://api.example.com/v1/forecast",
                 headers={"Authorization": f"Bearer {api_key}"}, timeout=30)
r.raise_for_status()
```

"One line. No client secret, no extra libraries. It uses the identity running the notebook."

[DEMO: `print(api_key)` → output shows `[REDACTED]`]

"Fabric redacts secret values in cell output, so an accidental print doesn't leak it. Don't rely on that. Never log secrets, and never write them to a table."

### 3:45 Step 4: the "works for me, fails at 2 a.m." problem
[ON SCREEN: interactive run = you · scheduled/pipeline run = a different identity]

"When you click Run, the notebook runs as you. When a schedule or pipeline runs it, the run uses a different identity. Depending on how it's triggered, that's the notebook's owner, the pipeline's last modifier, or a configured connection. If that identity doesn't have Key Vault Secrets User, getSecret fails, but only on the schedule.

Two fixes:
1. Give the scheduling identity the role on the vault. If it's a person, that ties prod to one employee.
2. Better: run production jobs under a service account or a service principal, and give that the role. Then nothing breaks when someone leaves the company. That's what the 'surviving staff turnover' thread is really about."

### 4:45 Step 5: Key Vault behind a firewall
"Many companies lock Key Vault to private networks. Then getSecret times out. The fix is a managed private endpoint:"

[DEMO: Workspace settings → Network security → Managed private endpoints → Create → name `mpe-kv` → resource ID of the vault → sub-resource `vault` → Create. Then Azure portal → Key vault → Networking → Private endpoint connections → Approve.]

"Fabric requests it, a Key Vault admin approves it, and Spark sessions in that workspace reach the vault privately. The approval step trips people up: until someone approves it in the Azure portal, it stays Pending and nothing works."

### 5:30 What goes in Key Vault and what doesn't
[ON SCREEN: table]

| Value | Where |
|---|---|
| API keys, passwords, client secrets | Key Vault |
| Workspace IDs, lakehouse names, URLs, flags | Variable library (per environment) |
| Connections to databases/SaaS | Fabric connections (managed credentials) |

"Not everything is a secret. Environment config like IDs and URLs belongs in a variable library, so Dev, Test and Prod differ without code changes. Database connections are better as Fabric connections, where credentials are stored by the platform. Key Vault is for the true secrets your code needs."

### 6:15 Bonus: secrets for the Fabric REST API
"Calling the Fabric API from a notebook with a service principal? Keep its client secret in Key Vault too:"

```python
from azure.identity import ClientSecretCredential
sp_secret = notebookutils.credentials.getSecret(VAULT, "sp-fabric-automation-secret")
cred = ClientSecretCredential("<tenant-id>", "<client-id>", sp_secret)
token = cred.get_token("https://api.fabric.microsoft.com/.default").token
```

"If you're calling as yourself, you don't need any of that: FabricRestClient handles it. That's in my REST API video."

### 6:45 Wrap
"Vault with RBAC, the Secrets User role for you and for whoever runs the schedule, one line of getSecret, and a managed private endpoint if the vault is firewalled. Config goes in variable libraries, not Key Vault. Code's below."

## Chapters
0:00 Keys in notebooks
0:30 Why not just paste it
1:15 Create the vault + secret
2:00 Give the right identities access
2:45 getSecret in one line
3:45 Works for me, fails at 2 a.m.
4:45 Firewalled Key Vault: managed private endpoint
5:30 Key Vault vs variable library vs connections
6:15 Bonus: Fabric API secrets
6:45 Wrap

## Description + tags
Handle secrets in Microsoft Fabric notebooks with Azure Key Vault: notebookutils.credentials.getSecret, RBAC roles, the scheduled-run identity problem, managed private endpoints for firewalled vaults, and what belongs in variable libraries instead.
Code: [link]

Tags: fabric notebook key vault, notebookutils getsecret, fabric secrets, mssparkutils getsecret, fabric managed private endpoint, fabric variable library

## Shorts cutdowns
**Short 1: "One line to stop leaking API keys" (30s)**
"API key pasted into a Fabric notebook? Move it to Key Vault and use one line: `notebookutils.credentials.getSecret(vault, 'my-key')`. Give yourself the Key Vault Secrets User role. Done. Out of your code, out of your Git history."

**Short 2: "Works for you, fails on schedule" (40s)**
"Key Vault secret works when you run the notebook but fails on the schedule? The scheduled run uses a different identity. Give that identity Key Vault Secrets User. Better yet, use a service account so it doesn't break when someone leaves."
[ON SCREEN: You ✅ · Schedule ❌ → add role]

## LinkedIn post
"Handling secrets in Fabric notebooks" is an unanswered Stack Overflow question. Here's my answer:

🔐 Secrets (API keys, passwords) → Azure Key Vault → `notebookutils.credentials.getSecret()`
⚙️ Config (IDs, URLs, flags) → variable library, per environment
🔌 DB/SaaS credentials → Fabric connections

The gotcha: interactive runs use *your* identity; scheduled runs don't. Grant Key Vault Secrets User to the identity that runs prod, ideally a service account, not a person.

Firewalled vault? Managed private endpoint, and someone has to approve it in Azure.

[Diagram: notebook → getSecret → (MPE) → Key Vault]

---

## Blog version

# How to Handle Secrets in Microsoft Fabric Notebooks with Azure Key Vault

Hard-coded API keys in Fabric notebooks are visible to workspace members and to any connected Git repository. Azure Key Vault plus one notebookutils call fixes that.

## Create a Key Vault secret for Fabric
1. Create a Key Vault with the **Azure RBAC** permission model.
2. Add a secret (e.g. `weather-api-key`).
3. Grant **Key Vault Secrets User** to the identities that run the notebook: your account for development, and the identity used by scheduled or pipeline runs.

## Read a secret with notebookutils.credentials.getSecret
```python
VAULT = "https://kv-fabric-prod.vault.azure.net/"
api_key = notebookutils.credentials.getSecret(VAULT, "weather-api-key")
```
The call uses the identity running the notebook, so no client secret is needed. Fabric redacts secret values in cell output, but never log or persist secrets. `mssparkutils.credentials.getSecret` is the older name for the same function.

## Fix secrets that work interactively but fail on a schedule
Interactive runs execute as you. Scheduled and pipeline runs may execute as a different identity. If that identity lacks the Key Vault role, `getSecret` fails only on the schedule. Grant the role to that identity. For resilience, run production jobs under a service account or service principal, not an individual employee.

## Access a firewalled Key Vault with a managed private endpoint
If the vault blocks public access:
1. In **Workspace settings → Network security → Managed private endpoints**, create an endpoint to the vault (sub-resource `vault`).
2. **Approve the pending connection** in the Key Vault's Networking blade.

Until it's approved, calls will time out.

## Key Vault vs variable library vs connections
- **Key Vault:** API keys, passwords, client secrets.
- **Variable library:** non-secret environment config such as workspace IDs, lakehouse names and URLs.
- **Fabric connections:** stored credentials for databases and SaaS sources used by pipelines and dataflows.

## Store service principal secrets for the Fabric REST API
```python
from azure.identity import ClientSecretCredential
secret = notebookutils.credentials.getSecret(VAULT, "sp-fabric-automation-secret")
token = ClientSecretCredential("<tenant>", "<client-id>", secret) \
          .get_token("https://api.fabric.microsoft.com/.default").token
```
When calling as yourself inside Fabric, `sempy.fabric.FabricRestClient()` needs no secret at all.
