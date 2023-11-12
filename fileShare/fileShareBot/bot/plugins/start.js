

const { Button } = require("telegram/tl/custom/button");
const logger = require("../../logger");
const getLang = require("../i18n/utils");
const translate = require("../i18n/t9n");
const { buttons } = require("telegram/client");
var { errors } = require("telegram");


module.exports = async function(client){
    client.addEventHandler((update) => {
        if (update && update.message && update.message.message && 
                        update.message.message.startsWith("/start")){
            
            logger.log('info', `/start: by ${update.message.chatId}`)
            try {
                lang_code = getLang(update.message.chatId);
                text, button = translate ({
                    text: "[start][message]",
                    button: "[start][button][withChannel]",
                    langCode: lang_code
                });
                logger.log("info", `${text}/${button}`)
                client.sendMessage(update.message.chatId, {
                    message: text,
                    buttons: client.buildReplyMarkup(buttons),
                });
                return 0;
            } catch (error) {
                logger.log("FloodWaitError:", error);
                if (error instanceof errors.FloodWaitError) {
                    // Handle FloodWaitError
                    // module.exports(client);
                }
            }
        }
    });
}