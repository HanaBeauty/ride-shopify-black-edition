((global, factory) => {
  const helpers = factory(global);

  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = helpers;
  } else {
    global.hbPriceBenefits = helpers;
    if (helpers && typeof helpers.autoStart === 'function') {
      helpers.autoStart(global.document);
    }
  }
})(typeof globalThis !== 'undefined' ? globalThis : window, (global) => {
  const documentRef = global?.document;

  const RATES = { 7: 0.0748, 8: 0.081, 9: 0.0872, 10: 0.0917, 11: 0.0979, 12: 0.1042 };
  const formatBRL = (() => {
    try {
      const formatter = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
      });
      return (cents) => formatter.format((Number(cents) || 0) / 100);
    } catch (error) {
      return (cents) => {
        const value = (Number(cents) || 0) / 100;
        return `R$ ${value.toFixed(2).replace('.', ',')}`;
      };
    }
  })();

  function compute(priceCents, count) {
    const rate = count <= 6 ? 0 : RATES[count] || 0;
    const total = Math.round(priceCents * (1 + rate));
    const per = Math.round(total / count);
    return { count, rate, per, total };
  }

  function parseInstallmentsJSON(raw) {
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : null;
    } catch (error) {
      return null;
    }
  }

  function normalizeInstallments(installments) {
    if (!Array.isArray(installments)) return null;

    return installments
      .map((installment, index) => {
        const count = Number(
          installment?.count ??
            installment?.installments ??
            installment?.installment ??
            installment?.quantity ??
            installment?.times ??
            index + 1,
        );
        const per = Number(installment?.amount ?? 0);
        const total = Number(installment?.total ?? per * (Number.isFinite(count) ? count : index + 1));
        const rate = Number(installment?.rate ?? 0);

        return {
          count: Number.isFinite(count) ? count : index + 1,
          per: Number.isFinite(per) ? per : 0,
          total: Number.isFinite(total) ? total : 0,
          rate: Number.isFinite(rate) ? rate : 0,
        };
      })
      .filter((installment) => installment.total > 0 || installment.per > 0);
  }

  function renderTable(tbody, priceCents, installments) {
    if (!tbody) return;
    const doc = tbody.ownerDocument || documentRef;
    if (!doc) return;

    tbody.innerHTML = '';

    const rows = normalizeInstallments(installments);
    const hasGatewayData = Array.isArray(rows) && rows.length > 0;

    const tableRows = hasGatewayData
      ? rows
      : Array.from({ length: 12 }, (_, index) => compute(priceCents, index + 1));

    tableRows.forEach((row, index) => {
      const count = row.count || index + 1;
      const rate = typeof row.rate === 'number' ? row.rate : 0;
      const per = row.per;
      const total = row.total || per * count;
      const tr = doc.createElement('tr');
      if (count === 6) {
        tr.classList.add('hb-benefits__row--highlight');
      }

      const tdCount = doc.createElement('td');
      tdCount.textContent = `${count}x`;
      tr.appendChild(tdCount);

      const tdPer = doc.createElement('td');
      tdPer.textContent = formatBRL(per);
      tr.appendChild(tdPer);

      const tdTotal = doc.createElement('td');
      tdTotal.textContent = formatBRL(total);
      tr.appendChild(tdTotal);

      const tdRate = doc.createElement('td');
      tdRate.textContent = rate === 0 ? 'sem juros' : `${(rate * 100).toFixed(2).replace('.', ',')}%`;
      tr.appendChild(tdRate);

      tbody.appendChild(tr);
    });
  }

  function renderSummary(root, priceCents) {
    const priceEl = root.querySelector('.hb-benefits__price');
    const installmentsEl = root.querySelector('.hb-benefits__installments');
    const pointsEl = root.querySelector('.hb-benefits__points');

    const six = Math.round(priceCents / 6);
    const points = Math.floor(priceCents / 100);

    if (priceEl) priceEl.textContent = formatBRL(priceCents);
    if (installmentsEl) installmentsEl.textContent = ` ou 6x de ${formatBRL(six)}`;
    if (pointsEl) pointsEl.textContent = ` e ganhe ${points} pontos`;
  }

  function update(root, priceCents, installments) {
    const normalized = Number(priceCents);
    if (Number.isNaN(normalized) || !root) return;

    root.dataset.hbPrice = String(normalized);
    renderSummary(root, normalized);
    const normalizedInstallments = normalizeInstallments(installments) || normalizeInstallments(parseInstallmentsJSON(root?.dataset?.hbInstallments));
    renderTable(root.querySelector('[data-hb-table-body]'), normalized, normalizedInstallments);
  }

  function attachVariantListeners(root, doc = documentRef) {
    if (!doc) return;

    const handler = (event) => {
      const variant = event?.detail?.variant;
      if (variant && typeof variant.price === 'number') {
        update(root, variant.price, variant.installments);
      }
    };

    doc.addEventListener('variant:change', handler);
    doc.addEventListener('theme:variant:change', handler);
    doc.addEventListener('product:variant-change', handler);
  }

  function init(root, doc = documentRef) {
    if (!root) return;

    const priceCents = Number(root.dataset.hbPrice || 0) || 0;
    update(root, priceCents);
    attachVariantListeners(root, doc);
  }

  function start(doc = documentRef) {
    if (!doc) return;
    doc.querySelectorAll('[data-hb-benefits]').forEach((root) => init(root, doc));
  }

  function autoStart(doc = documentRef) {
    if (!doc) return;

    const run = () => start(doc);

    if (doc.readyState === 'loading') {
      doc.addEventListener('DOMContentLoaded', run);
    } else {
      run();
    }
  }

  return {
    RATES,
    formatBRL,
    compute,
    renderTable,
    renderSummary,
    update,
    attachVariantListeners,
    init,
    start,
    autoStart,
  };
});
