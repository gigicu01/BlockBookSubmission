import dayjs from "dayjs"
var relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

//returns the input date in DD MMM HH:MM format
export const toDateAndMonth = (date: string) => {
    return dayjs(date).format("DD MMM HH:MM")
}

//returns the string of relative time from now. So for example for dayjs('1999-01-01').fromNow() it returns 23 years ago
export const toRelativeTime = (date:string) => {
    return (dayjs(date) as any).fromNow()
}