
type Compass = {
    direction: string,
    short: string,
    min: number,
    max: number,
}

const compassHeadings = [
    {
        direction: 'Nord',
        short: 'N',
        min: 354.375,
        max: 5.625,
    },
    {
        direction: 'Nord til øst',
        short: 'N. t. Ø.',
        min: 5.625,
        max: 16.875,
    },
    {
        direction: 'Nordnordøst',
        short: 'NNØ',
        min: 16.875,
        max: 28.125,
    },
    {
        direction: 'Nordøst til nord',
        short: 'NØ. t. N.',
        min: 28.125,
        max: 39.375,
    },
    {
        direction: 'Nordøst',
        short: 'NØ',
        min: 39.375,
        max: 50.625,
    },
    {
        direction: 'Nordøst til øst',
        short: 'NØ. t. Ø.',
        min: 50.625,
        max: 61.875,
    },
    {
        direction: 'Østnordøst',
        short: 'ØNØ',
        min: 61.875,
        max: 73.125,
    },
    {
        direction: 'Øst til nord',
        short: 'Ø. t. N.',
        min: 73.125,
        max: 84.375,
    },
    {
        direction: 'Øst',
        short: 'Ø',
        min: 84.375,
        max: 95.625,
    },
    {
        direction: 'Øst til syd',
        short: 'Ø. t. S.',
        min: 95.625,
        max: 106.875,
    },
    {
        direction: 'Østsydøst',
        short: 'ØSØ',
        min: 106.875,
        max: 118.125,
    },
    {
        direction: 'Sydøst til øst',
        short: 'SØ. t. Ø.',
        min: 118.125,
        max: 129.375,
    },
    {
        direction: 'Sydøst',
        short: 'SØ',
        min: 129.375,
        max: 140.625,
    },
    {
        direction: 'Sydøst til syd',
        short: 'SØ. t. S.',
        min: 140.625,
        max: 151.875,
    },
    {
        direction: 'Sydsydøst',
        short: 'SSØ',
        min: 151.875,
        max: 163.125,
    },
    {
        direction: 'Syd til øst',
        short: 'S. t. Ø.',
        min: 163.125,
        max: 174.375,
    },
    {
        direction: 'Syd',
        short: 'S',
        min: 174.375,
        max: 185.625,
    },
    {
        direction: 'Syd til vest',
        short: 'S. t. V.',
        min: 185.625,
        max: 196.875,
    },
    {
        direction: 'Sydsydvest',
        short: 'SSV',
        min: 196.875,
        max: 208.125,
    },
    {
        direction: 'Sydvest til syd',
        short: 'SV. t. S.',
        min: 208.125,
        max: 219.375,
    },
    {
        direction: 'Sydvest',
        short: 'SV',
        min: 219.375,
        max: 230.625,
    },
    {
        direction: 'Sydvest til vest',
        short: 'SV. t. V.',
        min: 230.625,
        max: 241.875,
    },
    {
        direction: 'Vestsydvest',
        short: 'VSV',
        min: 241.875,
        max: 253.125,
    },
    {
        direction: 'Vest til syd',
        short: 'V. t. S.',
        min: 253.125,
        max: 264.375,
    },
    {
        direction: 'Vest',
        short: 'V',
        min: 264.375,
        max: 275.625,
    },
    {
        direction: 'Vest til nord',
        short: 'V. t. N.',
        min: 275.625,
        max: 286.875,
    },
    {
        direction: 'Vestnordvest',
        short: 'VNV',
        min: 286.875,
        max: 298.125,
    },
    {
        direction: 'Nordvest til vest',
        short: 'NV. t. V.',
        min: 298.125,
        max: 309.375,
    },
    {
        direction: 'Nordvest',
        short: 'NV',
        min: 309.375,
        max: 320.625,
    },
    {
        direction: 'Nordvest til nord',
        short: 'NV. t. N.',
        min: 320.625,
        max: 331.875,
    },
    {
        direction: 'Nordnordvest',
        short: 'NNV',
        min: 331.875,
        max: 343.125,
    },
    {
        direction: 'Nord til vest',
        short: 'N. t. V.',
        min: 343.125,
        max: 354.375,
    },
]

export function getCompassHeading(degrees: number): Compass {
    const heading = compassHeadings.find((h) => degrees < h.max && degrees > h.min)
    return heading || compassHeadings[0]
}

type WindSpeed = {
    label: string,
    windspeed: number,
}
const windSpeed: WindSpeed[] = [
    { 
        label: 'Orkan', 
        windspeed: 32.6,
    },
    {
        label: 'Stærk storm',
        windspeed: 28.5,
    },
    {
        label: 'Storm',
        windspeed: 24.5,
    },
    {
        label: 'Stormende kuling',
        windspeed: 20.8,
    },
    {
        label: 'Hård kuling',
        windspeed: 17.2,
    },
    {
        label: 'Stiv kuling',
        windspeed: 13.8,
    },
    {
        label: 'Hård vind',
        windspeed: 10.8,
    },
    {
        label: 'Frisk vind',
        windspeed: 8.0,
    },
    {
        label: 'Jævn vind',
        windspeed: 5.5,
    },
    {
        label: 'Let vind',
        windspeed: 3.4,
    },
    {
        label: 'Svag vind',
        windspeed: 1.6,
    },
    {
        label: 'Svag luftning',
        windspeed: 0.3,
    },
    {
        label: 'Stille',
        windspeed: 0,
    },
]

export function wind(speed: number): WindSpeed {
    return windSpeed.find((w) => w.windspeed <= speed) || {
        label: 'ukendt',
        windspeed: -99,
    }
}
