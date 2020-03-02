import { readFileSync } from "fs";

export default {
    platforms: { // https://vk.com/dev/using_longpoll_2?f=7.+Platforms
        mobile: [1, 5],
        apple: [2, 3],
        android: [4],
        web: [6, 7]
    },
    ReadJSON (path: string): object {
        const content: string = readFileSync(path, "UTF-8");
        try {
            const _JSON = JSON.parse(content);
            return _JSON;
        } catch (e) { return new Error(e); }
    },
    FormatTime (time: number, ShowTime: boolean = true): string {
        const a = new Date(time * 1000);
        const months: Array<string> = ["янв", "фев", "мар", "апр", "мая", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"];
        const year: number = a.getFullYear();
        const m_index: number = a.getMonth();
        const month: string = months[m_index];
        const day: number = Number(`${a.getDate()}`.slice(-2));
        const hour: number = a.getHours();
        const min: number = a.getMinutes();

        const currentDate = new Date();
        const current: any = {
            year: currentDate.getFullYear(),
            month: currentDate.getMonth() + 1,
            day: currentDate.getUTCDate()
        };

        let _time = null;

        if (current.day !== day || current.month !== m_index + 1) {
            _time = `${day} ${month}`;
            if (current.year !== year) _time += ` ${year}`;
            if (ShowTime) _time += `, ${hour}:${min < 10 ? "0" + min : min}`;
        } else _time = `${hour}:${min < 10 ? "0" + min : min}`;
            
        return _time;
    },
    ArrayMove (arr, oldIndex, newIndex): Array<any> {
        if (newIndex >= arr.length) {
            let k = newIndex - arr.length + 1;
            while (k--) arr.push(undefined);
        }
        arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
        return arr;
    },
    GetRandom: (min: number, max: number): number => (Math.floor(Math.random() * (max - min + 1)) + min)
};