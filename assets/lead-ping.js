/* Действия на сайте → Степану в бот кабинета (app.neurocreator2.ru/api/site-event).
   Сам по себе ловит нажатия на ссылки t.me/newhndrx и на оплату (payform.ru); анкета и квиз вызывают ncPing() со своими полями. */
(function () {
  var URL_ = 'https://app.neurocreator2.ru/api/site-event';
  window.ncPing = function (d) {
    try {
      d = d || {};
      d.page = location.pathname;
      d.qs = location.search.slice(0, 300);
      var body = JSON.stringify(d);
      var ok = navigator.sendBeacon && navigator.sendBeacon(URL_, new Blob([body], { type: 'text/plain' }));
      if (!ok) fetch(URL_, { method: 'POST', body: body, keepalive: true, mode: 'no-cors' });
    } catch (e) {}
  };
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href*="t.me/newhndrx"], a[href*="payform.ru"]');
    if (!a) return;
    if (a.href.indexOf('payform.ru') >= 0) { ncPing({ kind: 'pay', label: (a.innerText || '').trim().slice(0, 120), text: a.href }); return; }
    var text = '';
    try { text = new URL(a.href).searchParams.get('text') || ''; } catch (err) {}
    ncPing({ kind: 'click', label: (a.innerText || '').trim().slice(0, 120), text: text.slice(0, 600) });
  }, true);
})();
