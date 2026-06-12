import he from 'he';

function escapeHtml(value) {
  if (value === null || value === undefined) {
    return '';
  }

  return he.encode(String(value));
}

function getCapitalizedWord(value) {
  if (!value) {
    return '';
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
}

export { escapeHtml, getCapitalizedWord };
