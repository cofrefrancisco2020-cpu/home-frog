'use strict';
(() => {
  const $ = (q) => document.querySelector(q);
  const $$ = (q) => [...document.querySelectorAll(q)];
  const phone = '56992689126';
  const money = (value) => '$' + new Intl.NumberFormat('es-CL').format(value);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const root = document.documentElement;
  let paused = reducedMotion.matches;
  const motionButton = $('#motion-toggle');
  const syncMotion = () => {
    root.classList.toggle('motion-paused', paused);
    root.classList.toggle('user-motion-enabled', !paused);
    motionButton.setAttribute('aria-pressed', String(paused));
    motionButton.innerHTML = paused ? 'Activar movimiento <span aria-hidden="true">▷</span>' : 'Pausar movimiento <span aria-hidden="true">Ⅱ</span>';
  };
  motionButton.addEventListener('click', () => { paused = !paused; syncMotion(); });
  reducedMotion.addEventListener('change', (e) => { paused = e.matches; syncMotion(); });
  syncMotion();
  if ('IntersectionObserver' in window) {
    root.classList.add('js-motion');
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), { threshold: 0.08 });
    $$('.reveal').forEach((el) => observer.observe(el));
  }
  const menu = $('.menu-button');
  const nav = $('#nav');
  const closeMenu = () => { menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label', 'Abrir menú'); nav.classList.remove('open'); };
  menu.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open)); menu.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú'); nav.classList.toggle('open', open);
  });
  $$('#nav a').forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
  document.addEventListener('click', (e) => { if (!e.target.closest('.site-header')) closeMenu(); });

  const stage = $('#cleaning-stage');
  const dirtyPhoto = $('#dirty-photo');
  const range = $('#compare-range');
  const line = $('#compare-line');
  const canvas = $('#clean-canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  const cursor = $('.brush-cursor');
  const caption = $('#stage-caption');
  const instruction = $('#experience-instruction');
  const reset = $('#reset-clean');
  let mode = 'compare';
  let brushDown = false;
  let lastPoint = null;
  let progressMoves = 0;
  const dirtyImage = new Image();
  dirtyImage.src = dirtyPhoto.src;
  const setCompare = () => {
    const value = Number(range.value);
    dirtyPhoto.style.clipPath = `inset(0 ${100 - value}% 0 0)`;
    line.style.left = value + '%';
    range.setAttribute('aria-valuetext', `${value}% antes, ${100 - value}% después`);
    $('#tag-before').style.opacity = value < 10 ? '0' : '1';
  };
  range.addEventListener('input', setCompare);
  const drawDirty = () => {
    if (!ctx || !dirtyImage.complete || !dirtyImage.naturalWidth) return;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const rect = stage.getBoundingClientRect();
    canvas.width = Math.round(rect.width * ratio); canvas.height = Math.round(rect.height * ratio);
    ctx.globalCompositeOperation = 'source-over';
    const scale = Math.max(canvas.width / dirtyImage.naturalWidth, canvas.height / dirtyImage.naturalHeight);
    const w = dirtyImage.naturalWidth * scale, h = dirtyImage.naturalHeight * scale;
    ctx.drawImage(dirtyImage, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
    progressMoves = 0; lastPoint = null;
  };
  const setMode = (newMode) => {
    mode = newMode;
    const cleanMode = mode === 'clean' && !!ctx;
    $$('.mode-switch button').forEach((btn) => btn.setAttribute('aria-pressed', String(btn.dataset.mode === (cleanMode ? 'clean' : 'compare'))));
    stage.classList.toggle('is-clean-mode', cleanMode);
    canvas.hidden = !cleanMode; dirtyPhoto.hidden = cleanMode; range.hidden = cleanMode; line.hidden = cleanMode; reset.hidden = !cleanMode;
    $('#tag-before').style.opacity = '1';
    if (cleanMode) {
      drawDirty(); caption.textContent = '✧ Mantén presionado y limpia con tu dedo o mouse.';
      instruction.textContent = 'Borra las manchas y descubre tu alfombra.';
    } else {
      caption.textContent = '↔ Desliza. Un pequeño gesto, una gran diferencia.';
      instruction.textContent = 'Mueve el control para descubrir el cambio.';
      setCompare();
    }
  };
  $$('.mode-switch button').forEach((btn) => btn.addEventListener('click', () => setMode(btn.dataset.mode)));
  dirtyImage.addEventListener('load', () => { if (mode === 'clean') drawDirty(); });
  reset.addEventListener('click', () => { drawDirty(); instruction.textContent = 'Borra las manchas y descubre tu alfombra.'; });
  $('#clean-all').addEventListener('click', () => {
    if (mode === 'clean' && ctx) { ctx.clearRect(0, 0, canvas.width, canvas.height); instruction.textContent = '¡Así se siente empezar de nuevo! Cotiza tu limpieza.'; }
    else { range.value = '0'; setCompare(); }
  });
  const brush = (event) => {
    const rect = canvas.getBoundingClientRect();
    const point = { x: (event.clientX - rect.left) * canvas.width / rect.width, y: (event.clientY - rect.top) * canvas.height / rect.height };
    cursor.style.left = (event.clientX - rect.left) + 'px'; cursor.style.top = (event.clientY - rect.top) + 'px'; cursor.classList.add('active');
    if (!brushDown || !ctx) return;
    const radius = canvas.width / rect.width * 38;
    ctx.globalCompositeOperation = 'destination-out'; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.lineWidth = radius * 2;
    ctx.beginPath(); ctx.moveTo(lastPoint?.x ?? point.x, lastPoint?.y ?? point.y); ctx.lineTo(point.x + .01, point.y + .01); ctx.stroke();
    lastPoint = point;
    if (++progressMoves % 35 === 0) {
      const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let transparent = 0, total = 0;
      for (let i = 3; i < pixels.length; i += 400) { if (pixels[i] < 128) transparent++; total++; }
      const percent = Math.round(transparent / total * 100);
      instruction.textContent = percent > 65 ? '¡Vaya cambio! Ahora hagámoslo en tu hogar.' : `Ya descubriste el ${percent}% de la imagen. ¡Sigue limpiando!`;
    }
  };
  canvas.addEventListener('pointerdown', (event) => { if (!ctx) return; brushDown = true; lastPoint = null; canvas.setPointerCapture(event.pointerId); brush(event); });
  canvas.addEventListener('pointermove', brush);
  const stopBrush = () => { brushDown = false; lastPoint = null; cursor.classList.remove('active'); };
  canvas.addEventListener('pointerup', stopBrush); canvas.addEventListener('pointercancel', stopBrush); canvas.addEventListener('pointerleave', () => cursor.classList.remove('active'));
  let resizeTimer;
  window.addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(() => { if (mode === 'clean') drawDirty(); }, 200); });

  const catalog = {
    alfombras: { name: 'Alfombras', items: [{ id: 'promo', label: 'Alfombra hasta 2,50 m', price: 24990 }, { id: 'otro', label: 'Otra medida / consultar', price: null }], note: 'Incluye retiro y entrega en sectores de cobertura. Confirma la medida y la promoción.' },
    colchones: { name: 'Colchones', items: [{ id: '1plaza', label: '1 plaza / 1½ plazas', price: 29990 }, { id: '2plazas', label: '2 plazas', price: 34990 }, { id: 'king', label: 'King', price: 39990 }, { id: 'superking', label: 'Super King', price: 44990 }], note: 'El equipo confirma el método de limpieza, las condiciones y el valor final.' },
    tapices: { name: 'Sillas y sofás', items: [{ id: 'asiento', label: 'Silla: solo asiento', price: 4000 }, { id: 'respaldo', label: 'Silla: asiento y respaldo', price: 4500 }, { id: 'completa', label: 'Silla completa', price: 5000 }, { id: 'sitial', label: 'Silla tipo sitial', price: 6500 }, { id: 'sofa', label: 'Sofá / consultar', price: null }], note: 'Valores por unidad. En sofás, envíanos una foto e indica el número de cuerpos.' },
    lavanderia: { name: 'Lavandería', items: [{ id: 'cobertor', label: 'Cobertor', price: null }, { id: 'frazada', label: 'Frazada', price: null }, { id: 'colcha', label: 'Colcha', price: null }, { id: 'sabanas', label: 'Sábanas / fundas', price: null }], note: 'Consulta el valor según tamaño y tipo de prenda. Horario publicado: lunes a sábado, 09:00 a 18:30.' },
    profunda: { name: 'Limpieza profunda', items: [{ id: 'hogar', label: 'Casa o departamento', price: null }, { id: 'oficina', label: 'Oficina o local', price: null }, { id: 'industrial', label: 'Espacio industrial', price: null }, { id: 'vidrios', label: 'Vidrios / espacio específico', price: null }], note: 'Coordinamos una evaluación del espacio para preparar una cotización a tu medida.' }
  };
  const serviceSelect = $('#service'), variantSelect = $('#variant'), quantityInput = $('#quantity'), zoneSelect = $('#zone');
  const updateQuote = () => {
    const item = catalog[serviceSelect.value].items.find((item) => item.id === variantSelect.value);
    const quantity = Number(quantityInput.value);
    $('#quote-total').textContent = item?.price && Number.isInteger(quantity) && quantity >= 1 && quantity <= 30 ? money(item.price * quantity) : 'A cotizar';
    $('#quote-note').textContent = catalog[serviceSelect.value].note;
    $('#form-status').textContent = '';
  };
  const selectService = (id) => {
    if (!catalog[id]) return;
    serviceSelect.value = id; variantSelect.replaceChildren();
    catalog[id].items.forEach((item) => { const option = document.createElement('option'); option.value = item.id; option.textContent = item.label; variantSelect.append(option); });
    updateQuote();
  };
  serviceSelect.addEventListener('change', () => selectService(serviceSelect.value));
  [variantSelect, quantityInput, zoneSelect].forEach((el) => el.addEventListener('input', updateQuote));
  $$('[data-service]').forEach((el) => el.addEventListener('click', () => { selectService(el.dataset.service); if (el.tagName === 'BUTTON') $('#cotizar').scrollIntoView({ behavior: paused ? 'instant' : 'smooth' }); }));
  const waUrl = (message) => `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  $$('.wa-link').forEach((link) => { link.href = waUrl(link.dataset.message); });
  $('#quote-form').addEventListener('submit', (event) => {
    event.preventDefault();
    if (!$('#quote-form').reportValidity()) return;
    const service = catalog[serviceSelect.value]; const item = service.items.find((item) => item.id === variantSelect.value);
    const quantity = Number(quantityInput.value);
    const lines = ['Hola Home Frog, quiero cotizar una limpieza.', `Servicio: ${service.name}`, `Tipo: ${item.label}`, `Cantidad: ${quantity}`, `Sector: ${zoneSelect.value || 'Por confirmar'}`];
    if (item.price) lines.push(`Valor referencial: ${money(item.price * quantity)} CLP (sujeto a confirmación).`);
    lines.push('¿Me confirman el precio, las condiciones y la disponibilidad? Puedo enviarles fotos.');
    const url = waUrl(lines.join('\n'));
    const opened = window.open(url, '_blank', 'noopener,noreferrer');
    const status = $('#form-status'); status.replaceChildren(document.createTextNode('Tu consulta está preparada. Si WhatsApp no se abrió, '));
    const link = document.createElement('a'); link.href = url; link.target = '_blank'; link.rel = 'noopener'; link.textContent = 'abre tu consulta aquí'; status.append(link, document.createTextNode('.'));
  });
  const tabs = $$('[data-price-tab]');
  const activateTab = (tab) => {
    tabs.forEach((btn) => { btn.setAttribute('aria-selected', String(btn === tab)); btn.tabIndex = btn === tab ? 0 : -1; });
    const panel = $('#price-content'); panel.setAttribute('aria-labelledby', tab.id); panel.replaceChildren();
    catalog[tab.dataset.priceTab].items.filter((item) => item.price !== null).forEach((item) => {
      const row = document.createElement('div'); row.className = 'price-row';
      const label = document.createElement('span'); label.textContent = item.label;
      const price = document.createElement('strong'); price.textContent = money(item.price);
      row.append(label, price); panel.append(row);
    });
    if (tab.dataset.priceTab === 'alfombras') { const note = document.createElement('p'); note.className = 'smallprint'; note.textContent = 'Retiro y entrega en sectores de cobertura. Otras medidas y materiales: consultar evaluación.'; panel.append(note); }
  };
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activateTab(tab));
    tab.addEventListener('keydown', (event) => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next !== undefined) { event.preventDefault(); tabs[next].focus(); activateTab(tabs[next]); }
    });
  });
  $('#year').textContent = new Date().getFullYear();
  setCompare(); updateQuote();
})();
