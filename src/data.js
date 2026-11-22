import imgMinero from './assets/hero-minero.jpg'
import imgTurista from './assets/hero-turista.jpg'
import imgDeportista from './assets/hero-deportista.jpg'

// img: foto del banner. tone: color oscuro tomado de la foto (superpuesto al banner y usado en la interfaz).
// accent: color vivo de la foto para botones. tint: versión muy clara para el fondo de la página.
export const PROFILES = {
  minero: {
    label: 'Minero',
    title: 'Equipo para turnos largos en faena',
    sub: 'Calzado y ropa certificados, con despacho a Calama y faenas de la región.',
    tags: ['seguridad', 'turno', 'polvo'],
    img: imgMinero, tone: '#3B3224', accent: '#E8952D', tint: '#F4F1EB',
  },
  turista: {
    label: 'Turista',
    title: 'Prepárate para San Pedro y el altiplano',
    sub: 'Protección UV, abrigo para la noche y todo lo que cabe en una mochila.',
    tags: ['uv', 'sol', 'turismo'],
    img: imgTurista, tone: '#4B2A33', accent: '#F2A24E', tint: '#F8F0EC',
  },
  deportista: {
    label: 'Deportista',
    title: 'Trekking a 4.000 metros, sin sorpresas',
    sub: 'Abrigo, hidratación y calzado probados en altura.',
    tags: ['trekking', 'altura', 'frio'],
    img: imgDeportista, tone: '#6A2D1E', accent: '#EE7F4B', tint: '#F9EFEA',
  },
}

// bought = ids que otros clientes compraron junto con este producto (filtrado colaborativo simulado)
export const PRODUCTS = [
  { id: 1, name: 'Botín de seguridad punta composite', cat: 'Calzado', price: 64990, stock: 4, pop: 0.9, tags: ['seguridad', 'calzado', 'polvo', 'turno'], hue: '#6B4F2A', bought: [2, 3, 9] },
  { id: 2, name: 'Calcetines técnicos anti-ampollas', cat: 'Accesorios', price: 12990, stock: 40, pop: 0.7, tags: ['calzado', 'trekking', 'turno'], hue: '#8A7A5C', bought: [1, 11] },
  { id: 3, name: 'Pantalón ignífugo de turno', cat: 'Ropa', price: 49990, stock: 12, pop: 0.8, tags: ['seguridad', 'turno', 'ropa'], hue: '#2A3B52', bought: [1, 4, 9] },
  { id: 4, name: 'Polerón UV50+ manga larga', cat: 'Ropa', price: 29990, stock: 25, pop: 0.85, tags: ['uv', 'ropa', 'turismo', 'turno', 'sol'], hue: '#C8842B', bought: [5, 6, 12] },
  { id: 5, name: 'Gorro legionario con filtro UV', cat: 'Accesorios', price: 14990, stock: 3, pop: 0.6, tags: ['uv', 'turismo', 'sol'], hue: '#A6926B', bought: [4, 6, 12] },
  { id: 6, name: 'Lentes polarizados UV400', cat: 'Accesorios', price: 24990, stock: 18, pop: 0.75, tags: ['uv', 'turismo', 'sol', 'trekking'], hue: '#3F4A56', bought: [5, 4, 12] },
  { id: 7, name: 'Parka térmica hasta -10 °C', cat: 'Ropa', price: 89990, stock: 6, pop: 0.65, tags: ['frio', 'altura', 'trekking', 'turismo', 'ropa'], hue: '#1F3A5F', bought: [8, 10] },
  { id: 8, name: 'Guantes térmicos de montaña', cat: 'Accesorios', price: 19990, stock: 15, pop: 0.5, tags: ['frio', 'altura', 'trekking'], hue: '#4C6A5A', bought: [7, 10, 11] },
  { id: 9, name: 'Lentes de seguridad antiempañantes', cat: 'Accesorios', price: 8990, stock: 50, pop: 0.55, tags: ['seguridad', 'polvo', 'turno'], hue: '#5B6770', bought: [1, 3] },
  { id: 10, name: 'Mochila de hidratación 15 L', cat: 'Equipamiento', price: 44990, stock: 9, pop: 0.6, tags: ['trekking', 'hidratacion', 'turismo', 'altura'], hue: '#7A4E3A', bought: [6, 7, 11] },
  { id: 11, name: 'Botas de trekking impermeables', cat: 'Calzado', price: 79990, stock: 2, pop: 0.7, tags: ['trekking', 'calzado', 'altura'], hue: '#5A4632', bought: [2, 10, 8] },
  { id: 12, name: 'Bloqueador solar FPS 50+ resistente', cat: 'Accesorios', price: 9990, stock: 60, pop: 0.95, tags: ['uv', 'sol', 'turismo', 'trekking'], hue: '#D9A441', bought: [5, 6, 4] },
]

export const SHIPPING = [
  { id: 'chile', name: 'Chilexpress', eta: '2 a 4 días hábiles', price: 5990 },
  { id: 'starken', name: 'Starken', eta: '3 a 5 días hábiles', price: 4990 },
  { id: 'retiro', name: 'Retiro en tienda, Calama', eta: 'Listo en 24 horas', price: 0 },
]

export const PAYMENTS = [
  { id: 'webpay', name: 'Webpay Plus', note: 'Tarjetas de crédito y débito' },
  { id: 'flow', name: 'Flow', note: 'Transferencia y tarjetas' },
  { id: 'mp', name: 'Mercado Pago', note: 'Cuenta o tarjeta' },
]

export const sizesFor = (cat) =>
  cat === 'Calzado' ? ['39', '40', '41', '42', '43'] : cat === 'Ropa' ? ['S', 'M', 'L', 'XL'] : ['Única']

export const clp = (n) => '$' + n.toLocaleString('es-CL')

// Sistema de recomendación híbrido ponderado:
// puntaje = 0,5 * contenido + 0,35 * colaborativo + 0,15 * popularidad
export function recommend({ profile, seedIds, excludeIds = [], limit = 4 }) {
  const seeds = PRODUCTS.filter((p) => seedIds.includes(p.id))
  const seedTags = new Set([...PROFILES[profile].tags, ...seeds.flatMap((p) => p.tags)])
  return PRODUCTS.filter((p) => !excludeIds.includes(p.id) && !seedIds.includes(p.id))
    .map((p) => {
      const shared = p.tags.filter((t) => seedTags.has(t))
      const content = shared.length / new Set([...p.tags, ...seedTags]).size
      const collab = seeds.length ? seeds.filter((s) => s.bought.includes(p.id)).length / seeds.length : 0
      const score = 0.5 * content * 3 + 0.35 * collab + 0.15 * p.pop
      let reason = `Es popular entre clientes de perfil ${PROFILES[profile].label.toLowerCase()}`
      if (collab > 0) reason = `Otros clientes lo compraron junto con ${seeds.find((s) => s.bought.includes(p.id)).name.toLowerCase()}`
      else if (shared.length) reason = `Coincide con tu interés en ${shared[0]}`
      return { ...p, score, reason }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}
