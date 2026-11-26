const promptText = document.getElementById('master-prompt');
const copyButton = document.getElementById('copy');
const feedback = document.getElementById('result');

copyButton.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(promptText.textContent);
    feedback.textContent = 'Промпт скопирован.';
  } catch {
    document.getElementById('full').open = true;
    promptText.focus();
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(promptText);
    selection.removeAllRanges();
    selection.addRange(range);
    feedback.textContent = document.execCommand('copy')
      ? 'Промпт скопирован.'
      : 'Текст выделен. Скопируй его вручную или скачай TXT.';
  }
});
