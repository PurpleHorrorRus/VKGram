import { ConversationMessageType } from "~/types/Conversations/ConversationMessageType";
export type ConversationType = {
    id: number,
    photo: string,
    title: string,
    msg_id: number,
    out_read: number,
    in_read: number,
    online?: boolean,
    online_mobile?: boolean,
    unread_count?: number,
    message: ConversationMessageType
};