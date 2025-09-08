export function parseGeo(value) {
  if (!value) return null;

  // case: object { lat, lon }
  if (typeof value === "object" && value.lat !== undefined && value.lon !== undefined) {
    return { lat: Number(value.lat), lon: Number(value.lon) };
  }

  // case: array [lon, lat] atau [lat, lon]
  if (Array.isArray(value) && value.length === 2) {
    const [a, b] = value.map(Number);
    // deteksi heuristik
    if (Math.abs(a) <= 90 && Math.abs(b) <= 180) return { lat: a, lon: b };
    return { lat: b, lon: a };
  }

  // case: string "lat,lon"
  if (typeof value === "string" && value.includes(",")) {
    const [p0, p1] = value.split(",").map(s => Number(s.trim()));
    if (Math.abs(p0) <= 90 && Math.abs(p1) <= 180) return { lat: p0, lon: p1 };
    return { lat: p1, lon: p0 };
  }

  return null;
}
