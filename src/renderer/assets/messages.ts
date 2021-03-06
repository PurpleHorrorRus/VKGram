import { CacheProfileType } from "~/types/Messages/CacheProfileType";
import { MessageType } from "~/types/Messages/MessageType";
import { CacheObjectType } from "~/types/Messages/CacheObjectType";

export default {
    BuildConversation (object: any, conversations: any): CacheProfileType {
        const { type } = object;

        const conversation: CacheProfileType = 
        !type
            ? this.BuildProfile(object) 
            : this.BuildGroup(object);

        return Object.assign(conversation, {
            last_message_id: conversations.last_message_id,
            out_read: conversations.out_read,
            in_read: conversations.in_read
        });
    },
    BuildProfile (profile: any): CacheProfileType {
        const { id, photo_50: photo, online, last_seen } = profile;
        const title: string = `${profile.first_name} ${profile.last_name}`;
        return { 
            id,
            title, 
            type: "user",
            typing: false,
            photo, 
            online, 
            last_seen 
        };
    },
    BuildGroup (group: any): CacheProfileType {
        const { id, name: title, photo_50: photo } = group;
        return { 
            id, 
            title,
            typing: false,
            type: "group",
            photo
        };
    },
    BuildMessage (item: any, out_read: number = 0, in_read: number = 0): MessageType {
        let fwd = [];
        if (item.fwd_messages) {
            if (item.fwd_messages.length) {
                for (const _f of item.fwd_messages) {
                    const build = this.BuildMessage(_f);
                    fwd = [...fwd, build];
                }
            }
        }

        return {
            attachments: item.attachments || [],
            id: item.id || item.conversation_message_id,
            from_id: item.from_id || item.user_id,
            date: item.date,
            text: item.body || item.text,
            fwd_messages: fwd,
            out: item.out || 0,
            read_state: item.read_state || item.out === 1 ? in_read >= item.id : out_read >= item.id
        };
    },
    BuildHistory (history: any): CacheObjectType {
        let profiles: Array<CacheProfileType> = [];
        let messages: Array<MessageType> = [];
        let conversation: CacheProfileType;
        const draft: string = "";

        const conversations = history.conversations[0];
        const { chat_settings, peer, last_message_id, in_read, out_read } = conversations;
        const { id } = peer;

        if (chat_settings) {
            const { title, photo: _p } = chat_settings;
            const { photo_50: photo } = _p;
            conversation = { 
                id, 
                title, 
                type: "chat",
                typing: false,
                photo, 
                last_message_id,
                in_read, 
                out_read
            };
        }

        if (history.profiles) {
            if (!chat_settings && id > 0) {
                const index = history.profiles.findIndex(p => p.id === id);
                if (~index) conversation = this.BuildConversation(history.profiles[index], conversations);
            }
            for (const profile of history.profiles) {
                profiles = [...profiles, this.BuildProfile(profile)];
            }
        } 

        if (history.groups) {
            if (!chat_settings && id < 0) {
                let index = 0;
                if (history.groups.length > 1) index = history.groups.findIndex(g => Math.abs(g.id) === Math.abs(id));
                if (~index) conversation = this.BuildConversation(history.groups[index], conversations);
            }
            for (const group of history.groups) {
                profiles = [...profiles, this.BuildGroup(group)];
            }
        }

        for (const message of history.items) {
            const build = this.BuildMessage(message, in_read, out_read);
            messages = [build, ...messages];
        }

        return { conversation, profiles, messages, draft };
    }
};