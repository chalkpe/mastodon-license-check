import { writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { exit } from 'node:process'
import { gql, request } from 'graphql-request'
import z from 'zod'

const endpoint = 'https://api.fediverse.observer'

const query = gql`
  {
    nodes(softwarename: "mastodon") {
      domain
      countryname
      detectedlanguage
      monthsmonitored
      date_created
    }
  }
`

const schema = z.object({
  nodes: z.array(
    z.object({
      domain: z.string(),
      countryname: z.string().nullable(),
      detectedlanguage: z.string().nullable(),
      monthsmonitored: z.number(),
      date_created: z.string(),
    }),
  ),
})

async function main() {
  const { nodes } = schema.parse(await request(endpoint, query))
  await writeFile(
    resolve(__dirname, '..', 'data', 'nodes.json'),
    JSON.stringify(
      nodes
        .filter((n) => n.monthsmonitored <= 12 && (n.countryname === 'South Korea' || n.detectedlanguage === 'ko'))
        .sort((a, b) => b.date_created.localeCompare(a.date_created))
        .map((n) => n.domain),
    ),
    'utf8',
  )
}

main().catch((err) => {
  console.error(err)
  exit(1)
})
