# Backlog b06: SharePoint to Lakehouse: Shortcut vs Pipeline vs Dataflow vs Notebook

## Evidence (why this piece)
- **Stack Overflow, "Fabric data factory copy data to ingest SharePoint files": 5,337 views,** one of the most-viewed `microsoft-fabric` questions.
- **r/MicrosoftFabric, "When will identity support become mature in Fabric?"** The team's service principal stopped working for SharePoint because SharePoint app-only access now needs certificate auth. Fabric connections don't take certificates, and support told them to use a personal account or workspace identity, neither of which scales.
- **r/MicrosoftFabric, "SharePoint shortcut: do I need read access to the entire site?"** A user with access to only one nested folder gets `400 TargetNotFound` creating a shortcut, while Dataflow Gen2 and the pipeline Copy activity work with the same connection.
- **r/MicrosoftFabric, "I wanted better accounting reports. Somehow I'm a data engineer now" (23 comments, 66 upvotes).** Finance users start from Excel files in SharePoint.
- **Fabric Community forum threads:** "Why OneDrive and SharePoint shortcuts matter", "SharePoint list mirroring", "SharePoint Lists PBI/Power Query error".

**Search angle:** "sharepoint to fabric lakehouse", "fabric sharepoint shortcut", "copy sharepoint files to lakehouse".

---

# Video: How to Get SharePoint Files Into a Fabric Lakehouse (4 Ways, 1 Right Answer for You)

- **Runtime target:** 13 min
- **Pillar:** 4 (code-along) + 2 (decision)
- **Target keywords:** fabric sharepoint, sharepoint to lakehouse, fabric shortcut sharepoint, onelake (8,100/mo, 0.99×), dataflow gen2 (140, 1.25×)
- **Title options:**
  1. SharePoint → Fabric Lakehouse: 4 Ways Compared (2026)
  2. The ONLY SharePoint to Fabric Guide You Need
  3. Stop Downloading Excel Files: SharePoint to Fabric in 10 Minutes
- **Thumbnail:** "SHAREPOINT → FABRIC". SharePoint logo, arrow, lakehouse icon, four numbered tiles below.
- **Verify before recording:**
  - Whether OneLake shortcuts to SharePoint/OneDrive are still in preview or now GA, and which auth types they accept.
  - Whether a shortcut needs site-level read or only folder-level read. The community reports `400 TargetNotFound` with folder-only access; test it.
  - Whether "Mirroring for SharePoint lists" exists and its status. It was seen only in a forum title.
  - Whether Copy job supports SharePoint as a source yet.
  - Current SharePoint app-only rules: Entra app-only with a certificate for SharePoint REST, and whether Microsoft Graph with `Sites.Selected` and a client secret still works.
  - UI labels: "New shortcut", "Get data", "Copy data assistant".

## Hook (0:00–0:30)
"Half the data in your company lives in Excel files on SharePoint. Getting it into Fabric should be easy. It isn't. Shortcuts throw 'target not found'. Service principals got blocked. Dataflows work, until the person who built them leaves. In the next 12 minutes I'll show you all four ways to get SharePoint files into a Fabric lakehouse. I'll show which one breaks and when, and the one I'd use in production."

## Script

### 0:30 The four options
"Here are your four options. [ON SCREEN: four tiles: Shortcut · Dataflow Gen2 · Pipeline Copy · Notebook + Graph]

One, a OneLake shortcut. No copy; the files show up in your lakehouse.
Two, Dataflow Gen2. Power Query, the thing you already know from Power BI.
Three, a pipeline with a Copy activity.
Four, a notebook that calls Microsoft Graph.

They differ in three ways. Do they copy data? Whose identity do they run as? And what happens when that identity goes away? Keep those three questions in mind."

### 1:30 Option 1: OneLake shortcut
"Open your lakehouse. Files, the three dots, New shortcut. [DEMO: Lakehouse → Files → … → New shortcut → SharePoint / OneDrive]

Paste the site URL, pick a connection, browse to the folder, create. [DEMO: select /Shared Documents/Finance/Monthly]

Now the files appear under Files. Nothing was copied. When someone saves a new version in SharePoint, you see it here.

Here's the catch people hit on the forums. If you only have access to one deep sub-folder, not the site, the shortcut can fail with 'Target path doesn't exist'. Dataflow and Copy work with the same account. If you see that error, it's permissions on the path, not your URL. Ask for read on the library, or use option two or three.

The other catch: a shortcut runs as the connection's identity. If that's your personal account and you leave, the shortcut breaks.

Use a shortcut when the files are small, you want zero copies, and the connection identity is a stable account."

### 3:30 Option 2: Dataflow Gen2
"New item, Dataflow Gen2, Get data, SharePoint folder. [DEMO: Get data → SharePoint folder → site URL → Organizational account]

Filter to the folder you want. Combine files. This is the classic Power Query combine. [DEMO: Filter Folder Path contains '/Finance/Monthly/' → Combine → Transform sample file]

Set the destination: your lakehouse, a new table called `finance_monthly`, update method Replace. [DEMO: Data destination → Lakehouse → finance_monthly → Replace]

Publish and schedule it.

This is the best option when the Excel files need shaping: headers on row three, merged cells, a sheet per month. Power Query is built for that.

Watch the cost. Dataflow Gen2 bills for the time the query engine runs, so a slow combine over hundreds of files costs more than you'd expect. We'll measure that in a separate video."

### 5:30 Option 3: Pipeline Copy activity
"New pipeline, Copy data. [DEMO: Pipeline → Copy data assistant]

Source: for SharePoint list data, use the SharePoint Online List connector. For files, pick the SharePoint file connector if your tenant shows one. If not, the usual pattern is the HTTP connector against the file's download URL, or a Dataflow.

Destination: Lakehouse, Files, folder `raw/sharepoint/`, binary copy. [DEMO: Destination → Lakehouse → Files → raw/sharepoint]

Pipelines are good at moving many files fast, with no transformation. Land the raw files, then shape them in a notebook. That's a clean bronze layer."

### 7:00 Option 4: Notebook + Microsoft Graph (the production answer)
"Now the one I'd use in production. The reason is identity.

Teams used a service principal with the SharePoint API. That path now wants certificates, and Fabric connections don't take certificates. The fix people landed on is Microsoft Graph with the `Sites.Selected` permission. The app gets access to just the sites you grant, not your whole tenant.

Setup, once:
1. Register an app in Entra ID. Add the Graph application permission `Sites.Selected`. Admin consent.
2. A SharePoint admin grants that app read on one site through Graph.
3. Put the client secret in Azure Key Vault.

[ON SCREEN: the three steps]

Now the notebook. [DEMO: New notebook, attach lakehouse]"

```python
import requests, msal, os
from notebookutils import mssparkutils  # notebookutils also works in newer runtimes

TENANT  = "<tenant-id>"
CLIENT  = "<app-client-id>"
SECRET  = mssparkutils.credentials.getSecret("https://<your-vault>.vault.azure.net/", "sp-graph-secret")
HOST    = "contoso.sharepoint.com"
SITE    = "sites/Finance"
FOLDER  = "Monthly"            # path inside the default document library
TARGET  = "/lakehouse/default/Files/raw/sharepoint/monthly"

app = msal.ConfidentialClientApplication(CLIENT, authority=f"https://login.microsoftonline.com/{TENANT}", client_credential=SECRET)
token = app.acquire_token_for_client(scopes=["https://graph.microsoft.com/.default"])["access_token"]
H = {"Authorization": f"Bearer {token}"}

site_id = requests.get(f"https://graph.microsoft.com/v1.0/sites/{HOST}:/{SITE}", headers=H).json()["id"]
items = requests.get(f"https://graph.microsoft.com/v1.0/sites/{site_id}/drive/root:/{FOLDER}:/children", headers=H).json()["value"]

os.makedirs(TARGET, exist_ok=True)
for it in items:
    if "file" not in it:
        continue
    data = requests.get(it["@microsoft.graph.downloadUrl"]).content
    with open(f"{TARGET}/{it['name']}", "wb") as f:
        f.write(data)
    print("copied", it["name"], it["size"])
```

"Run it. [DEMO: run; files appear under Files/raw/sharepoint/monthly]

Now turn the Excel files into a Delta table:"

```python
import pandas as pd, glob
frames = []
for path in glob.glob(f"{TARGET}/*.xlsx"):
    df = pd.read_excel(path, sheet_name=0, header=2)   # headers on row 3
    df["source_file"] = os.path.basename(path)
    frames.append(df)
spark.createDataFrame(pd.concat(frames)).write.mode("overwrite").saveAsTable("bronze_finance_monthly")
```

"This identity doesn't leave the company, it's scoped to one site, and the secret lives in Key Vault. It handles paging if you add `@odata.nextLink`, and you can make it incremental by checking `lastModifiedDateTime`."

### 10:30 Which one should you pick?
[ON SCREEN: decision table]

| You need | Pick |
|---|---|
| Zero copies, a few files, a stable account | Shortcut |
| Messy Excel that needs Power Query shaping | Dataflow Gen2 |
| Many files, no shaping, land raw | Pipeline Copy |
| Production, no personal accounts, scoped access | Notebook + Graph (Sites.Selected) |

"One more thing about workspace identity. It's tempting because there are no secrets, but anyone with Contributor in that workspace can use whatever it can reach. For SharePoint with sensitive finance files, I'd rather have a site-scoped app."

### 11:45 Outro
"If you're the accountant who became a data engineer by accident, start with the Dataflow. Graduate to the notebook when it matters. The code is in the description. Next, I'll test what Dataflow Gen2, Copy job and pipelines actually cost on the same data. Subscribe to [CHANNEL] so you see it."

## Chapters
0:00 SharePoint data is everywhere
0:30 The 4 options
1:30 OneLake shortcut (and the TargetNotFound error)
3:30 Dataflow Gen2
5:30 Pipeline Copy activity
7:00 Notebook + Microsoft Graph (production)
10:30 Which one to pick
11:45 Outro

## Description + tags
Get SharePoint files into a Microsoft Fabric lakehouse four ways: OneLake shortcut, Dataflow Gen2, pipeline Copy, and a notebook with Microsoft Graph.
Includes the fix for "Target path doesn't exist" and a service-principal setup that doesn't break when people leave.

Code: [link]
Tags: microsoft fabric, sharepoint, lakehouse, onelake shortcut, dataflow gen2, fabric pipeline, microsoft graph, sites.selected, fabric notebook, excel to fabric

## Shorts
**Short 1: "Target path doesn't exist"** (35 s)
"Your SharePoint shortcut in Fabric says 'target path doesn't exist'? But you can open the folder in the browser? [TEXT: 400 TargetNotFound] It's usually permissions on the path. With access to only a nested sub-folder, shortcuts can fail where Dataflows and Copy work fine. Get read on the library, or use a Dataflow. Full guide on the channel."

**Short 2: "Stop using your own account"** (40 s)
"If your Fabric pipeline reads SharePoint as you, it dies the day you leave. [TEXT: Your account = single point of failure] Use an Entra app with Microsoft Graph and Sites.Selected. It gets read on one site, nothing else, and the secret goes in Key Vault. Ten lines of Python. Link in comments."

## LinkedIn post
SharePoint → Fabric has four paths, and they fail in different ways:

Shortcut: no copy, but runs as one identity and is picky about folder permissions.
Dataflow Gen2: best for messy Excel; watch the CU bill.
Pipeline Copy: fast raw landing.
Notebook + Graph (Sites.Selected): scoped, no personal accounts, secret in Key Vault.

My rule: prototype with a Dataflow, run production on a site-scoped app.

The pattern I keep seeing: a pipeline that runs as the analyst who built it. When they leave, finance reporting stops.

What's your SharePoint ingestion pattern?

[diagram: 4 lanes → lakehouse]

---

# Blog: How to Load SharePoint Files Into a Microsoft Fabric Lakehouse (2026)

SharePoint is where a lot of business data lives: monthly Excel workbooks, CSV exports, lists maintained by hand. Getting it into a Microsoft Fabric lakehouse is one of the most-asked Fabric questions. The Stack Overflow question on copying SharePoint files has over 5,000 views. There are four ways to do it, and the right one depends on two questions: do you need a copy, and whose identity runs the job?

## Option 1: OneLake shortcut to SharePoint
A shortcut makes SharePoint files appear under your lakehouse's Files without copying them. Create it from the lakehouse: Files → New shortcut → SharePoint/OneDrive, then pick the site and folder.

**Good for:** small sets of files you want to see live, with no copies.
**Watch out for:**
- **Permissions.** Users with read access to only a nested sub-folder have reported `400 TargetNotFound` when creating the shortcut, even though Dataflow Gen2 and the Copy activity work with the same connection. Read access on the library usually solves it.
- **Identity.** The shortcut uses its connection's identity. If that's a personal account, it breaks when the person leaves.

## Option 2: Dataflow Gen2 with the SharePoint folder connector
Dataflow Gen2 is Power Query in Fabric. Use Get data → SharePoint folder, filter to your folder, combine files, and write to a lakehouse table.

**Good for:** Excel files that need shaping (headers not on row one, a sheet per month, merged cells).
**Watch out for:** cost. Dataflow Gen2 is billed for engine run time, and combining hundreds of files can be expensive. Test with your real file count.

## Option 3: Pipeline Copy activity
A Data Factory pipeline can copy files or list items into the lakehouse. Use the SharePoint Online List connector for lists. For files, use the file connector your tenant offers, or the HTTP pattern.

**Good for:** landing many raw files quickly as a bronze layer, then transforming in a notebook.

## Option 4: Notebook + Microsoft Graph (recommended for production)
Teams that used a service principal with the SharePoint API found that app-only SharePoint access now expects certificate authentication, which Fabric connections don't support. The workable path is Microsoft Graph with the `Sites.Selected` application permission:

1. **Register an Entra app** with Graph `Sites.Selected` and admin consent.
2. **Have a SharePoint admin grant the app read on one site.**
3. **Store the client secret in Azure Key Vault.**
4. **In a Fabric notebook,** get a token with MSAL, look up the site ID, list the folder's children, download each file into `Files/`, then read the Excel files with pandas and save them as a Delta table.

**Why it's the production choice:** the identity is not a person, access is limited to one site, and secrets stay in Key Vault. Add paging and a `lastModifiedDateTime` filter for incremental loads.

## A note on workspace identity
Workspace identity removes secrets, but anyone with Contributor rights in the workspace can use whatever it can reach. For sensitive SharePoint sites, a site-scoped app is the tighter boundary.

## Which should you choose?
| Need | Choice |
|---|---|
| Live view, no copy | Shortcut |
| Messy Excel, low-code | Dataflow Gen2 |
| Bulk raw landing | Pipeline Copy |
| Production, no personal accounts | Notebook + Graph |

**Start with a Dataflow to prove the report. Move to the notebook pattern before the person who built it changes jobs.** Check current docs for shortcut status and SharePoint auth rules; both have changed during 2025–2026.
