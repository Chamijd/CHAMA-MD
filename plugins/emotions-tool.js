const { cmd } = require('../command');

async function dynamicEmojiEdit(conn, from, startText, emojiSequence, reply) {
    try {
        const loadingMessage = await conn.sendMessage(from, { text: startText });

        for (const emoji of emojiSequence) {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Delay for 1 second
            await conn.relayMessage(
                from,
                {
                    protocolMessage: {
                        key: loadingMessage.key,
                        type: 14,
                        editedMessage: {
                            conversation: emoji,
                        },
                    },
                },
                {}
            );
        }
    } catch (e) {
        console.error(e);
        reply(`❌ *Error!* ${e.message}`);
    }
}

cmd({
    pattern: "happy",
    desc: "Displays a dynamic edit msg for fun.",
    category: "tools",
    react: "😂",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    const emojis = ["😃", "😄", "😁", "😊", "😎", "🥳", "😸", "😹", "🌞", "🌈"];
    await dynamicEmojiEdit(conn, from, "😂", emojis, reply);
});

cmd({
    pattern: "heart",
    desc: "Displays a dynamic edit msg for fun.",
    category: "tools",
    react: "❤️",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    const emojis = ["💖", "💗", "💕", "🩷", "💛", "💚", "🩵", "💙", "💜", "❤️"];
    await dynamicEmojiEdit(conn, from, "🖤", emojis, reply);
});

cmd({
    pattern: "angry",
    desc: "Displays a dynamic edit msg for fun.",
    category: "tools",
    react: "🤡",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    const emojis = ["😡", "😠", "🤬", "😤", "😾"];
    await dynamicEmojiEdit(conn, from, "👽", emojis, reply);
});

cmd({
    pattern: "sad",
    desc: "Displays a dynamic edit msg for fun.",
    category: "tools",
    react: "😶",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    const emojis = ["🥺", "😟", "😕", "😖", "😫", "🙁", "😩", "😥", "😓", "😭"];
    await dynamicEmojiEdit(conn, from, "😔", emojis, reply);
});

cmd({
    pattern: "shy",
    desc: "Displays a dynamic edit msg for fun.",
    category: "tools",
    react: "🧐",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    const emojis = ["😳", "😊", "😶", "🙈", "🙊"];
    await dynamicEmojiEdit(conn, from, "🧐", emojis, reply);
});

cmd({
    pattern: "moon",
    desc: "Displays a dynamic edit msg for fun.",
    category: "tools",
    react: "🌚",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    const emojis = ["🌗", "🌘", "🌑", "🌒", "🌓", "🌔", "🌕", "🌖", "🌝🌚"];
    await dynamicEmojiEdit(conn, from, "🌝", emojis, reply);
});

cmd({
    pattern: "confused",
    desc: "Displays a dynamic edit msg for fun.",
    category: "tools",
    react: "🤔",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    const emojis = ["😕", "😟", "😵", "🤔", "😖", "😦", "🤷‍♂️", "🤷‍♀️"];
    await dynamicEmojiEdit(conn, from, "🤔", emojis, reply);
});

cmd({
    pattern: "hot",
    desc: "Displays a dynamic edit msg for fun.",
    category: "tools",
    react: "💋",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    const emojis = ["🥵", "❤️", "💋", "😫", "🤤", "😋", "🙊", "😻", "🙈", "👅", "👄"];
    await dynamicEmojiEdit(conn, from, "💋", emojis, reply);
});
