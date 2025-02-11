import { EMOJI_CATALOGUES } from './parse-emoji';

export default function findEmoji(emoji: string) {
  const catalogue = EMOJI_CATALOGUES.find((catalogue: any) =>
    Object.prototype.hasOwnProperty.call(catalogue.index, emoji),
  );

  return catalogue ? catalogue.emoji[catalogue.index[emoji]] : null;
}
