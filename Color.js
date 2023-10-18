let DARKTHEME = true

let Color = {
    white: [255, 255, 255],
    nearWhite: [242, 242, 247],
    black: [0, 0, 0],
    nearBlack: [28, 28, 29],
    red: [235, 77, 61],
    green: [101, 195, 102],
    blue: [48, 124, 246],
    orange: [241, 153, 55],
    yellow: [248, 205, 70],
    pink: [235, 68, 90],
    purple: [163, 91, 215],
    secondary: [138, 138, 142],
    saffron: [242, 157, 75],
    accent: [48, 124, 246],
    primary: [255, 255, 255],
    inverse: [0, 0, 0],
    transparent: [0, 0, 0, 0],
    nearPrimary: [242, 242, 247],
    nearInverse: [28, 28, 29],

    brighter(colour, times=1) {
        return [colour[0]*((7/6)**times), colour[1]*((7/6)**times), colour[2]*((7/6)**times)];
    },

    darker(colour, times=1) {
        return [colour[0]*((6/7)**times), colour[1]*((6/7)**times), colour[2]*((6/7)**times)];
    },

    nudge(colour, times=1) {
        if (DARKTHEME) return Color.brighter(colour, times);
        else return Color.darker(colour, times);
    },

    darkTheme(bool) {
        DARKTHEME = bool;
        if (bool) {
            Color.primary = Color.white
            Color.inverse = Color.black
            Color.nearPrimary = Color.nearWhite
            Color.nearInverse = Color.nearBlack
        }
        else {
            Color.primary = Color.black
            Color.inverse = Color.white
            Color.nearPrimary = Color.nearBlack
            Color.nearInverse = Color.nearWhite
        }
    },

    hsbToRgb(h, s, b) {
        s /= 100;
        b /= 100;
        const k = (n) => (n + h / 60) % 6;
        const f = (n) => b * (1 - s * Math.max(0, Math.min(k(n), 4 - k(n), 1)));
        return [Math.round(255 * f(5)), Math.round(255 * f(3)), Math.round(255 * f(1))];
    }
}