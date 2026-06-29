import { config } from 'dotenv'

config()
config({ path: 'test.env', override: true })
