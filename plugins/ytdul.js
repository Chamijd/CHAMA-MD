const config = require('../config');
const { cmd } = require('../command');
const axios = require('axios');
const yts = require('yt-search');

// Helper functions
function isValidYouTubeUrl(url) {
    return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+/.test(url);
}

// Video download with reply tracking
cmd({ 
    pattern: "mp4", 
    alias: ["video"], 
    react: "🎥", 
    desc: "Download YouTube video with quality options", 
    category: "download", 
    use: '.mp4 <YouTube URL or search term>', 
    filename: __filename 
}, async (conn, mek, m, { from, quoted, q, reply }) => {
    try {
        if (!q) return reply("Please provide a YouTube URL or video name.");
        
        // Search for video if not a direct URL
        let videoInfo = {};
        if (!isValidYouTubeUrl(q)) {
            const search = await yts(q);
            if (search.videos.length === 0) return reply("No videos found!");
            videoInfo = search.videos[0];
        } else {
            const search = await yts({ videoId: q.split('v=')[1] });
            videoInfo = search;
        }

        const menuMsg = `
🎥 *Video Found: ${videoInfo.title}*

⏳ Duration: ${videoInfo.timestamp}
👀 Views: ${videoInfo.views}
🔗 URL: ${videoInfo.url}

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
            image: { url: videoInfo.thumbnail },
            caption: menuMsg
        }, { quoted: mek });

        // Add reply tracker
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
                const apiUrl = `https://api.rash-official.repl.co/api/ytdl/video?url=${encodeURIComponent(videoInfo.url)}&quality=${quality}`;
                const response = await axios.get(apiUrl);
                const data = response.data;

                if (!data.status || !data.result?.downloadUrl) {
                    throw new Error("Failed to fetch video");
                }

                await conn.sendMessage(from, { react: { text: '⬆️', key: replyMek.key } });

                const isDocument = messageType.startsWith('2') || messageType.includes('.2');
                const caption = `🎥 *${videoInfo.title}* (${quality}p)\n⏳ ${videoInfo.timestamp}`;

                if (isDocument) {
                    await conn.sendMessage(from, {
                        document: { url: data.result.downloadUrl },
                        mimetype: "video/mp4",
                        fileName: `${videoInfo.title}_${quality}p.mp4`,
                        caption: caption
                    }, { quoted: replyMek });
                } else {
                    await conn.sendMessage(from, {
                        video: { url: data.result.downloadUrl },
                        mimetype: "video/mp4",
                        caption: caption
                    }, { quoted: replyMek });
                }

                await conn.sendMessage(from, { react: { text: '✅', key: replyMek.key } });
            } catch (e) {
                console.error("Download error:", e);
                await conn.sendMessage(from, { react: { text: '❌', key: replyMek.key } });
                reply("Failed to download video. Please try again.");
            }
        });

    } catch (e) {
        console.error("Command error:", e);
        reply("An error occurred. Please try again later.");
    }
});

// Audio download with reply tracking
cmd({ 
    pattern: "song", 
    alias: ["ytmp3", "music"], 
    react: "🎶", 
    desc: "Download YouTube audio with format options", 
    category: "download", 
    use: '.song <YouTube URL or search term>', 
    filename: __filename 
}, async (conn, mek, m, { from, quoted, q, reply }) => {
    try {
        if (!q) return reply("Please provide a YouTube URL or song name.");
        
        // Search for video if not a direct URL
        let videoInfo = {};
        if (!isValidYouTubeUrl(q)) {
            const search = await yts(q);
            if (search.videos.length === 0) return reply("No videos found!");
            videoInfo = search.videos[0];
        } else {
            const search = await yts({ videoId: q.split('v=')[1] });
            videoInfo = search;
        }

        const menuMsg = `
🎵 *Song Found: ${videoInfo.title}*

⏳ Duration: ${videoInfo.timestamp}
👀 Views: ${videoInfo.views}
🔗 URL: ${videoInfo.url}

Please reply with your preferred format:
1. Audio File
2. Document File
3. Voice Note
`;

        const sentMsg = await conn.sendMessage(from, {
            image: { url: videoInfo.thumbnail },
            caption: menuMsg
        }, { quoted: mek });

        // Add reply tracker
        conn.addReplyTracker(sentMsg.key.id, async (replyMek, messageType) => {
            if (!['1', '2', '3'].includes(messageType)) {
                await conn.sendMessage(from, { react: { text: '❌', key: replyMek.key } });
                return reply("Invalid option. Please choose 1, 2, or 3.");
            }

            await conn.sendMessage(from, { react: { text: '⬇️', key: replyMek.key } });

            try {
                const apiUrl = `https://api.rash-official.repl.co/api/ytdl/audio?url=${encodeURIComponent(videoInfo.url)}`;
                const response = await axios.get(apiUrl);
                const data = response.data;

                if (!data.status || !data.result?.downloadUrl) {
                    throw new Error("Failed to fetch audio");
                }

                await conn.sendMessage(from, { react: { text: '⬆️', key: replyMek.key } });

                const caption = `🎵 *${videoInfo.title}*\n⏳ ${videoInfo.timestamp}`;

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
                            fileName: `${videoInfo.title}.mp3`,
                            caption: caption
                        }, { quoted: replyMek });
                        break;
                    case '3': // Voice note
                        await conn.sendMessage(from, {
                            audio: { url: data.result.downloadUrl },
                            mimetype: "audio/mpeg",
                            ptt: true,
                            caption: caption
                        }, { quoted: replyMek });
                        break;
                }

                await conn.sendMessage(from, { react: { text: '✅', key: replyMek.key } });
            } catch (e) {
                console.error("Download error:", e);
                await conn.sendMessage(from, { react: { text: '❌', key: replyMek.key } });
                reply("Failed to download audio. Please try again.");
            }
        });

    } catch (e) {
        console.error("Command error:", e);
        reply("An error occurred. Please try again later.");
    }
});
