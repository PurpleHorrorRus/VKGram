export type MessageType = {
    attachments?: Array<MessageType>
    id: number
    from_id: number
    date: Date
    fwd_messages?: Array<MessageType>
    text: string
    read_state: boolean
    out: boolean
}