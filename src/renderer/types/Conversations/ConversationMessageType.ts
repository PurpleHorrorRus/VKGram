export type ConversationMessageType = {
    id: number
    from_id: number
    date: Date
    append_name?: String
    attachments: Array<String>
    text: string
    out: boolean
} | null;