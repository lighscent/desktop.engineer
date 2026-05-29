import SparkMD5 from 'spark-md5'
import { sha1, sha256, sha512 } from 'hash.js'

let md5Spark, sha1Hash, sha256Hash, sha512Hash, bytesTotal, bytesDone

self.onmessage = function (e) {
  const { type, data, offset, total } = e.data

  if (type === 'start') {
    md5Spark = new SparkMD5.ArrayBuffer()
    sha1Hash = sha1()
    sha256Hash = sha256()
    sha512Hash = sha512()
    bytesTotal = total
    bytesDone = 0
    return
  }

  if (type === 'chunk') {
    md5Spark.append(data)
    const view = new Uint8Array(data)
    sha1Hash.update(view)
    sha256Hash.update(view)
    sha512Hash.update(view)
    bytesDone += data.byteLength
    self.postMessage({ type: 'progress', loaded: bytesDone, total: bytesTotal })
    return
  }

  if (type === 'finish') {
    self.postMessage({
      type: 'done',
      md5: md5Spark.end(),
      sha1: sha1Hash.digest('hex'),
      sha256: sha256Hash.digest('hex'),
      sha512: sha512Hash.digest('hex'),
    })
  }
}
