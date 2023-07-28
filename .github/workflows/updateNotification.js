import fs from 'fs';
import {PRODUCT_NAME_SUFFIX_FOR_STAGE, UPDATE_NOTIFICATION_LATEST_JSON_FILE_PATH} from "../../src-build/constants.js";

function _makePrefix(name) {
    return name.trim().split(" ").join(".");
}

// these are the prefix for names of assets in the release created by tauri GitHub action.
// Eg. Phoenix.Code.Experimental.Build_3.2.2_aarch64.dmg, Phoenix.Code.Pre-release_3.2.2_x64-setup.exe, etc..
// note that not all platform bin names follow these convention, so we just check if any of the assets follow the pattern
const DEV_STAGE_PRODUCT_NAME_PREFIX = "Phoenix.Code." + _makePrefix(PRODUCT_NAME_SUFFIX_FOR_STAGE.dev);
const PRE_RELEASE_STAGE_PRODUCT_NAME_PREFIX = "Phoenix.Code." + _makePrefix(PRODUCT_NAME_SUFFIX_FOR_STAGE.stage);
//"": "production" has no suffix

// identify if the release is staging/pre-release/prod, then based on that get the pathname of the update json file
function _identifyUpdateJSONPath(releaseAssets) {
    for(let releaseAsset of releaseAssets) {
        if(releaseAsset.name.startsWith(DEV_STAGE_PRODUCT_NAME_PREFIX)){
            return UPDATE_NOTIFICATION_LATEST_JSON_FILE_PATH.dev;
        }
        else if(releaseAsset.name.startsWith(PRE_RELEASE_STAGE_PRODUCT_NAME_PREFIX)){
            return UPDATE_NOTIFICATION_LATEST_JSON_FILE_PATH.stage;
        }
    }
    return UPDATE_NOTIFICATION_LATEST_JSON_FILE_PATH.production;
}

export default async function printStuff({github, context, githubWorkspaceRoot}) {
    console.log(github, context, "yo");
    const fullRepoName = context.payload.repository.full_name;
    console.log("repository full name: ", fullRepoName); // Eg: 'phcode-dev/phoenix-desktop'
    const owner = fullRepoName.split("/")[0], repo = fullRepoName.split("/")[1];
    console.log("repository owner, repo: ", owner, repo); // Eg: 'phcode-dev/phoenix-desktop'
    const releaseTag = context.payload.release.tag_name;
    console.log("Release Tag name: ", releaseTag);
    const isPreRelease = context.payload.release.prerelease;
    console.log("Release isPreRelease: ", isPreRelease);
    const releaseNotes = context.payload.release.body;
    console.log("Release Notes: ", releaseNotes);
    const releaseID = context.payload.release.id;
    const releaseAssets = (await github.rest.repos.listReleaseAssets({
        owner,
        repo,
        release_id: releaseID,
    })).data;
    console.log("Release assets: ", releaseAssets);

    // you can call additional github apis using await github.rest.* apis
    // See https://octokit.github.io/rest.js/v19#repos-get-release-by-tag for more availableapis

    // write to the docs folder here. all changes made here to the docs folder will be part of the pull request
    console.log("Updating tauri update JSON file: ", _identifyUpdateJSONPath(releaseAssets));
    fs.writeFileSync(`${githubWorkspaceRoot}/${_identifyUpdateJSONPath(releaseAssets)}`, JSON.stringify(releaseAssets, null, 2));
}