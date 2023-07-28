export const PRODUCT_NAME_SUFFIX_FOR_STAGE = {
    // keys are the `environment` field of files in phoenix repo: config.json, brackets.config.dist.json
    // and brackets.config.staging.json. The product name suffix corresponding to each stage are values.
    dev : "Experimental Build",
    stage: "Pre-release",
    production: "" // has no suffix
};

export const UPDATE_NOTIFICATION_LATEST_JSON_FILE_PATH = {
    // do not change any of these names unless you want to nuke the updater for all the whole installation base!!
    // or you know what you are doing.
    dev: "docs/tauri/update-latest-experimental-build.json",
    stage: "docs/tauri/update-latest-pre-release.json",
    production: "docs/tauri/update-latest-stable-prod.json"
};