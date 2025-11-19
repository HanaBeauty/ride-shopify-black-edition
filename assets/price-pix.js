document.addEventListener('DOMContentLoaded', function () {
  const pixPercent = parseFloat(document.body.dataset.pixPercent || '3') / 100;
  const currencyOptions = { style: 'currency', currency: 'BRL' };

  const formatCurrency = (value) => value.toLocaleString('pt-BR', currencyOptions);

  function parseVariantData(variantString) {
    if (!variantString) return null;

    try {
      return JSON.parse(variantString);
    } catch (error) {
      console.warn('PIX price: unable to parse variant data', error);
      return null;
    }
  }

  function updateWrapper(wrapper, variant) {
    if (!wrapper || !variant) return;

    const fullElem = wrapper.querySelector('.hana-price-full');
    const pixElem = wrapper.querySelector('.hana-price-pix .value');
    const fullValue = (variant.price || 0) / 100;

    if (fullElem) {
      fullElem.innerHTML = `${formatCurrency(fullValue)} em até 6x sem juros`;
    }

    if (pixElem) {
      const pixValue = fullValue - fullValue * pixPercent;
      pixElem.textContent = formatCurrency(pixValue);
    }

    wrapper.dataset.productVariant = JSON.stringify(variant);
  }

  function updatePixPrice(variant) {
    if (!variant) return;

    document.querySelectorAll('.hana-price-wrapper').forEach((wrapper) => {
      const wrapperProductId = wrapper.dataset.productId;
      if (variant.product_id && wrapperProductId && wrapperProductId !== String(variant.product_id)) {
        return;
      }

      updateWrapper(wrapper, variant);
    });
  }

  function hydrateWrappers(scope = document) {
    scope.querySelectorAll('.hana-price-wrapper[data-product-variant]').forEach((wrapper) => {
      const variantData = parseVariantData(wrapper.dataset.productVariant);
      if (variantData) {
        updateWrapper(wrapper, variantData);
      }
    });
  }

  ['variant:changed', 'variant:change', 'product:variant-change'].forEach((eventName) => {
    document.addEventListener(eventName, (event) => {
      if (event && event.detail && event.detail.variant) {
        updatePixPrice(event.detail.variant);
      }
    });
  });

  document.addEventListener('shopify:section:load', (event) => {
    hydrateWrappers(event.target || document);
  });

  hydrateWrappers();
});
