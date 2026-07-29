import { describe, expect, it } from 'vitest';
import { getGameLocaleCopy, getSiteMetadata } from './useGameLocale';

describe('game Korean localization', () => {
  it('provides Korean accessibility labels for every localized control group', () => {
    const copy = getGameLocaleCopy('ko');

    expect(copy.accessibility).toMatchObject({
      directionControls: '방향 조작',
      up: '위로 이동',
      left: '왼쪽으로 이동',
      down: '아래로 이동',
      right: '오른쪽으로 이동',
      flap: '새 날리기',
      connectFourBoard: '커넥트 포 게임판',
      hiddenWord: '숨겨진 단어',
      sudokuBoard: '스도쿠 게임판',
      sudokuDigits: '숫자 선택',
    });

    expect(copy.accessibility.sudokuCell(2, 8)).toBe('3행 9열');
  });

  it('returns Korean browser metadata instead of mixing in English copy', () => {
    expect(getSiteMetadata('ko')).toEqual({
      title: 'it-box 게임',
      description: '설치 없이 즐기는 간단한 무료 웹게임 모음입니다.',
    });
    expect(getSiteMetadata('ko', 'number-guessing')).toEqual({
      title: '숫자 맞히기 | it-box 게임',
      description: '열 번 안에 1부터 100 사이의 숫자를 맞혀 보세요.',
    });
  });
});
