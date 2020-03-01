export type ConversationMessageType = {
    id: number,
    from_id: number,
    date: Date,
    text: string,
    out: boolean,
} | null;