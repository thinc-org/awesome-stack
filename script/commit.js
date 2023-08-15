import fs from "fs";

function buildMDString(data) {
    const { package_name, tags, recommend_by_user, recommend_from_server, package_url } = data;
    const tagsString = tags.map((tag) => `  - ${tag}`).join("\n");

    return `---\n
title: ${package_name} \n
tag: \n
${tagsString} \n
by: ${recommend_by_user} \n
from: ${recommend_from_server} \n
---\n
\n
${package_url} \n
`;
}

const raw = process.env.payload_data;

const data = JSON.parse(raw);

console.log("data", data);

const stored = fs.readFileSync("./data.json", "utf-8");

const storedData = JSON.parse(stored);

// add new package only if it's not exist
if (data?.package_url) {
    storedData.push(data);

    fs.writeFileSync("./data.json", JSON.stringify(storedData));
}

// build all md files every times
for (const item of storedData) {
    const mdString = buildMDString(item);

    fs.writeFileSync(`./src/pages/things/${item.package_name}.md`, mdString);
}
