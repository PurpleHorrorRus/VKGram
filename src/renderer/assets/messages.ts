import { CacheProfileType } from "~/types/Messages/CacheProfileType";
import { MessageType } from "~/types/Messages/MessageType";
import { CacheObjectType } from "~/types/Messages/CacheObjectType";

export default {
    BuildProfile (profile: any): CacheProfileType {
        const { id, photo_50: photo } = profile;
        const title: string = `${profile.first_name} ${profile.last_name}`;
        return { id, title, photo };
    },
    BuildGroup (group: any): CacheProfileType {
        const { id, name: title, photo_50: photo } = group;
        return { id, title, photo };
    },
    BuildMessage (item: any, out_read: number = 0, in_read: number = 0): MessageType {
        return {
            attachments: item.attachments || [],
            id: item.id,
            from_id: item.from_id || item.user_id,
            date: item.date,
            text: item.body || item.text,
            fwd_messages: item.fwd_messages || [],
            out: item.out || 0,
            read_state: item.read_state || item.out ? item.id < out_read : item.id <= in_read
        };
    },
    BuildHistory (history: any): CacheObjectType {
        let profiles: Array<CacheProfileType> = [];
        let messages: Array<MessageType> = [];
        let conversation: CacheProfileType;
        const draft: string = "";

        const conversations = history.conversations[0];
        const { chat_settings, peer, in_read, out_read } = conversations;
        const { id } = peer;

        if (chat_settings) {
            const { title, photo: _p } = chat_settings;
            const { photo_50: photo } = _p;
            conversation = { id, title, photo };
        }

        if (history.profiles) {
            if (!chat_settings && id > 0) conversation = this.BuildProfile(history.profiles[0], conversations);
            for (const profile of history.profiles) {
                profiles = [...profiles, this.BuildProfile(profile)];
            }
        } 

        if (history.groups) {
            if (!chat_settings && id < 0) conversation = this.BuildGroup(history.groups[0], conversations);
            for (const group of history.groups) {
                profiles = [...profiles, this.BuildGroup(group)];
            }
        }

        for (const message of history.items) {
            messages = [this.BuildMessage(message, in_read, out_read), ...messages];
        } 

        return { conversation, profiles, messages, draft };
    }
};