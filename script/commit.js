import fs from "fs";

function buildMDString(data) {
    const { package_name, tags, desc, by_user, from_server, package_url } = data;
    const tagsString = tags.map((tag) => `  - ${tag}`).join("\n");

    return `---\n
title: ${package_name} \n
tag: \n
${tagsString} \n
desc: ${desc ?? ""} \n
by: ${by_user} \n
from: ${from_server} \n
---\n
\n
${package_url} \n
`;
}

function cmp(f) {
    return (a, b) => {
        if (f(a) < f(b)) {
            return -1;
        }
        if (f(a) > f(b)) {
            return 1;
        }
        return 0;
    };
}

const raw = process.env.payload_data;

const data = raw ? JSON.parse(raw) : null;

console.log("data", data);

const stored = fs.readFileSync("./data.json", "utf-8");

let storedData = JSON.parse(stored);

// add new package only if it's not exist
if (data?.package_url) {
    storedData.push(data);
}

const unique = new Map();
for (const item of storedData) {
    unique.set(item.package_url, item);
}

storedData = Array.from(unique.values());

fs.writeFileSync("./data.json", JSON.stringify(storedData));

storedData.sort(cmp((v) => v.package_name.toLowerCase()));

// build all md files every times
for (const item of storedData) {
    const mdString = buildMDString(item);

    fs.writeFileSync(`./src/pages/things/${item.package_name.replace("/", "-")}.md`, mdString);
}

const tagMap = new Map();

for (const item of storedData) {
    for (const tag of item.tags) {
        if (tagMap.has(tag)) {
            const current = tagMap.get(tag);
            current.push(item);
        } else {
            tagMap.set(tag, [item]);
        }
    }
}

let mdString = fs.readFileSync("./script/template/readme-header.md", "utf-8");

const tagGroup = Array.from(tagMap).sort(cmp((v) => v[0].toLowerCase()));

// add table of contents
mdString += `## Contents\n\n`;

tagGroup.forEach(([tag], index) => {
    const capitalizedTag = tag[0].toUpperCase() + tag.slice(1);
    mdString += `${index + 1}. [${capitalizedTag}](#${tag.toLowerCase()})\n`;
});

// add packages list
for (let [tag, items] of tagGroup) {
    tag = tag[0].toUpperCase() + tag.slice(1);
    mdString += `## ${tag}\n\n`;

    for (const item of items) {
        mdString += `- [${item.package_name}](${item.package_url}) - ${item.desc}\n`;
    }
}

fs.writeFileSync("./README.md", mdString);
