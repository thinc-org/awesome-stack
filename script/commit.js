import fs from "fs";

function buildMDString(data) {
    const { title, tags, recommend_by_user, recommend_from_server, package_url } = data;
    const tagsString = tags.map((tag) => `- ${tag}`).join("\n");

    return `---\n\r
    title: ${title} \n\r
    tag: \n\r
    ${tagsString} \n\r
    by: ${recommend_by_user} \n\r
    from: ${recommend_from_server} \n\r
    ---\n\r
    \n\r
    ${package_url} \n\r
    `;
}

const raw = process.env.payload_data;

const data = JSON.parse(raw);

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

    fs.writeFileSync(`./src/pages/thins/${item.title}.md`, mdString);
}
