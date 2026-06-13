const FASTFOREX_API_KEY = process.env.FASTFOREX_API_KEY;
const BASE_URL = 'https://api.fastforex.io';
const CACHE_TTL_MS = 5 * 60 * 1000;
const FETCH_TIMEOUT_MS = 8000;
const FALLBACK_RATE = 3.75;

if (!FASTFOREX_API_KEY) {
  console.error('[FastForex] FASTFOREX_API_KEY no está definida en las variables de entorno');
}

let cache = { rate: null, timestamp: null };

async function fetchFromAPI() {
  const url = `${BASE_URL}/fetch-one?from=USD&to=PEN&api_key=${FASTFOREX_API_KEY}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}${res.statusText ? ` ${res.statusText}` : ''}`);
    }
    const data = await res.json();
    const rate = data?.result?.PEN;
    if (rate == null || typeof rate !== 'number') {
      throw new Error('Respuesta inválida de FastForex — no se encontró result.PEN');
    }
    return rate;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function getExchangeRate() {
  if (cache.rate != null && cache.timestamp && (Date.now() - cache.timestamp < CACHE_TTL_MS)) {
    return cache.rate;
  }

  try {
    const rate = await fetchFromAPI();
    cache = { rate, timestamp: Date.now() };
    console.log(`[FastForex] Tasa obtenida: 1 USD = ${rate} PEN`);
    return rate;
  } catch (err) {
    console.error(`[FastForex] Error al consultar API: ${err.message}`);
    if (cache.rate != null) {
      console.warn(`[FastForex] Usando tasa en caché (expirada): ${cache.rate}`);
      return cache.rate;
    }
    console.warn(`[FastForex] Usando tasa de fallback: ${FALLBACK_RATE}`);
    return FALLBACK_RATE;
  }
}

export function clearCache() {
  cache = { rate: null, timestamp: null };
  console.log('[FastForex] Caché limpiada');
}

export async function getHistoricalRate(dateStr) {
  const url = `${BASE_URL}/historical?date=${dateStr}&from=USD&to=PEN&api_key=${FASTFOREX_API_KEY}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data?.result?.PEN ?? null;
  } catch (err) {
    console.error(`[FastForex] Error obteniendo histórica para ${dateStr}: ${err.message}`);
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}
