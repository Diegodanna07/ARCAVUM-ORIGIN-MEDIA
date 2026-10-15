# ARCAVUM-ORIGIN-MEDIA

Official **public** media assets for **ARCAVUM ∅RIGIN**, an original historical action-adventure game in development.

© ARCAVUM ∅RIGIN. All rights reserved.

## Media publishing pipeline

**Approved public-release copy on Google Drive → private Google Apps Script → this public repository → Metricool → Instagram.**

- Images live in `assets/instagram/`. These are publicly accessible; do not upload unreleased or confidential work.
- Original approved master files remain on private Google Drive. Only explicitly approved **public-release copies** should be placed in the private outbound queue.
- Media sync runs using Google Apps Script on a timer (~15 minutes). No media binary is transferred through a ChatGPT conversation.
- The reference script and its detailed operating guide live at [apps-script/Code.gs](apps-script/Code.gs) and [apps-script/README.md](apps-script/README.md).
- The Apps Script project in the owner's account is separate from GitHub: changing repository files does not automatically redeploy or alter the running script.
- Uploading here **does not publish on Instagram**. Any social post, schedule or publication requires separate approval.

## Operational verification — October 2026

- `Ten Lives` approved concept artwork was uploaded to GitHub and retained at `assets/instagram/C001_01_TEN_LIVES_APPROVATO.png`.
- A separate image copy transferred from Drive through Google Apps Script matched the reference blob and was subsequently removed from public GitHub after testing.
- Five 15-minute trigger executions were reported completed.
- A real test post was published through Metricool and visually verified on Instagram, then deleted by the owner.

**Do not place personal access tokens, credentials, client information or private Drive files in this repository.**
