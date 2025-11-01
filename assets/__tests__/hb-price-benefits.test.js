import helpers from '../hb-price-benefits.js';
import { describe, expect, test, beforeEach } from 'vitest';

const { compute, update } = helpers;

function textContent(element) {
  return element.textContent.replace(/\u00a0/g, ' ').trim();
}

describe('hb-price-benefits helpers', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  test('compute returns expected totals without interest for up to 6 installments', () => {
    const result = compute(120000, 6);
    expect(result).toEqual({ count: 6, rate: 0, total: 120000, per: 20000 });
  });

  test('compute applies rates and rounds the per-installment value', () => {
    const { rate, per, total } = compute(10001, 7);
    expect(rate).toBeCloseTo(helpers.RATES[7]);
    expect(total).toBe(Math.round(10001 * (1 + helpers.RATES[7])));
    expect(per).toBe(Math.round(total / 7));
  });

  test('update writes formatted values and table rows to the DOM', () => {
    const root = document.createElement('div');
    root.innerHTML = `
      <span class="hb-benefits__price"></span>
      <span class="hb-benefits__installments"></span>
      <span class="hb-benefits__points"></span>
      <table><tbody data-hb-table-body></tbody></table>
    `;

    update(root, 123456);

    expect(root.dataset.hbPrice).toBe('123456');

    const price = textContent(root.querySelector('.hb-benefits__price'));
    expect(price.startsWith('R$')).toBe(true);
    expect(price).toContain('1.234,56');

    const installments = textContent(root.querySelector('.hb-benefits__installments'));
    expect(installments).toContain('6x');

    const points = textContent(root.querySelector('.hb-benefits__points'));
    expect(points).toContain('1234');

    const rows = root.querySelectorAll('[data-hb-table-body] tr');
    expect(rows).toHaveLength(12);
    expect(rows[5].classList.contains('hb-benefits__row--highlight')).toBe(true);
  });
});
