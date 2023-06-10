import { da } from 'date-fns/locale'
import { parseISO, format as dateFnsFormat } from 'date-fns'
import { useCallback } from 'react'

export const dateFormats = {
    compactDate: 'd. MMM yyyy',
    compactDateNoYear: 'd. MMM',
    compactDateTime: "d. MMM yyyy, 'kl.' HH:mm",
    compactDateWithDay: 'iii d. MMM yyyy',
    compactDateLongTime: "d. MMM yyyy, 'kl.' HH:mm:ss",
    nameOfMonth: 'LLLL',
    shortNameOfMonth: 'LLL',
    dayOfMonth: 'd',
    weekNumber: 'I',
    weekDay: 'iiii',
    calendarDay: 'iiii, d. MMM',
    time: 'HH:mm',
    longTime: 'HH:mm:ss',
}

export type DateFormatter = (
    date: undefined | string | number | Date,
    format: keyof typeof dateFormats,
) => string

export function useFormatDate(): DateFormatter {
    return useCallback(
        (
            date: string | number | Date | undefined,
            format: keyof typeof dateFormats,
        ) => {
            if (date === undefined) {
                return ''
            }

            const options = {
                locale: da,
            }
            const localeFormat = dateFormats[format]
            if (date instanceof Date || typeof date === 'number') {
                return dateFnsFormat(date, localeFormat, options)
            }

            return dateFnsFormat(
                date ? parseISO(date.toString()) : 0,
                localeFormat,
                options,
            )
        },
        [],
    )
}
