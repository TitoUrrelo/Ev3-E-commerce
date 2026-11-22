import { useMemo, useState } from 'react'
import { PRODUCTS, PROFILES, SHIPPING, PAYMENTS, sizesFor, clp, recommend } from './data.js'

function Art({ p, big }) {
  return (
    <div className={'art' + (big ? ' art-big' : '')} style={{ '--hue': p.hue }} aria-hidden="true">
      <span>{p.cat}</span>
    </div>
  )
}

function Card({ p, reason, onOpen }) {
  return (
    <button className="card" onClick={() => onOpen(p.id)}>
      <Art p={p} />
      <h3>{p.name}</h3>
      <p className="price">{clp(p.price)}</p>
      {p.stock <= 5 && <p className="scarce">Quedan {p.stock} unidades</p>}
      {reason && <p className="why">Porque: {reason}</p>}
    </button>
  )
}

export default function App() {
  const [profile, setProfile] = useState('minero')
  const [view, setView] = useState({ name: 'home' })
  const [cart, setCart] = useState([])
  const [viewed, setViewed] = useState([])
  const [query, setQuery] = useState('')
  const [cat, setCat] = useState('Todos')

  const open = (id) => {
    setViewed((v) => [id, ...v.filter((x) => x !== id)].slice(0, 5))
    setView({ name: 'product', id })
    window.scrollTo(0, 0)
  }
  const go = (name) => { setView({ name }); window.scrollTo(0, 0) }
  const add = (id, size) => setCart((c) => {
    const i = c.findIndex((x) => x.id === id && x.size === size)
    if (i >= 0) return c.map((x, k) => (k === i ? { ...x, qty: x.qty + 1 } : x))
    return [...c, { id, size, qty: 1 }]
  })
  const count = cart.reduce((n, x) => n + x.qty, 0)
  const subtotal = cart.reduce((n, x) => n + x.qty * PRODUCTS.find((p) => p.id === x.id).price, 0)
  const seedIds = [...cart.map((x) => x.id), ...viewed]
  const P = PROFILES[profile]

  return (
    <div className="app" style={{ '--tone': P.tone, '--accent': P.accent, '--tint': P.tint }}>
      <header className="top">
        <button className="logo" onClick={() => go('home')}>AtacamaPro</button>
        <input className="search" placeholder="Busca botas, lentes, parkas" value={query}
          onChange={(e) => { setQuery(e.target.value); setView({ name: 'home' }) }} aria-label="Buscar productos" />
        <div className="profile" role="group" aria-label="Perfil de cliente">
          {Object.entries(PROFILES).map(([k, v]) => (
            <button key={k} className={k === profile ? 'on' : ''} onClick={() => setProfile(k)}>{v.label}</button>
          ))}
        </div>
        <button className="cartbtn" onClick={() => go('cart')}>Carro ({count})</button>
      </header>

      <main>
        {view.name === 'home' && <Home {...{ P, profile, seedIds, query, cat, setCat, open }} />}
        {view.name === 'product' && <Detail id={view.id} {...{ profile, seedIds, open, add, go }} />}
        {view.name === 'cart' && <Cart {...{ cart, setCart, subtotal, go, profile, seedIds, open }} />}
        {view.name === 'checkout' && <Checkout {...{ cart, subtotal, go, clear: () => setCart([]) }} />}
      </main>

      <footer className="foot">
        <p>AtacamaPro es un mockup académico. Pago seguro con Webpay Plus, Flow y Mercado Pago. Despacho a todo Chile.</p>
      </footer>
    </div>
  )
}

function Home({ P, profile, seedIds, query, cat, setCat, open }) {
  const recs = useMemo(() => recommend({ profile, seedIds, limit: 4 }), [profile, seedIds.join()])
  const cats = ['Todos', ...new Set(PRODUCTS.map((p) => p.cat))]
  const list = PRODUCTS.filter((p) => (cat === 'Todos' || p.cat === cat) && p.name.toLowerCase().includes(query.toLowerCase()))
  const top = [...PRODUCTS].sort((a, b) => b.pop - a.pop).slice(0, 3)
  return (
    <>
      <section className="hero" style={{ backgroundImage: `url(${P.img})` }}>
        <div className="hero-shade" />
        <div className="hero-body">
        <p className="hero-for">Tienda para perfil {P.label.toLowerCase()}</p>
        <h1>{P.title}</h1>
        <p>{P.sub}</p>
        <button className="cta" onClick={() => document.getElementById('catalogo').scrollIntoView({ behavior: 'smooth' })}>Ver catálogo</button>
        </div>
      </section>
      <ul className="trust">
        <li>Pago seguro</li><li>Despacho a todo Chile</li><li>Retiro en Calama</li><li>Garantía de 6 meses</li>
      </ul>
      <section>
        <h2>Recomendado para ti</h2>
        <p className="muted">Combinamos lo que miras y compras con lo que eligen clientes similares.</p>
        <div className="grid">{recs.map((p) => <Card key={p.id} p={p} reason={p.reason} onOpen={open} />)}</div>
      </section>
      <section>
        <h2>Lo más vendido esta semana</h2>
        <div className="grid g3">{top.map((p) => <Card key={p.id} p={p} onOpen={open} />)}</div>
      </section>
      <section id="catalogo">
        <h2>Catálogo</h2>
        <div className="chips">
          {cats.map((c) => <button key={c} className={c === cat ? 'on' : ''} onClick={() => setCat(c)}>{c}</button>)}
        </div>
        {list.length === 0 ? <p className="muted">No encontramos productos con esa búsqueda. Prueba con otra palabra o quita el filtro.</p>
          : <div className="grid">{list.map((p) => <Card key={p.id} p={p} onOpen={open} />)}</div>}
      </section>
    </>
  )
}

function Detail({ id, profile, seedIds, open, add, go }) {
  const p = PRODUCTS.find((x) => x.id === id)
  const sizes = sizesFor(p.cat)
  const [size, setSize] = useState(sizes[0])
  const [added, setAdded] = useState(false)
  const complete = p.bought.map((b) => PRODUCTS.find((x) => x.id === b))
  const recs = recommend({ profile, seedIds: [id], excludeIds: p.bought, limit: 3 })
  return (
    <>
      <button className="back" onClick={() => go('home')}>Volver al catálogo</button>
      <section className="detail">
        <Art p={p} big />
        <div>
          <p className="muted">{p.cat}</p>
          <h1>{p.name}</h1>
          <p className="price big">{clp(p.price)}</p>
          {p.stock <= 5 && <p className="scarce">Quedan {p.stock} unidades</p>}
          <p className="muted">Etiquetas: {p.tags.join(', ')}</p>
          <label className="field">Talla
            <select value={size} onChange={(e) => setSize(e.target.value)}>{sizes.map((s) => <option key={s}>{s}</option>)}</select>
          </label>
          <button className="cta" onClick={() => { add(p.id, size); setAdded(true) }}>Agregar al carro</button>
          {added && <p className="ok" role="status">Agregado al carro. <button className="link" onClick={() => go('cart')}>Ir al carro</button></p>}
        </div>
      </section>
      <section>
        <h2>Completa tu equipo</h2>
        <p className="muted">Clientes que compraron este producto también llevaron:</p>
        <div className="grid g3">{complete.map((x) => <Card key={x.id} p={x} onOpen={open} />)}</div>
      </section>
      <section>
        <h2>Te puede interesar</h2>
        <div className="grid g3">{recs.map((x) => <Card key={x.id} p={x} reason={x.reason} onOpen={open} />)}</div>
      </section>
    </>
  )
}

function Cart({ cart, setCart, subtotal, go, profile, seedIds, open }) {
  const recs = recommend({ profile, seedIds, limit: 3 })
  const upd = (i, d) => setCart((c) => c.map((x, k) => (k === i ? { ...x, qty: Math.max(1, x.qty + d) } : x)))
  if (!cart.length) return (
    <section><h1>Tu carro está vacío</h1><p className="muted">Agrega productos desde el catálogo para continuar.</p>
      <button className="cta" onClick={() => go('home')}>Ver catálogo</button></section>
  )
  return (
    <>
      <h1>Tu carro</h1>
      <div className="cols">
        <div>
          {cart.map((x, i) => {
            const p = PRODUCTS.find((q) => q.id === x.id)
            return (
              <div className="line" key={i}>
                <Art p={p} />
                <div><h3>{p.name}</h3><p className="muted">Talla {x.size}</p>
                  <div className="qty"><button onClick={() => upd(i, -1)} aria-label="Quitar uno">-</button><span>{x.qty}</span><button onClick={() => upd(i, 1)} aria-label="Agregar uno">+</button>
                    <button className="link" onClick={() => setCart((c) => c.filter((_, k) => k !== i))}>Eliminar</button></div></div>
                <p className="price">{clp(p.price * x.qty)}</p>
              </div>
            )
          })}
          <h2>Antes de pagar</h2>
          <div className="grid g3">{recs.map((p) => <Card key={p.id} p={p} reason={p.reason} onOpen={open} />)}</div>
        </div>
        <aside className="sum">
          <h2>Resumen</h2>
          <p className="row"><span>Subtotal</span><span>{clp(subtotal)}</span></p>
          <p className="muted">El despacho se calcula en el siguiente paso.</p>
          <button className="cta wide" onClick={() => go('checkout')}>Continuar a pagar</button>
        </aside>
      </div>
    </>
  )
}

function Checkout({ cart, subtotal, go, clear }) {
  const [step, setStep] = useState(1)
  const [f, setF] = useState({ name: '', email: '', address: '', city: 'Calama' })
  const [ship, setShip] = useState('chile')
  const [pay, setPay] = useState('webpay')
  const [err, setErr] = useState('')
  const [order] = useState(() => 'AP-' + Math.floor(100000 + Math.random() * 900000))
  const sh = SHIPPING.find((s) => s.id === ship)
  const total = subtotal + sh.price
  const steps = ['Datos', 'Despacho', 'Pago']
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const next = () => {
    if (step === 1 && (!f.name || !f.email.includes('@') || !f.address)) return setErr('Completa tu nombre, un correo válido y tu dirección.')
    setErr(''); setStep(step + 1)
  }
  if (step === 4) return (
    <section className="done">
      <h1>Pedido confirmado</h1>
      <p>Tu número de pedido es <strong>{order}</strong>. Enviamos el comprobante a {f.email}.</p>
      <p className="muted">{sh.name}: {sh.eta}. Pagado con {PAYMENTS.find((x) => x.id === pay).name}. Total {clp(total)}.</p>
      <button className="cta" onClick={() => { clear(); go('home') }}>Seguir comprando</button>
    </section>
  )
  return (
    <>
      <h1>Finalizar compra</h1>
      <ol className="steps">{steps.map((s, i) => <li key={s} className={step === i + 1 ? 'on' : step > i + 1 ? 'past' : ''}>{s}</li>)}</ol>
      <div className="cols">
        <div className="panel">
          {step === 1 && (<>
            <label className="field">Nombre completo<input value={f.name} onChange={set('name')} /></label>
            <label className="field">Correo<input type="email" value={f.email} onChange={set('email')} /></label>
            <label className="field">Dirección<input value={f.address} onChange={set('address')} /></label>
            <label className="field">Ciudad<input value={f.city} onChange={set('city')} /></label>
          </>)}
          {step === 2 && SHIPPING.map((s) => (
            <label key={s.id} className={'opt' + (ship === s.id ? ' on' : '')}>
              <input type="radio" name="ship" checked={ship === s.id} onChange={() => setShip(s.id)} />
              <span><strong>{s.name}</strong><br /><small>{s.eta}</small></span><span>{s.price ? clp(s.price) : 'Gratis'}</span>
            </label>))}
          {step === 3 && (<>
            {PAYMENTS.map((m) => (
              <label key={m.id} className={'opt' + (pay === m.id ? ' on' : '')}>
                <input type="radio" name="pay" checked={pay === m.id} onChange={() => setPay(m.id)} />
                <span><strong>{m.name}</strong><br /><small>{m.note}</small></span>
              </label>))}
            <p className="secure">Conexión cifrada. No guardamos los datos de tu tarjeta.</p>
          </>)}
          {err && <p className="err" role="alert">{err}</p>}
          <div className="nav">
            {step > 1 && <button className="ghost" onClick={() => setStep(step - 1)}>Volver</button>}
            {step < 3 ? <button className="cta" onClick={next}>Continuar</button> : <button className="cta pay" onClick={() => setStep(4)}>Pagar {clp(total)}</button>}
          </div>
        </div>
        <aside className="sum">
          <h2>Tu pedido</h2>
          {cart.map((x, i) => { const p = PRODUCTS.find((q) => q.id === x.id); return <p className="row" key={i}><span>{x.qty} x {p.name}</span><span>{clp(p.price * x.qty)}</span></p> })}
          <p className="row"><span>Despacho</span><span>{sh.price ? clp(sh.price) : 'Gratis'}</span></p>
          <p className="row total"><span>Total</span><span>{clp(total)}</span></p>
        </aside>
      </div>
    </>
  )
}
