const MARR_API_KEY = process.env.MARR_API_KEY || 'marr_live_x3iqvmnb3hisirep';
const MARR_API_URL = `https://api-marr.vercel.app/api/rates?key=${MARR_API_KEY}`;

let cache = null;
let cacheTimestamp = 0;
const CACHE_TTL_MS = 30 * 1000;

export async function getRecomendedRate() {
    const now = Date.now();
    if (cache && now - cacheTimestamp < CACHE_TTL_MS) {
        return cache;
    }

    const response = await fetch(MARR_API_URL, { signal: AbortSignal.timeout(8000) });
    if (!response.ok) {
        throw new Error(`MARR API error: ${response.status}`);
    }
    const body = await response.json();
    if (body.status !== 'success' || body.data?.marketBuy == null) {
        throw new Error('MARR API response invalid');
    }

    const result = {
        buy: body.data.marketBuy,
        sale: body.data.marketSell,
        referenceAvg: (body.data.marketBuy + body.data.marketSell) / 2,
    };

    cache = result;
    cacheTimestamp = now;
    return result;
}
