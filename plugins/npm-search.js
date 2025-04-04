const axios = require("axios");
const { cmd } = require("../command");

cmd({
  pattern: "npm",
  desc: "Search for a package on npm.",
  react: '📦',
  category: "convert",
  filename: __filename,
  use: ".npm <package-name>"
}, async (conn, mek, msg, { from, args, reply }) => {  // Removed 'pushname'
  try {
    // Check if a package name is provided
    if (!args.length) {
      return reply("❌ Please provide the name of the npm package you want to search for.\n\nExample: *.npm express*");
    }

    const packageName = args.join(" ");
    const apiUrl = `https://registry.npmjs.org/${encodeURIComponent(packageName)}`;

    // Fetch package details from npm registry
    const response = await axios.get(apiUrl);
    if (response.status !== 200) {
      return reply("❌ Package not found or an error occurred.");
    }

    const packageData = response.data;
    const latestVersion = packageData["dist-tags"].latest;
    const description = packageData.description || "No description available.";
    const npmUrl = `https://www.npmjs.com/package/${packageName}`;
    const license = packageData.license || "Unknown";
    const repository = packageData.repository?.url ? packageData.repository.url.replace(/^git\+/, '') : "Not available";

    // Get user's name
    const userName = msg.pushName || "User";  // Fixed pushname issue

    // Create the response message
    const message = `
🔍 *NPM PACKAGE SEARCH*

👤 *Hello, ${userName}!*
📦 *Package:* ${packageName}
📄 *Description:* ${description}
⏸️ *Last Version:* ${latestVersion}
🪪 *License:* ${license}
🪩 *Repository:* ${repository}
🔗 *NPM URL:* ${npmUrl}

> *Powered by CHAMA-MD 🚀*
`;

    // Send the message
    await conn.sendMessage(from, { text: message }, { quoted: mek });

  } catch (error) {
    console.error("Error:", error);
    reply("❌ An error occurred while fetching the NPM package details. Please try again later.");
  }
});
