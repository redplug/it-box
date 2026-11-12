interface RegExpGroupIndices {
  [name: string]: [number, number]
}
interface RegExpIndices extends Array<[number, number]> {
  groups: RegExpGroupIndices
}
interface RegExpExecArrayWithIndices extends RegExpExecArray {
  indices: RegExpIndices
}
interface GroupCapture {
  name: string
  value: string
  start: number
  end: number
};

export function matchRegex(regex: string, text: string, flags: string) {
  // if (regex === '' || text === '') {
  //   return [];
  // }

  const re = new RegExp(regex, flags);
  const unicode = flags.includes('u') || flags.includes('v');
  const results = [];
  let match = re.exec(text) as RegExpExecArrayWithIndices;
  while (match !== null) {
    if (match[0] === '') {
      // empty matches are not listed; step past them (one code point) so the search goes on
      if (!re.global && !re.sticky) {
        break;
      }
      re.lastIndex += unicode && (text.codePointAt(re.lastIndex) ?? 0) > 0xFFFF ? 2 : 1;
      match = re.exec(text) as RegExpExecArrayWithIndices;
      continue;
    }
    const indices = match.indices;
    const captures: Array<GroupCapture> = [];
    Object.entries(match).forEach(([captureName, captureValue]) => {
      if (captureName !== '0' && captureName.match(/\d+/)) {
        captures.push({
          name: captureName,
          value: captureValue,
          start: indices[Number(captureName)][0],
          end: indices[Number(captureName)][1],
        });
      }
    });
    const groups: Array<GroupCapture> = [];
    Object.entries(match.groups || {}).forEach(([groupName, groupValue]) => {
      groups.push({
        name: groupName,
        value: groupValue,
        start: indices.groups[groupName][0],
        end: indices.groups[groupName][1],
      });
    });
    results.push({
      index: match.index,
      value: match[0],
      captures,
      groups,
    });
    if (!re.global && !re.sticky) {
      break;
    }
    match = re.exec(text) as RegExpExecArrayWithIndices;
  }
  return results;
}
