import { readFileSync, writeFileSync } from 'fs'
import { parse } from 'csv-parse/sync'

const NUM_WINNERS = 100
const IGNORE_USERS = './data/ignoreUsers.txt'
const OUTPUT_FILE = './data/winners.json'

type Profile = {
  id: number
  email: string
  point: number
  ticket: number
}

function readFile(filePath: string): string | null {
  try {
    return readFileSync(filePath, 'utf-8')
  } catch {
    return null
  }
}

function readProfileCsv(filePath: string): Profile[] {
  const buf = readFileSync(filePath, 'utf-8')
  let profiles: Profile[] = parse(buf, { columns: true })
  if (profiles.length === 0) {
    throw new Error('no data')
  }
  const { id, email } = profiles[0]
  if (!id || !email) {
    throw new Error('missing required fields')
  }

  const ignoreUsres = readFile(IGNORE_USERS)?.split('\n')
  if (!ignoreUsres) {
    return profiles
  }
  profiles = profiles.filter((p) => !ignoreUsres.includes(p.email))

  const prevResult = readFile(OUTPUT_FILE)
  if (!prevResult) {
    return profiles
  }
  const buf2: Profile[] = JSON.parse(prevResult)
  const winners = buf2.map(({ email }) => email)
  return profiles.filter((p) => !winners.includes(p.email))
}

async function main() {
  const [filePath] = process.argv.slice(2)
  if (!filePath) {
    console.info('Usage: yarn run --silent sweepstakes [filePath]\n\n')
    throw new Error('Filepath is required.')
  }
  let profiles = readProfileCsv(filePath).filter((i) => i.ticket > 0)

  const winners: Profile[] = []
  for (let i = 0; i < NUM_WINNERS; i++) {
    const candidates: Profile[] = []
    profiles.forEach((p) => {
      for (let j = 0; j < p.ticket; j++) {
        candidates.push(p)
      }
    })
    const winner = candidates[Math.floor(Math.random() * candidates.length)]
    winners.push(winner)

    profiles = profiles.filter((p) => p.id !== winner.id)
  }
  const winnersView = winners
    .sort((a, b) => a.id - b.id)
    .map((p) => ({ id: p.id, email: p.email, point: p.point }))

  console.info(JSON.stringify(winnersView, null, '  '))
  writeFileSync(OUTPUT_FILE, JSON.stringify(winnersView))
}

main()
