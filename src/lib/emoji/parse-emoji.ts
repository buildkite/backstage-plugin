const BUILDKITE_EMOJI_URL =
  'https://raw.githubusercontent.com/buildkite/emojis/refs/heads/main/img-buildkite-64.json';
const UNICODE_EMOJI_URL =
  'https://raw.githubusercontent.com/buildkite/emojis/refs/heads/main/img-apple-64.json';

export let EMOJI_CATALOGUES: any[] = [];

async function fetchEmojiData() {
  try {
    const [buildkiteRes, unicodeRes] = await Promise.all([
      fetch(BUILDKITE_EMOJI_URL),
      fetch(UNICODE_EMOJI_URL),
    ]);

    const buildkiteData = await buildkiteRes.json();
    const unicodeData = await unicodeRes.json();

    EMOJI_CATALOGUES = [
      {
        host: 'https://raw.githubusercontent.com/buildkite/emojis/main/',
        emoji: buildkiteData,
        index: buildkiteData.reduce((acc: any, emoji: any, index: number) => {
          acc[`:${emoji.name}:`] = index;
          return acc;
        }, {}),
      },
      {
        host: '',
        emoji: unicodeData,
        index: unicodeData.reduce((acc: any, emoji: any, index: number) => {
          acc[`:${emoji.name}:`] = index;
          return acc;
        }, {}),
      },
    ];
  } catch (error) {
    console.error('Failed to fetch emoji data:', error);
  }
}

fetchEmojiData();

const COLON_REGEXP = /:[^\s:]+:(?::skin-tone-[2-6]:)?/g;

export default function parseEmoji(string: string) {
  if (!string || string.length === 0) {
    return '';
  }

  // Function to find emoji in catalogues
  const findEmoji = (match: string) => {
    // Remove colons if present
    const emojiName = match.replace(/^:|:$/g, '');

    // Find a catalogue which contains the emoji
    const catalogue = EMOJI_CATALOGUES.find(catalogue =>
      Object.prototype.hasOwnProperty.call(catalogue.index, `:${emojiName}:`),
    );

    if (catalogue) {
      // If we found one, pull out the emoji's entry
      const emoji = catalogue.emoji[catalogue.index[`:${emojiName}:`]];

      // Double check, just in case
      if (emoji) {
        // Replace Unicode emoji shortcodes with real Unicode
        if (emoji.unicode) {
          return emoji.unicode;
        }

        // And Buildkite emoji with images
        // Emoji catalogue hosts have a normalized host that always end with a "/"
        const emojiUrl = `${catalogue.host}${emoji.image}`;

        return `<img style="width: 16px; height: 16px; vertical-align: -3px" title="${emoji.name}" alt=":${emoji.name}:" src="${emojiUrl}" draggable="false" />`;
      }
    }

    return match;
  };

  // First, try to match colon-wrapped emoji names
  let result = string.replace(COLON_REGEXP, findEmoji);

  // If no replacements were made, try to match the whole string as an emoji name
  if (result === string && !string.includes(':')) {
    result = findEmoji(string);
  }

  return result;
}
