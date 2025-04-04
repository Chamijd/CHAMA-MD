const config = require('../config');
const { cmd } = require('../command');
const { ytsearch } = require('@dark-yasiya/yt-dl.js');

// MP4 video download
cmd({ 
    pattern: "mp5", 
    alias: ["video1"], 
    react: "🎥", 
    desc: "Download YouTube video", 
    category: "main", 
    use: '.mp4 < Yt url or Name >', 
    filename: __filename 
}, async (conn, mek, m, { from, prefix, quoted, q, reply }) => { 
    try { 
        if (!q) return await reply("Please provide a YouTube URL or video name.");
        
        const yt = await ytsearch(q);
        if (yt.results.length < 1) return reply("No results found!");
        
        let yts = yt.results[0];  
        
        let ytmsg = `📹 *Video Details*\n🎬 *Title:* ${yts.title}\n⏳ *Duration:* ${yts.timestamp}\n👀 *Views:* ${yts.views}\n👤 *Author:* ${yts.author.name}\n🔗 *Link:* ${yts.url}\n\n🔽 *Reply with*\n1. *Video File*\n2. *Document File*`;
        
        let contextInfo = {
            mentionedJid: [m.sender],
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363395257960673@newsletter',
                newsletterName: '☈☟𝗖𝗛𝗔𝗠𝗔 𝗠𝗗',
                serverMessageId: 143
            }
        };

        // Send the thumbnail with caption
        const sentMsg = await conn.sendMessage(from, { 
            image: { url: yts.thumbnail }, 
            caption: ytmsg, 
            contextInfo 
        }, { quoted: mek });

        // Add reply tracker
        conn.addReplyTracker(sentMsg.key.id, async (replyMek, messageType) => {
            const choice = messageType.trim();
            
            if (choice === '1' || choice === '2') {
                await conn.sendMessage(from, { react: { text: '⬇️', key: replyMek.key } });
                
                try {
                    let apiUrl = `https://apis.davidcyriltech.my.id/download/ytmp4?url=${encodeURIComponent(yts.url)}`;
                    let response = await fetch(apiUrl);
                    let data = await response.json();
                    
                    if (data.status !== 200 || !data.success || !data.result.download_url) {
                        return reply("Failed to fetch the video. Please try again later.");
                    }

                    await conn.sendMessage(from, { react: { text: '⬆️', key: replyMek.key } });

                    if (choice === '1') {
                        // Send as normal video
                        await conn.sendMessage(from, { 
                            video: { url: data.result.download_url }, 
                            mimetype: "video/mp4",
                            caption: `📹 ${yts.title}`,
                            contextInfo 
                        }, { quoted: replyMek });
                    } else if (choice === '2') {
                        // Send as document
                        await conn.sendMessage(from, { 
                            document: { url: data.result.download_url }, 
                            mimetype: "video/mp4", 
                            fileName: `${yts.title}.mp4`,
                            caption: `📹 ${yts.title}`,
                            contextInfo 
                        }, { quoted: replyMek });
                    }
                    
                    await conn.sendMessage(from, { react: { text: '✅', key: replyMek.key } });
                } catch (e) {
                    console.log(e);
                    reply("An error occurred. Please try again later.");
                }
            } else {
                await conn.sendMessage(from, { react: { text: '❌', key: replyMek.key } });
                await reply("Invalid option. Please reply with 1 or 2.");
            }
        });

    } catch (e) {
        console.log(e);
        reply("An error occurred. Please try again later.");
    }
});

// MP3 song download
cmd({ 
    pattern: "song1", 
    alias: ["y", "p"], 
    react: "🎶", 
    desc: "Download YouTube song", 
    category: "main", 
    use: '.song < Yt url or Name >', 
    filename: __filename 
}, async (conn, mek, m, { from, prefix, quoted, q, reply }) => { 
    try { 
        if (!q) return await reply("Please provide a YouTube URL or song name.");
        
        const yt = await ytsearch(q);
        if (yt.results.length < 1) return reply("No results found!");
        
        let yts = yt.results[0];  
        
        let ytmsg = `🎵 *Song Details*\n🎶 *Title:* ${yts.title}\n⏳ *Duration:* ${yts.timestamp}\n👀 *Views:* ${yts.views}\n👤 *Author:* ${yts.author.name}\n🔗 *Link:* ${yts.url}\n\n🔽 *Reply with*\n1. *Audio File*\n2. *Document File*\n3. *Voice Note*`;
        
        let contextInfo = {
            mentionedJid: [m.sender],
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363395257960673@newsletter',
                newsletterName: '☈☟𝗖𝗛𝗔𝗠𝗔 𝗠𝗗',
                serverMessageId: 143
            }
        };

        // Send the thumbnail with caption
        const sentMsg = await conn.sendMessage(from, { 
            image: { url: yts.thumbnail }, 
            caption: ytmsg, 
            contextInfo 
        }, { quoted: mek });

        // Add reply tracker
        conn.addReplyTracker(sentMsg.key.id, async (replyMek, messageType) => {
            const choice = messageType.trim();
            
            if (choice === '1' || choice === '2' || choice === '3') {
                await conn.sendMessage(from, { react: { text: '⬇️', key: replyMek.key } });
                
                try {
                    let apiUrl = `https://apis.davidcyriltech.my.id/youtube/mp3?url=${encodeURIComponent(yts.url)}`;
                    let response = await fetch(apiUrl);
                    let data = await response.json();
                    
                    if (data.status !== 200 || !data.success || !data.result.downloadUrl) {
                        return reply("Failed to fetch the audio. Please try again later.");
                    }

                    await conn.sendMessage(from, { react: { text: '⬆️', key: replyMek.key } });

                    if (choice === '1') {
                        // Send as normal audio
                        await conn.sendMessage(from, { 
                            audio: { url: data.result.downloadUrl }, 
                            mimetype: "audio/mpeg",
                            contextInfo 
                        }, { quoted: replyMek });
                    } else if (choice === '2') {
                        // Send as document
                        await conn.sendMessage(from, { 
                            document: { url: data.result.downloadUrl }, 
                            mimetype: "audio/mpeg", 
                            fileName: `${yts.title}.mp3`,
                            contextInfo 
                        }, { quoted: replyMek });
                    } else if (choice === '3') {
                        // Send as voice note
                        await conn.sendMessage(from, { 
                            audio: { url: data.result.downloadUrl }, 
                            mimetype: "audio/mpeg", 
                            ptt: true,
                            contextInfo 
                        }, { quoted: replyMek });
                    }
                    
                    await conn.sendMessage(from, { react: { text: '✅', key: replyMek.key } });
                } catch (e) {
                    console.log(e);
                    reply("An error occurred. Please try again later.");
                }
            } else {
                await conn.sendMessage(from, { react: { text: '❌', key: replyMek.key } });
                await reply("Invalid option. Please reply with 1, 2 or 3.");
            }
        });

    } catch (e) {
        console.log(e);
        reply("An error occurred. Please try again later.");
    }
});
