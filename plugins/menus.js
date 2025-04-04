const config = require('../config');
const { cmd, commands } = require('../command');
const os = require("os");
const { runtime } = require('../lib/functions');
const imageUrl = 'https://i.ibb.co/5XNzHkVp/3908.jpg';

cmd({
    pattern: "menu",
    react: "📃",
    alias: ["panel", "commands"],
    desc: "Get Bot Menu",
    category: "main",
    use: '.menu',
    filename: __filename
},
async (conn, mek, m, { from, quoted, pushname, reply }) => {
    try {
        const selectionMessage = `
╭━━━━∙⋆⋅⋆∙━ ─┉─ • ─┉─⊷
      *HELLO👋*  *${pushname}*
      
    *CHAMA 𝐌𝐃 Command List 𝐈𝐒 𝐇𝐄𝐑𝐄,*
╰━━━━∙⋆⋅⋆∙━ ─┉─ • ─┉─⊷

  *╭────────────◎*
  *│1. MEN MENU* 
  *│2. DOWNLOAD MENU*
  *│3. GROUP MENU*
  *│4. FUN MENU*
  *│5. OTHER MENU*
  *│6. MAIN MENU*
  *│7. OWNER MENU* 
  *│8. CONVERT MENU*
  *│9. ANMIE MENU*
  *│10. AI MENU*
  *╰────────────◎*

> ©ᴘᴏᴡᴇʀᴇᴅ ʙʏ Cʜɪɴᴅᴜ 
`;

        const sentMsg = await conn.sendMessage(from, {
            image: { url: imageUrl },
            caption: selectionMessage,
            contextInfo: { forwardingScore: 999, isForwarded: true },
        }, { quoted: mek });

        // පරිශීලක ප්‍රතිචාර ලබා ගැනීම
        conn.ev.on('messages.upsert', async (msgUpdate) => {
            const msg = msgUpdate.messages[0];
            if (!msg.message || !msg.message.extendedTextMessage) return;

            const userResponse = msg.message.extendedTextMessage.text.trim();
            if (msg.message.extendedTextMessage.contextInfo &&
                msg.message.extendedTextMessage.contextInfo.stanzaId === sentMsg.key.id) {

                let responseText;

                switch (userResponse) {
                    case '1': // DOWNLOAD MENU
                        responseText = `.menu1`;

                        break;
                    case '2': // AI MENU
                        responseText = `.dulmenu`;
                        break;
                    case '3': // OWNER MENU
                        responseText = `.groupmenu`;
                        break;
                    case '4': // GROUP MENU
                        responseText = `.funmenu`;
                        break;
                    case '5': // INFO MENU
                        responseText = `.othermenu`;
                        
                        break;
                    case '6': // WALLPAPERS MENU
                        responseText = `.mainmenu`;
               break;
                    case '7': // WALLPAPERS MENU
                        responseText = `.ownermenu`;

               break;
                    case '8': // WALLPAPERS MENU
                        responseText = `.convertmenu`;

               break;
                    case '9': // WALLPAPERS MENU
                        responseText = `.animemenu`;
                      
                 break;
                    case '10': // WALLPAPERS MENU
                        responseText = `.aimenu`;
                      
                      
                        break;
                    default:
                        responseText = "*❌ Invalid option. Please enter a valid number (1-10)*";
                }

                // තෝරාගත් මෙනුව WhatsApp chat එකට යවයි.
                await conn.sendMessage(from, { text: responseText }, { quoted: mek });
            }
        });

    } catch (e) {
        console.error(e);
        reply(`*⚠ An error occurred: ${e.message}*`);
    }
});

