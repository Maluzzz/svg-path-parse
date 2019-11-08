const { pathParse, serializePath } = require('./lib/path_parse')
const SVGParser = require('convertpath')
const fs = require('fs')


const parse = SVGParser.parse('./test/icon_icebox.svg', {
  plugins: [
    {
      convertUseToGroup: true, // at first
    },
    {
      convertShapeToPath: true,
    },
    {
      removeGroups: true,
    },
    {
      convertTransfromforPath: true,
    },
    {
      viewBoxTransform: true, // at last
    }
  ],
  size: 1024,
})

const paths = parse.getPathAttributes()

paths.forEach(item => {
  if (item.d) {
    const pathDatas = pathParse(item.d).absNormalize({ round: 2 })
    item.d = serializePath(pathDatas)
  }
})

const svgStr = `<svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
${
  paths.map(item => {
    return `<path d="${item.d}" fill="${item.fill}" />`
  }).join('')
}
</svg>
`
fs.writeFileSync('./test.svg', svgStr)
