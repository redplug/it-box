import slugify from '@sindresorhus/slugify';

// shortcut: slugify drops every letter it cannot transliterate, so such runs are swapped for
// lowercase placeholders first; a literal "qz<n>qz" typed by the user would be restored wrongly.
const MARK = 'qz';
const placeholder = new RegExp(`${MARK}(\\d+)${MARK}`, 'g');
const isLetterOrNumber = /[\p{L}\p{N}]/u;

export function toSlug(input: string): string {
  const kept: string[] = [];
  let marked = '';
  let run = '';
  const flush = () => {
    if (run) {
      marked += `${MARK}${kept.length}${MARK}`;
      kept.push(run);
      run = '';
    }
  };

  for (const char of input) {
    if (isLetterOrNumber.test(char) && slugify(char) === '') {
      run += char;
    }
    else {
      flush();
      marked += char;
    }
  }
  flush();

  return slugify(marked).replace(placeholder, (match, index: string) => kept[Number(index)] ?? match);
}
