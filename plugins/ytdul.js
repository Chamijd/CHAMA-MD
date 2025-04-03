const config = require('../config');
const { cmd } = require('../command');
const { ytsearch } = require('@dark-yasiya/yt-dl.js');
const axios = require('axios');

// Helper functions
function convertYouTubeLink(query) {
    if (!query.includes('youtube.com') && !query.includes('youtu.be')) {
        return query;
    }
    return query;
}

async function fetchVideoInfo(url) {
    try {
        const response = await axios.get(`https://apis.davidcyriltech.my.id/download/ytinfo?url=${encodeURIComponent(url)}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching video info:', error);
        throw error;
    }
}

async function downloadVideo(url, quality) {
    try {
        const response = await axios.get(`https://apis.davidcyriltech.my.id/download/ytmp4?url=${encodeURIComponent(url)}&quality=${quality}`);
        return response.data;
    } catch (error) {
        console.error('Error downloading video:', error);
        throw error;
    }
}

async function downloadAudio(url) {
    try {
        const response = await axios.get(`https://apis.davidcyriltech.my.id/youtube/mp3?url=${encodeURIComponent(url)}`);
        return response.data;
    } catch (error) {
        console.error('Error downloading audio:', error);
        throw error;
    }
}

// Video download command
cmd({ 
    pattern: "mp4", 
    alias: ["video"], 
    react: "🎥", 
    desc: "Download YouTube video", 
    category: "main", 
    use: '.mp4 <YouTube URL or Name>', 
    filename: __filename 
}, async (conn, mek, m, { from, quoted, q, reply }) => { 
    try { 
        if (!q) return await reply("Please provide a YouTube URL or video name.");
        
        q = convertYouTubeLink(q);
        const yt = await ytsearch(q);
        if (yt.results.length < 1) return reply("No results found!");
        
        const yts = yt.results[0];
        const infoMsg = `
🎥 *Video Found!*

📌 *Title:* ${yts.title}
⏱️ *Duration:* ${yts.timestamp}
👁️ *Views:* ${yts.views}
👤 *Author:* ${yts.author.name}
🔗 *URL:* ${yts.url}

Please reply with your preferred quality:
1. 360p
2. 480p 
3. 720p
4. 1080p

Or reply with format:
1.1 Video (360p)
1.2 Video (480p)
1.3 Video (720p)
1.4 Video (1080p)
2.1 Document (360p)
2.2 Document (480p)
2.3 Document (720p)
2.4 Document (1080p)
`;

        const sentMsg = await conn.sendMessage(from, { 
            image: { url: yts.thumbnail },
            caption: infoMsg
        }, { quoted: mek });

        conn.addReplyTracker(sentMsg.key.id, async (replyMek, messageType) => {
            const qualityMap = {
                '1': '360', '1.1': '360', '2.1': '360',
                '2': '480', '1.2': '480', '2.2': '480',
                '3': '720', '1.3': '720', '2.3': '720',
                '4': '1080', '1.4': '1080', '2.4': '1080'
            };

            const quality = qualityMap[messageType];
            if (!quality) {
                await conn.sendMessage(from, { react: { text: '❌', key: replyMek.key } });
                return reply("Invalid option. Please choose from the given options.");
            }

            await conn.sendMessage(from, { react: { text: '⬇️', key: replyMek.key } });

            try {
                const data = await downloadVideo(yts.url, quality);
                
                if (!data.success || !data.result?.download_url) {
                    throw new Error("Failed to fetch video");
                }

                await conn.sendMessage(from, { react: { text: '⬆️', key: replyMek.key } });

                const isDocument = messageType.startsWith('2') || messageType.includes('.2');
                
                if (isDocument) {
                    await conn.sendMessage(from, { 
                        document: { url: data.result.download_url }, 
                        mimetype: "video/mp4", 
                        fileName: `${yts.title}_${quality}p.mp4`,
                        caption: `📹 ${yts.title} (${quality}p)`
                    }, { quoted: replyMek });
                } else {
                    await conn.sendMessage(from, { 
                        video: { url: data.result.download_url }, 
                        mimetype: "video/mp4",
                        caption: `📹 ${yts.title} (${quality}p)`
                    }, { quoted: replyMek });
                }

                await conn.sendMessage(from, { react: { text: '✅', key: replyMek.key } });
            } catch (e) {
                console.error(e);
                await conn.sendMessage(from, { react: { text: '❌', key: replyMek.key } });
                reply("Failed to download video. Please try again later.");
            }
        });

    } catch (e) {
        console.error(e);
        reply("An error occurred. Please try again later.");
    }
});

// Audio download command
cmd({ 
    pattern: "song", 
    alias: ["ytdl3", "play"], 
    react: "🎶", 
    desc: "Download YouTube song", 
    category: "main", 
    use: '.song <YouTube URL or Name>', 
    filename: __filename 
}, async (conn, mek, m, { from, quoted, q, reply }) => { 
    try { 
        if (!q) return await reply("Please provide a YouTube URL or song name.");
        
        q = convertYouTubeLink(q);
        const yt = await ytsearch(q);
        if (yt.results.length < 1) return reply("No results found!");
        
        const yts = yt.results[0];
        const infoMsg = `
🎵 *Song Found!*

📌 *Title:* ${yts.title}
⏱️ *Duration:* ${yts.timestamp}
👁️ *Views:* ${yts.views}
👤 *Author:* ${yts.author.name}
🔗 *URL:* ${yts.url}

Please reply with your preferred format:
1. Audio File
2. Document File
3. Voice Note
`;

        const sentMsg = await conn.sendMessage(from, { 
            image: { url: yts.thumbnail },
            caption: infoMsg
        }, { quoted: mek });

        conn.addReplyTracker(sentMsg.key.id, async (replyMek, messageType) => {
            if (!['1', '2', '3'].includes(messageType)) {
                await conn.sendMessage(from, { react: { text: '❌', key: replyMek.key } });
                return reply("Invalid option. Please choose 1, 2, or 3.");
            }

            await conn.sendMessage(from, { react: { text: '⬇️', key: replyMek.key } });

            try {
                const data = await downloadAudio(yts.url);
                
                if (!data.success || !data.result?.downloadUrl) {
                    throw new Error("Failed to fetch audio");
                }

                await conn.sendMessage(from, { react: { text: '⬆️', key: replyMek.key } });

                switch(messageType) {
                    case '1': // Audio file
                        await conn.sendMessage(from, { 
                            audio: { url: data.result.downloadUrl }, 
                            mimetype: "audio/mpeg"
                        }, { quoted: replyMek });
                        break;
                    case '2': // Document
                        await conn.sendMessage(from, { 
                            document: { url: data.result.downloadUrl }, 
                            mimetype: "audio/mpeg",
                            fileName: `${yts.title}.mp3`,
                            caption: `🎵 ${yts.title}`
                        }, { quoted: replyMek });
                        break;
                    case '3': // Voice note
                        await conn.sendMessage(from, { 
                            audio: { url: data.result.downloadUrl }, 
                            mimetype: "audio/mpeg",
                            ptt: true
                        }, { quoted: replyMek });
                        break;
                }

                await conn.sendMessage(from, { react: { text: '✅', key: replyMek.key } });
            } catch (e) {
                console.error(e);
                await conn.sendMessage(from, { react: { text: '❌', key: replyMek.key } });
                reply("Failed to download song. Please try again later.");
            }
        });

    } catch (e) {
        console.error(e);
        reply("An error occurred. Please try again later.");
    }
});
