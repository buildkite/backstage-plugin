// The webpack loader converts the emoji files in
// http://github.com/buildkite/emojis to an indexed version for use in the
// browser.
//
// The exported hash from this loader looks like this:
//
// {
//   host: "http://assets.buildkite.com/emojis",
//   emoji: [
//     {
//       name: "+1",
//       unicode: "👍"
//     },
//     {
//       name: "+1",
//       unicode: "👍🏼"
//     }
//   ],
//   index: {
//     ":+1:": 0,
//     ":+1::skin-tone-3:": 1
//   }
// }
//
// Or like this:
//
// {
//   host: "https://buildkiteassets.com/emojis",
//   emoji: [
//     {
//       name: "buildkite",
//       image: "img-buildkite-64/buildkite.png"
//     }
//   ],
//   index: {
//     ":buildkite:": 0
//   }
// }
//
// Emoji names and aliases are all indexed.

function convertToUnicode(code) {
  if (!code || !code.length) {
    return null
  }

  const points = code.split('-').map((point) => `0x${point}`)

  return String.fromCodePoint.apply(String, points)
}

export default function (source) {
  // Get the emoji host and throw and error if it's missing
  let host = 'https://buildkiteassets.com/emojis'
  if (!host) {
    throw new Error('Failed to load emoji')
  }

  // Parse the JSON source
  source = typeof source === 'string' ? JSON.parse(source) : source

  // Normalize the host (should always end with a "/")
  if (host.slice(-1) !== '/') {
    host = host + '/'
  }

  // Index the emoji
  const emojiList = []
  const emojiIndex = {}

  source.forEach(function (emoji) {
    const item = {
      name: emoji['name'],
    }

    emojiList.push(item)
    const itemIndex = emojiList.indexOf(item)

    const emojiUnicode = convertToUnicode(emoji['unicode'])

    if (emojiUnicode) {
      item.unicode = emojiUnicode
    } else {
      item.image = emoji['image']
    }

    emojiIndex[`:${emoji['name']}:`] = itemIndex

    emoji['aliases'].forEach(function (alias) {
      emojiIndex[`:${alias}:`] = itemIndex
    })

    const modifiers = emoji['modifiers']
    if (modifiers && modifiers.length > 0) {
      modifiers.forEach(function (modifier) {
        const modified = {
          name: emoji['name'],
        }

        emojiList.push(modified)
        const modifiedIndex = emojiList.indexOf(modified)

        const modifierUnicode = convertToUnicode(modifier['unicode'])

        if (modifierUnicode) {
          modified.unicode = modifierUnicode
        } else {
          modified.image = modifier['image']
        }

        emojiIndex[`:${emoji['name']}::${modifier['name']}:`] = modifiedIndex

        emoji['aliases'].forEach(function (alias) {
          emojiIndex[`:${alias}::${modifier['name']}:`] = modifiedIndex
        })
      })
    }
  })

  const emojiData = { emoji: emojiList, index: emojiIndex, host: host }

  // Re-export the emoji as JSON
  return JSON.stringify(emojiData, undefined, '\t')
}
