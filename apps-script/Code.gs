/**
 * ARCAVUM ∅RIGIN — Drive > GitHub MEDIA
 * This code runs in the owner's private Google Apps Script project.
 * NEVER enter a GitHub token in this source file.
 *
 * Required Script Properties:
 * ARCAVUM_QUEUE_FOLDER_ID — private staging folder in Google Drive
 * ARCAVUM_GITHUB_TOKEN   — fine-grained PAT scoped ONLY to ARCAVUM-ORIGIN-MEDIA,
 *                          with Contents: Read and write
 */
var ARCAVUM_SYNC = Object.freeze({
  githubOwner: "Diegodanna07",
  githubRepo: "ARCAVUM-ORIGIN-MEDIA",
  targetBranch: "main",
  targetDir: "assets/instagram",
  maxFileBytes: 10 * 1024 * 1024,
  maxTransfersPerRun: 2
});

function arcavumPreviewQueue() {
  var folderId = arcavumProperty_("ARCAVUM_QUEUE_FOLDER_ID");
  var files = DriveApp.getFolderById(folderId).getFiles();
  var n = 0;
  while (files.hasNext()) {
    var file = files.next();
    console.log("QUEUE: " + file.getName() +
      " | " + file.getMimeType() + " | " + file.getSize() + " bytes");
    n++;
    if (n >= 30) break;
  }
  console.log("Previewed " + n + " file(s); no transfers.");
}

/**
 * Uploads ONLY files physically present in the private queue folder.
 * No source file is deleted, shared publicly on Drive, or modified.
 * Existing remote paths are NOT overwritten.
 */
function arcavumSyncApprovedMedia() {
  var props = PropertiesService.getScriptProperties();
  var folderId = arcavumProperty_("ARCAVUM_QUEUE_FOLDER_ID");
  var token = arcavumProperty_("ARCAVUM_GITHUB_TOKEN");
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) {
    console.log("Another sync is running; skipping.");
    return;
  }
  try {
    var files = DriveApp.getFolderById(folderId).getFiles();
    var uploaded = 0;
    while (files.hasNext() && uploaded < ARCAVUM_SYNC.maxTransfersPerRun) {
      var file = files.next();
      var mime = file.getMimeType();
      var extension = mime === "image/png" ? ".png" :
                      mime === "image/jpeg" ? ".jpg" : null;
      if (!extension) {
        console.warn("Skipped unsupported media type: " + file.getName());
        continue;
      }
      if (file.getSize() <= 0 || file.getSize() > ARCAVUM_SYNC.maxFileBytes) {
        console.warn("Skipped invalid/oversized media: " + file.getName());
        continue;
      }
      var flag = "ARCAVUM_UPLOADED_" + file.getId();
      if (props.getProperty(flag)) continue;
      var name = arcavumSafeFilename_(file.getName(), extension);
      var path = ARCAVUM_SYNC.targetDir + "/" + name;
      var existing = arcavumGithub_(path, token, "get");
      if (existing.status === 200) {
        console.warn("Destination exists, will not overwrite: " + path);
        continue;
      }
      if (existing.status !== 404) {
        throw new Error("GitHub lookup failed (" + existing.status + "): " + path);
      }

      // Base64 is produced inside Google's execution environment, not ChatGPT.
      var b64 = Utilities.base64Encode(file.getBlob().getBytes());
      var payload = {
        message: "media: publish approved artwork " + name,
        content: b64,
        branch: ARCAVUM_SYNC.targetBranch
      };
      var sent = arcavumGithub_(path, token, "put", payload);
      if (sent.status !== 201) {
        throw new Error("GitHub upload failed (" + sent.status + "): " + path);
      }
      var result = JSON.parse(sent.body);
      var url = result.content && result.content.html_url;
      props.setProperty(flag, path);
      uploaded++;
      console.log("UPLOADED " + path + " | " + (url || "GitHub confirmed"));
    }
    console.log("Completed: " + uploaded + " upload(s).");
  } finally {
    lock.releaseLock();
  }
}

/** Run ONCE after adding the two Script Properties and authorizing the script. */
function arcavumInstallTrigger() {
  arcavumProperty_("ARCAVUM_QUEUE_FOLDER_ID");
  arcavumProperty_("ARCAVUM_GITHUB_TOKEN");
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === "arcavumSyncApprovedMedia") {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }
  ScriptApp.newTrigger("arcavumSyncApprovedMedia")
    .timeBased().everyMinutes(15).create();
  console.log("Installed one 15-minute private Drive-to-GitHub trigger.");
}

function arcavumProperty_(key) {
  var value = PropertiesService.getScriptProperties().getProperty(key);
  if (!value) throw new Error("Missing Script Property: " + key);
  return value.trim();
}

function arcavumSafeFilename_(originalName, extension) {
  var stem = originalName.replace(/\.[^.]+$/, "");
  if (typeof stem.normalize === "function") {
    stem = stem.normalize("NFKD");
  }
  stem = stem.replace(/[^A-Za-z0-9._-]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^\.+/, "")
    .slice(0, 90);
  if (!stem || stem === "." || stem === "..") {
    throw new Error("Invalid filename");
  }
  return stem + extension;
}

function arcavumGithub_(path, token, method, data) {
  var encoded = path.split("/").map(encodeURIComponent).join("/");
  var url = "https://api.github.com/repos/" +
    ARCAVUM_SYNC.githubOwner + "/" + ARCAVUM_SYNC.githubRepo +
    "/contents/" + encoded;
  var opts = {
    method: method,
    muteHttpExceptions: true,
    headers: {
      "Authorization": "Bearer " + token,
      "Accept": "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28"
    }
  };
  if (data) {
    opts.contentType = "application/json";
    opts.payload = JSON.stringify(data);
  }
  var response = UrlFetchApp.fetch(url, opts);
  return {
    status: response.getResponseCode(),
    body: response.getContentText()
  };
}
