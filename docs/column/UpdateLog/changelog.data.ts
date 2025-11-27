import { spawnSync } from 'child_process'

export default {
  load() {
    const { stdout } = spawnSync('git', [
      'log',
      '--pretty=format:%h|%ad|%s|%an',
      '--date=format:%Y-%m-%d %H:%M:%S'
    ])
    
    return stdout.toString().split('\n').map(line => {
      const [hash, date, message, author] = line.split('|')
      return { hash, date, message, author }
    }).filter(commit => Boolean(commit.hash))
  }
}
