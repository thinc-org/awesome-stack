import fs from "fs";

function buildMDString(data) {
    const { package_name, tags, by_user, from_server, package_url } = data;
    const tagsString = tags.map((tag) => `  - ${tag}`).join("\n");

    return `---\n
title: ${package_name} \n
tag: \n
${tagsString} \n
by: ${by_user} \n
from: ${from_server} \n
---\n
\n
${package_url} \n
`;
}

async function getDesc(url) {
    const res = await fetch(url);
    const html = await res.text();
    const descriptionMatch = html.match(/<meta name="description" content="([^"]+?)"(.?)>/);

    const description = descriptionMatch ? descriptionMatch[1] : "";
    return description;
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

const storedData = JSON.parse(stored);

// add new package only if it's not exist
if (data?.package_url) {
    storedData.push(data);

    fs.writeFileSync("./data.json", JSON.stringify(storedData));
}

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
console.log("tagGroup", tagGroup);

for (let [tag, items] of tagGroup) {
    tag = tag[0].toUpperCase() + tag.slice(1);
    mdString += `## ${tag}\n\n`;

    for (const item of items) {
        const desc = await getDesc(item.package_url);

        mdString += `- [${item.package_name}](${item.package_url})\n`;
    }
}

fs.writeFileSync("./README.md", mdString);
