# Backlog b10: OneLake Security and RLS Explained: Workspace Roles vs Item Permissions vs Data Roles

## Evidence (why this piece)
- **r/MicrosoftFabric, "Understanding OneLake security, RLS and how to access": 44 comments.**
  - An admin shares a lakehouse with a user in another workspace and creates a OneLake security role with RLS and CLS.
  - Tables without RLS/CLS work from the user's notebook. The RLS table returns `403 Forbidden` in Spark.
- **r/MicrosoftFabric, "OneLake security syncing roles": 35 comments.**
  - The poster has 12 roles × ~180 tables deployed via API.
  - They don't know how long role changes take to apply and get inconsistent test results.
- **r/MicrosoftFabric, "Microsoft PM here: I need your feedback on Fabric Warehouse security": 99 comments.**
- **r/MicrosoftFabric, "Hi! We're the Fabric Warehouse team, ask us anything" (security AMA): 87 comments.**
- **r/MicrosoftFabric, "Do you like workspace identity?": 48 comments.** Anyone with Contributor can use whatever the workspace identity can reach.
- **Stack Overflow:**
  - Service principal auth: "Authentication not granted for service principal token", 3,009 views.
  - App permissions: "How to grant permissions to my application to use Microsoft Fabric services?", 2,511 views.
  - Security groups on the SQL endpoint: "How to access an Azure AD security group in the Lakehouse SQL analytics endpoint", 879 views.
- **Fabric Community forum:**
  - "Set SQL analytics endpoint access mode (user's identity)"
  - "How to see role permissions in a particular workspace?"
  - "Domain permissions & workspace roles"
  - "Sharing rights for Contributor role"
  - "Org app doesn't grant semantic model access"
- **Theme total:** security/permissions is the #2 how-to search theme on Stack Overflow (28,855 views across 25 questions).

---

# Video: Fabric Security Explained: Who Can See What (Workspace Roles, OneLake Security, RLS)

- **Runtime target:** 15 min
- **Pillar:** 3 (concept) + 6 (architecture)
- **Target keywords:** onelake security, fabric row level security, onelake (8,100, 0.99×), fabric workspace roles, sql analytics endpoint security
- **Title options:**
  1. Microsoft Fabric Security Explained: The 3 Layers Everyone Mixes Up
  2. OneLake Security + Row-Level Security in Fabric (Step by Step, 2026)
  3. Why Your Fabric RLS Returns 403 (and How to Fix It)
- **Thumbnail:** "WHO SEES WHAT?". Three stacked layers (Workspace / Item / Data) with a padlock.
- **Verify before recording** (security behaviour is the most likely thing to have changed):
  - OneLake security GA/preview status, and which engines enforce it: Spark notebooks, the SQL analytics endpoint in "User's identity" mode, Direct Lake on OneLake semantic models, shortcuts, Eventhouse.
  - Whether Spark notebooks can read RLS/CLS tables for restricted users. The community reports a 403. Earlier docs said RLS/CLS tables were not readable from Spark for restricted users; confirm the current behaviour and the supported workaround.
  - The default `DefaultReader` role and how it interacts with custom roles.
  - Whether workspace Admin/Member/Contributor bypass OneLake security data roles (as of our knowledge they do; data roles restrict Viewers and users with shared item access).
  - SQL analytics endpoint access modes: "User's identity" vs "Delegated identity". Check the names.
  - Role propagation time after a change, and after a group membership change.
  - REST API path for OneLake data access roles (e.g. `/v1/workspaces/{id}/items/{id}/dataAccessRoles`) and its payload shape.
  - Warehouse T-SQL RLS (`CREATE SECURITY POLICY`) and CLS (`GRANT SELECT ON (cols)`) support.

## Hook (0:00–0:30)
"You set up row-level security in Fabric. You test it. And the user gets a 403. Or worse, they see everything. Fabric security has three layers, and almost every problem on the forums is someone setting the right permission on the wrong layer. In the next 14 minutes I'll draw the three layers, set up OneLake security with row- and column-level rules, and show you the four mistakes that cause the 403s and the data leaks."

## Script

### 0:30 The three layers
"[ON SCREEN: three stacked boxes]

Layer one: the **workspace**. Roles: Admin, Member, Contributor, Viewer. This decides what you can do with items: create, edit, run.

Layer two: the **item**. You can share one lakehouse or one warehouse with someone who isn't in the workspace, and choose what they get: connect, read all data, build reports.

Layer three: the **data**. OneLake security roles on a lakehouse, or SQL permissions on a warehouse. Which folders, tables, rows and columns.

The rule to remember: the higher layer can override the lower one. If you give someone Contributor on the workspace, your carefully written row filter doesn't restrict them. Data roles restrict Viewers and people you shared the item with."

### 2:30 Mistake 1: testing with an admin account
"So the first mistake: you test RLS as yourself. You're workspace Admin, you see all rows, you think the filter is broken. Or you think it works, because you never tested a restricted user.

Always test with a separate account that is only a Viewer or only has the item shared. [ON SCREEN: 'Test user = Viewer only']"

### 3:15 Set up OneLake security on a lakehouse
"[DEMO: Lakehouse → Manage OneLake security]

You'll see a default role, DefaultReader, that gives read on everything to anyone who already has read on the lakehouse. That's mistake number two waiting to happen: if you leave DefaultReader as is, your new restrictive role adds nothing, because the user also gets everything through the default.

So: edit DefaultReader to remove the users you're restricting, or scope it down.

Now a new role, `sales_emea`. [DEMO: New role]
- Tables: `dim_date` (all), `dim_customer` (columns: customer_id, region only: column-level security), `fact_sales`.
- Row-level security on `fact_sales`:"

```sql
SELECT * FROM fact_sales WHERE region = 'EMEA'
```

"- Members: the Entra group `sg-sales-emea`. [DEMO: add group]

Save."

### 5:00 Make the SQL endpoint respect it
"Next, the SQL analytics endpoint. It has an access mode. [DEMO: SQL endpoint → Security → access mode → User's identity]

In User's identity mode, the endpoint uses OneLake security, so the same role applies in SQL. In the other mode, delegated, the endpoint uses its own SQL permissions and your OneLake role doesn't apply there. That's mistake three: setting the role on the lakehouse and then wondering why SQL shows everything, or nothing."

### 6:00 Test as the restricted user
"[DEMO: sign in as test user (Viewer only) → SQL endpoint → query]"

```sql
SELECT region, COUNT(*) FROM dbo.fact_sales GROUP BY region;  -- expect only EMEA
SELECT * FROM dbo.dim_customer;                               -- expect only 2 columns
```

"[DEMO: Power BI report on a Direct Lake on OneLake model → test user sees EMEA only]"

### 7:00 The 403 from Spark
"Now the one from the forums. Same user, notebook, reads `fact_sales` with Spark. [DEMO: spark.sql('SELECT * FROM lakehouse.fact_sales')] And: 403 Forbidden. The table without RLS works.

Here's what's going on. To filter rows, the engine reading the files has to enforce the rule. Not every engine enforces RLS and CLS for a restricted user in every setup. When it can't, the safe behaviour is to deny, not to show everything, so you get a 403.

[ON SCREEN: 'Check the docs link for which engines enforce RLS/CLS today']

What to do:
- Restricted users who need filtered data: read through the SQL analytics endpoint, or a Direct Lake semantic model, which enforce the role.
- People who build pipelines and need full data in Spark: give them a role without RLS on those tables, or Contributor in the data engineering workspace. They're not your restricted audience."

### 8:30 Mistake 4: expecting changes to apply instantly
"The other forum thread: 12 roles, 180 tables, deployed via API, and inconsistent results when testing. Role changes and group membership changes take time to propagate. Group changes in Entra can take longer than role edits.

So when you test: make the change, wait, then test with a fresh sign-in. Don't change three things and test once. [ON SCREEN: 'Change → wait → new session → test']"

### 9:15 Deploy roles as code
"180 tables by hand is not a plan. OneLake data access roles can be managed through the REST API. Here's the shape. [ON SCREEN: flagged 'check current API reference']"

```python
import requests
ws, lh = "<workspace-id>", "<lakehouse-id>"
token = notebookutils.credentials.getToken("https://api.fabric.microsoft.com")
roles = {
  "value": [{
    "name": "sales_emea",
    "decisionRules": [{
      "effect": "Permit",
      "permission": [
        {"attributeName": "Path",   "attributeValueIncludedIn": ["Tables/fact_sales", "Tables/dim_date"]},
        {"attributeName": "Action", "attributeValueIncludedIn": ["Read"]}
      ]
    }],
    "members": {"microsoftEntraMembers": [{"tenantId": "<tenant>", "objectId": "<group-object-id>"}]}
  }]
}
r = requests.put(f"https://api.fabric.microsoft.com/v1/workspaces/{ws}/items/{lh}/dataAccessRoles",
                 headers={"Authorization": f"Bearer {token}"}, json=roles)
print(r.status_code, r.text[:300])
```

"Generate that JSON from a table of role, table, filter and group. Then the 180×12 setup is a loop, and it's in Git."

### 10:30 Warehouse: T-SQL security instead
"If your gold layer is a warehouse, you use SQL security, which DBAs already know:"

```sql
CREATE SCHEMA sec;
GO
CREATE FUNCTION sec.fn_region(@region AS varchar(20))
RETURNS TABLE WITH SCHEMABINDING
AS RETURN SELECT 1 AS ok
WHERE @region = 'EMEA' AND IS_MEMBER('sg-sales-emea') = 1
   OR IS_MEMBER('sg-sales-all') = 1;
GO
CREATE SECURITY POLICY sec.sales_filter
ADD FILTER PREDICATE sec.fn_region(region) ON dbo.fact_sales
WITH (STATE = ON);
GO
GRANT SELECT ON dbo.dim_customer (customer_id, region) TO [sg-sales-emea];  -- column-level
```

"Same rule as before: workspace Admins, Members and Contributors aren't your test users."

### 11:30 Identity for jobs: workspace identity vs service principal
"Last piece: what your pipelines run as. A popular thread pointed out that with workspace identity, anyone who is Contributor in that workspace can use whatever the identity can reach. That's convenient and also a risk.

[ON SCREEN: table]

| Workspace identity | Service principal |
|---|---|
| No secrets to manage | Secret or certificate in Key Vault |
| Anyone with Contributor can use it | Only what you wire it into |
| Good for single-team workspaces | Better for shared or sensitive sources |"

### 12:30 The checklist
"[ON SCREEN]
1. Restricted users are Viewers or have item sharing only. Never Contributor.
2. Edit DefaultReader.
3. SQL endpoint in User's identity mode.
4. Read RLS data through SQL or Direct Lake; expect a 403 in Spark until docs say otherwise.
5. Change, wait, new session, test.
6. Roles as code via the API.
7. Pick workspace identity vs SPN on purpose."

### 13:30 Outro
"Three layers, four mistakes, one checklist. If your RLS is giving you a 403 right now, start at number four. Subscribe to [CHANNEL]."

## Chapters
0:00 Why your RLS returns 403
0:30 The 3 layers of Fabric security
2:30 Mistake 1: testing as admin
3:15 OneLake security roles (RLS + CLS)
5:00 Mistake 3: SQL endpoint access mode
6:00 Test as a restricted user
7:00 The 403 in Spark: what's happening
8:30 Mistake 4: propagation delay
9:15 Roles as code (REST API)
10:30 Warehouse RLS in T-SQL
11:30 Workspace identity vs service principal
12:30 Checklist
13:30 Outro

## Description + tags
Microsoft Fabric security explained: workspace roles vs item permissions vs OneLake security data roles, with row-level and column-level security step by step, the SQL endpoint access mode, why Spark returns 403 on RLS tables, and roles as code.

Code: [link]
Tags: onelake security, microsoft fabric security, row level security, column level security, fabric rls, sql analytics endpoint, fabric workspace roles, warehouse security, workspace identity, service principal

## Shorts
**Short 1: "Your RLS doesn't work because you're admin"** (30 s)
"Testing row-level security in Fabric as yourself? You're probably workspace admin, and admins see everything. [TEXT: Test with a Viewer-only account] Data roles restrict Viewers and shared users, not Contributors and up. Make a test account. Thank me later."

**Short 2: "403 on an RLS table"** (40 s)
"Fabric notebook gives 403 on a table with row-level security, but other tables work? [TEXT: 403 = engine can't enforce RLS → deny] When an engine can't apply the row filter for a restricted user, it denies instead of leaking. Read that data through the SQL endpoint or a Direct Lake model. Check the docs for what Spark supports today."

## LinkedIn post
Fabric security has three layers, and most RLS problems come from setting the right permission on the wrong one:

1. Workspace roles: what you can do (Admin, Member, Contributor, Viewer)
2. Item sharing: which lakehouse or warehouse you can reach
3. Data roles: which tables, rows and columns

Contributors and above aren't restricted by data roles, so test RLS with a Viewer.

Other common mistakes:
- Leaving DefaultReader as is
- SQL endpoint not in "User's identity" mode
- Expecting Spark to filter rows for restricted users (403)
- Testing before roles propagate

180 tables × 12 roles? Put the roles in code via the API.

[diagram: 3 stacked layers]

---

# Blog: OneLake Security and Row-Level Security in Microsoft Fabric, Explained

Security and permissions are among the most-searched Microsoft Fabric topics. Related Stack Overflow questions total nearly 29,000 views, and community threads about OneLake security, RLS and warehouse security regularly reach 40–100 comments. The common thread: Fabric has three layers of access, and problems come from mixing them up.

## The three layers
1. **Workspace roles:** Admin, Member, Contributor, Viewer. These control what you can do with items.
2. **Item permissions:** share a single lakehouse, warehouse or semantic model with someone outside the workspace, choosing what they can do.
3. **Data permissions:** OneLake security roles on lakehouses (folders, tables, rows, columns), or SQL permissions on warehouses.

**Key rule:** data roles restrict Viewers and users with shared item access. Workspace Admins, Members and Contributors are not restricted by them, so never use those accounts to test RLS.

## Setting up OneLake security with RLS and CLS
1. **Open "Manage OneLake security" on the lakehouse.**
2. **Adjust the DefaultReader role.** Otherwise restricted users still get full read through it.
3. **Create a role:** select tables; pick specific columns for column-level security; add a row filter such as `SELECT * FROM fact_sales WHERE region = 'EMEA'`.
4. **Add Entra groups as members.**
5. **Set the SQL analytics endpoint to "User's identity" mode** so SQL queries honour the same role.

## Why Spark returns 403 on RLS tables
Community users report that a restricted user can read normal tables from a notebook but gets `403 Forbidden` on tables with RLS or CLS. When an engine can't enforce row or column rules for that user, Fabric denies access rather than exposing all rows. Restricted users should read filtered data through the SQL analytics endpoint or a Direct Lake semantic model. Check current documentation for Spark support, which may have changed.

## Role changes take time
Changes to roles, and especially to group membership, can take time to apply. Test with a fresh session after waiting, and change one thing at a time.

## Manage roles as code
For many tables and roles, use the Fabric REST API for OneLake data access roles. Generate the role definitions from a configuration table and keep them in Git.

## Warehouse: T-SQL security
For a Fabric Warehouse, use familiar SQL features: `CREATE SECURITY POLICY` with a filter predicate function for RLS, and column-level `GRANT SELECT ON table (columns)`.

## Workspace identity or service principal?
Workspace identity removes secrets, but anyone with Contributor in the workspace can use whatever it can access. For shared or sensitive sources, a service principal with a scoped grant, and its secret in Key Vault, gives a tighter boundary.

## Checklist
- **Test with Viewer-only accounts.**
- **Edit DefaultReader.**
- **Put the SQL endpoint in User's identity mode.**
- **Serve RLS data via SQL or Direct Lake.**
- **Wait for propagation before testing.**
- **Keep roles in code.**
- **Choose job identities deliberately.**
