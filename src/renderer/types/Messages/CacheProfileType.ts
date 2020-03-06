export type CacheProfileType = {
    id: number
    photo: string
    title: string
    type: string
    typing: boolean
    last_message_id?: number
    online?: boolean
    last_seen?: number
    in_read?: number
    out_read?: number
};