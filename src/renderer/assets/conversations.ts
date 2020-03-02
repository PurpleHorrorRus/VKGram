import { ConversationType } from "~/types/Conversations/ConversationType";
import { ConversationMessageType } from "~/types/Conversations/ConversationMessageType";

const attachmentsTypes = {
    wall: "Запись на стене",
    photo: "Изображение",
    audio: "Аудио",
    video: "Видео",
    doc: "Граффити",
    document: "Документ",
    sticker: "Стикер",
    gift: "Подарок",
    link: "Ссылка",
    audio_message: "Голосовое сообщение",
    audio_playlist: "Плейлист"
};

export default {
    BuildConversationMessage (item: any, AppendName: string = "") {
        const { last_message } = item;
        const { attachments, id, from_id, date, text, out } = last_message;
        let atts = [];
        
        if (attachments) {
            if (attachments.length) { 
                const counts = {};
                attachments.map(x => x.type).forEach(x => counts[x] = (counts[x] || 0) + 1);

                Object.keys(counts).forEach(e => {
                    const count = counts[e];
                    const writeCount = count !== 1 ? count : "";
                    return atts = [...atts, `${writeCount} ${attachmentsTypes[e]}`];
                });
            } 
        }

        const message: ConversationMessageType = {
            id,
            from_id,
            date,
            append_name: AppendName,
            attachments: atts,
            text,
            out
        };
        return message;
    },
    BuildConversation (item: any, groups: any, profiles: any): ConversationType {
        const { conversation } = item;
        const { last_message_id: msg_id, in_read, out_read } = conversation;
        const unread_count: number = conversation.unread_count ? conversation.unread_count : 0;
        const { id, type } = conversation.peer;
        let title: string = "";
        let photo: string = "";

        let online: boolean = false;
        let online_mobile: boolean = false;

        let message: ConversationMessageType = null;

        if (type === "user") {
            const ProfileIndex: number = profiles.findIndex(p => p.id === id);
            if (~ProfileIndex) {
                const profile = profiles[ProfileIndex];
                const { first_name, last_name, photo_50, online: _o, online_mobile: _m } = profile;
                online = _o === 1;
                online_mobile = _m || 7;
                title = `${first_name} ${last_name}`;
                photo = photo_50;
            }
        } else if (type === "group") {
            const GroupIndex: number = groups.findIndex(g => g.id === -id);
            if (~GroupIndex) {
                const group = groups[GroupIndex];
                const { name, photo_50 } = group;
                title = name;
                photo = photo_50;
            }
        } else if (type === "chat") {
            const { chat_settings } = conversation;
            const { last_message } = item;
            const { from_id } = last_message;
            const ProfileIndex: number = profiles.findIndex(p => p.id === from_id);
            if (~ProfileIndex) {
                const { first_name } = profiles[ProfileIndex];
                message = this.BuildConversationMessage(item, first_name);
            }
            title = chat_settings.title;
            photo = chat_settings.photo.photo_50;
        } else { console.log(type); }

        if (!message) message = this.BuildConversationMessage(item);
        return { id, title, photo, msg_id, out_read, in_read, unread_count, online, online_mobile, message };
    },
    BuildConversations (items: any, groups: any, profiles: any): Array<object> {
        let ready = [];
        for (const item of items) {
            const conversations: ConversationType = this.BuildConversation(item, groups, profiles);
            ready = [...ready, conversations];
        }
        return ready;
    }
};