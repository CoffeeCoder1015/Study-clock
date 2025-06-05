export function getGreenwichSiderealTime(date: Date): number {
  const JD = (date.getTime() / 86400000) + 2440587.5;
  const D = JD - 2451545.0;
  let gst = 280.46061837 + 360.98564736629 * D;
  gst = ((gst % 360) + 360) % 360;
  return gst; // in degrees
}

/**
 * Compute the Sun’s apparent right ascension and declination (in degrees)
 * for a given UTC date/time. Algorithm from NOAA’s Solar Position Calculations.
 *
 * @param date   – JavaScript Date object (interpreted in UTC)
 * @returns      – { rightAscension, declination } in degrees
 */
export function getSunCelestialCoords(date: Date): {
    rightAscension: number;
    declination: number;
} {
    // Helper: convert degrees → radians
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    // Helper: convert radians → degrees
    const toDeg = (rad: number) => (rad * 180) / Math.PI;
    // Ensure we use UTC components
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1; // JS month: 0=Jan → +1
    const day = date.getUTCDate();
    const hour = date.getUTCHours();
    const min = date.getUTCMinutes();
    const sec = date.getUTCSeconds();

    // 1. Julian Day (JD)
    //    – if month ≤ 2, treat Jan/Feb as months 13/14 of previous year
    let Y = year;
    let M = month;
    if (M <= 2) {
        Y = year - 1;
        M = month + 12;
    }
    const A = Math.floor(Y / 100);
    const B = 2 - A + Math.floor(A / 4);
    // Fractional day:
    const dayFraction = (hour + min / 60 + sec / 3600) / 24;
    const JD =
        Math.floor(365.25 * (Y + 4716)) +
        Math.floor(30.6001 * (M + 1)) +
        day +
        dayFraction +
        B -
        1524.5;

    // 2. Julian Century from J2000.0
    const T = (JD - 2451545.0) / 36525;

    // 3. Geometric Mean Longitude of the Sun (L0, in degrees)
    //    – this is “unwrapped”; we’ll reduce into [0,360)
    let L0 = 280.46646 + T * (36000.76983 + T * 0.0003032);
    L0 = ((L0 % 360) + 360) % 360;

    // 4. Geometric Mean Anomaly of the Sun (M, in degrees)
    let Mdeg = 357.52911 + T * (35999.05029 - 0.0001537 * T);
    Mdeg = ((Mdeg % 360) + 360) % 360;

    // 5. Eccentricity of Earth’s Orbit (e)
    const e =
        0.016708634 -
        T * (0.000042037 + 0.0000001267 * T);

    // 6. Sun’s Equation of Center (C, in degrees)
    const Mrad = toRad(Mdeg);
    const C =
        (1.914602 - T * (0.004817 + 0.000014 * T)) * Math.sin(Mrad) +
        (0.019993 - 0.000101 * T) * Math.sin(2 * Mrad) +
        0.000289 * Math.sin(3 * Mrad);

    // 7. Sun’s True Longitude (θ = L0 + C, in degrees)
    const theta = L0 + C;

    // 8. Sun’s True Anomaly (v, in degrees) = M + C  (not used below, except for distance)
    const v = Mdeg + C;

    // 9. Sun’s Radius Vector (distance, in AU) [not needed for RA/Dec]
    // const R =
    //   (1.000001018 * (1 - e * e)) /
    //   (1 + e * Math.cos(toRad(v)));

    // 10. Sun’s Apparent Longitude (λ, in degrees)
    //     – account for nutation: λ = θ − 0.00569° − 0.00478° sin(Ω)
    //       where Ω = 125.04° − 1934.136° T
    const omega = 125.04 - 1934.136 * T;
    const lambda = theta - 0.00569 - 0.00478 * Math.sin(toRad(omega));

    // 11. Mean Obliquity of the Ecliptic (ε₀, in arcseconds)
    //     – ε₀ = 23° 26′ 21.448″ − 46.815″ T − 0.00059″ T² + 0.001813″ T³
    const U = T / 100;
    // Using series: ε₀ in degrees
    const eps0 =
        23 +
        (26 +
            (21.448 -
                T * (46.815 + T * (0.00059 - T * 0.001813))) /
            60) /
        60;

    // 12. Corrected Obliquity (ε, in degrees)
    const eps = eps0 + 0.00256 * Math.cos(toRad(omega));

    // 13. Sun’s Declination (δ, in degrees)
    //     – δ = arcsin( sin ε ⋅ sin λ )
    const epsRad = toRad(eps);
    const lambdaRad = toRad(lambda);
    const sinDelta = Math.sin(epsRad) * Math.sin(lambdaRad);
    const deltaRad = Math.asin(sinDelta);
    const declination = toDeg(deltaRad);

    // 14. Sun’s Right Ascension (α, in degrees)
    //     – α = arctan2( cos ε ⋅ sin λ , cos λ )
    const cosLambda = Math.cos(lambdaRad);
    const y = Math.cos(epsRad) * Math.sin(lambdaRad);
    const x = cosLambda;
    let alphaRad = Math.atan2(y, x);
    // Convert from [−π, +π] to [0, 2π) before degrees
    if (alphaRad < 0) {
        alphaRad += 2 * Math.PI;
    }
    const rightAscension = toDeg(alphaRad);

    return {
        rightAscension,
        declination,
    };
}

export function raDecToUnitVector(raDeg: number, decDeg: number, radius: number): { x: number, y: number, z: number } {
    const raRad = (raDeg * Math.PI) / 180;
    const decRad = (decDeg * Math.PI) / 180;

    const x = radius*Math.cos(decRad) * Math.cos(raRad);
    const y = radius*Math.cos(decRad) * Math.sin(raRad);
    const z = radius*Math.sin(decRad);

    return { x, y, z }; // unit vector pointing toward the Sun
}

function formatRA(raDegrees: number): string {
    let totalSeconds = (raDegrees / 15) * 3600;
    const hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${pad(hours)}h ${pad(minutes)}m ${pad(seconds.toFixed(2))}s`;
}

function formatDec(decDegrees: number): string {
    const sign = decDegrees >= 0 ? '+' : '−';
    let absDegrees = Math.abs(decDegrees);
    const degrees = Math.floor(absDegrees);
    absDegrees = (absDegrees - degrees) * 60;
    const minutes = Math.floor(absDegrees);
    const seconds = ((absDegrees - minutes) * 60).toFixed(2);

    return `${sign}${pad(degrees)}° ${pad(minutes)}′ ${pad(seconds)}″`;
}

function pad(n: number | string): string {
    return n.toString().padStart(2, '0');
}

export function currentSunSats(d: Date) {
    const { rightAscension, declination } = getSunCelestialCoords(d);
    console.log(`${formatRA(rightAscension)} , ${formatDec(declination)}`);
}
