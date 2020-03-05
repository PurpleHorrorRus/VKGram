export type CacheProfileType = {
    id: number
    photo: string
    title: string
    type: string
    typing: boolean
    online?: boolean
    last_seen?: number
    in_read?: number
    out_read?: number
};