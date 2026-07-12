const PHONE_DISPLAY = '+7 (977) 613-13-03';
const PHONE_RAW = '+79776131303';

const menuButton = document.querySelector('[data-menu-button]');
const menuLabel = document.querySelector('[data-menu-label]');
const nav = document.querySelector('[data-nav]');
const setMenu = (open) => {
  if (!menuButton || !nav) return;
  menuButton.setAttribute('aria-expanded', String(open));
  nav.dataset.open = String(open);
  if (menuLabel) menuLabel.textContent = open ? 'Закрыть меню' : 'Открыть меню';
};
menuButton?.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  setMenu(false);
  closeDialog();
});

const copyText = async (text) => {
  try { await navigator.clipboard.writeText(text); return true; }
  catch { return false; }
};

document.querySelectorAll('[data-copy-phone]').forEach((button) => button.addEventListener('click', async () => {
  const ok = await copyText(PHONE_DISPLAY);
  const status = document.querySelector('[data-copy-status]');
  if (status) status.textContent = ok ? 'Номер скопирован' : `Скопируйте номер: ${PHONE_DISPLAY}`;
}));

document.querySelectorAll('[data-filter]').forEach((button) => button.addEventListener('click', () => {
  const filter = button.dataset.filter;
  document.querySelectorAll('[data-filter]').forEach((item) => item.classList.toggle('is-active', item === button));
  document.querySelectorAll('[data-gallery-item]').forEach((item) => { item.hidden = filter !== 'all' && item.dataset.category !== filter; });
}));

document.querySelectorAll('[data-price-tab]').forEach((button) => button.addEventListener('click', () => {
  document.querySelectorAll('[data-price-tab]').forEach((item) => item.setAttribute('aria-selected', String(item === button)));
  document.querySelectorAll('.price-panel').forEach((panel) => { panel.hidden = panel.id !== button.dataset.priceTab; });
}));

document.querySelectorAll('[data-price-toggle]').forEach((button) => button.addEventListener('click', () => {
  const more = button.parentElement?.querySelector('[data-price-more]');
  if (!more) return;
  const open = more.classList.toggle('is-open');
  button.textContent = open ? 'Свернуть список' : 'Показать полный список';
  button.setAttribute('aria-expanded', String(open));
}));

document.querySelectorAll('[data-book-service]').forEach((button) => button.addEventListener('click', () => {
  const service = form?.querySelector('select[name="service"]');
  if (service) {
    service.value = button.dataset.bookService || '';
    service.removeAttribute('aria-invalid');
  }
  form?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  window.setTimeout(() => form?.querySelector('input[name="name"]')?.focus({ preventScroll: true }), 450);
}));

const dialog = document.querySelector('[data-image-dialog]');
const dialogImage = dialog?.querySelector('img');
document.querySelectorAll('[data-gallery-item], [data-certificate]').forEach((button) => button.addEventListener('click', () => {
  if (!dialog || !dialogImage) return;
  dialogImage.src = button.dataset.src;
  dialogImage.alt = button.dataset.alt || '';
  dialog.showModal();
  document.body.classList.add('dialog-open');
}));
const closeDialog = () => { if (dialog?.open) dialog.close(); document.body.classList.remove('dialog-open'); };
dialog?.querySelector('[data-dialog-close]')?.addEventListener('click', closeDialog);
dialog?.addEventListener('click', (event) => { if (event.target === dialog) closeDialog(); });
dialog?.addEventListener('close', () => document.body.classList.remove('dialog-open'));

const form = document.querySelector('[data-booking-form]');
const result = document.querySelector('[data-form-result]');
const requestField = document.querySelector('[data-request-text]');
const smsLink = document.querySelector('[data-sms-link]');
const requestStatus = document.querySelector('[data-request-status]');
let preparedRequest = '';

form?.addEventListener('submit', (event) => {
  event.preventDefault();
  const required = [...form.querySelectorAll('[required]')];
  required.forEach((field) => field.setAttribute('aria-invalid', String(!field.value.trim())));
  const invalid = required.find((field) => !field.value.trim());
  if (invalid) { invalid.focus(); return; }
  const values = Object.fromEntries(new FormData(form).entries());
  preparedRequest = [`Здравствуйте, Валентина! Хочу записаться.`,`Имя: ${values.name}`,`Телефон: ${values.phone}`,`Услуга: ${values.service}`,values.time ? `Удобное время: ${values.time}` : '',values.comment ? `Комментарий: ${values.comment}` : ''].filter(Boolean).join('\n');
  if (requestField) requestField.value = preparedRequest;
  if (smsLink) smsLink.href = `sms:${PHONE_RAW}?body=${encodeURIComponent(preparedRequest)}`;
  if (result) result.hidden = false;
  result?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});

form?.querySelectorAll('[required]').forEach((field) => field.addEventListener('input', () => field.removeAttribute('aria-invalid')));
document.querySelector('[data-copy-request]')?.addEventListener('click', async () => {
  const ok = await copyText(preparedRequest);
  if (requestStatus) requestStatus.textContent = ok ? 'Текст заявки скопирован' : 'Выделите и скопируйте текст из поля выше';
});
