// truffle.js config for klaytn.
// 환경설정: 어느 네트워크에 스마트 계약을 배포할지 정의
const PrivateKeyConnector = require('connect-privkey-to-provider')  // 라이브러리 가져옴
const NETWORK_ID = '1001' // 바오밥 고유의 아이디
const GASLIMIT = '20000000'  // 배포하는데 들어가는 가스 한도
const URL = 'https://api.baobab.klaytn.net:8651'
const PRIVATE_KEY = '0xc391960963382589542407169cd7e8238b4bd07f459b23bfc6e418dee1b296fd'  // 계정01의 비밀키

// 위 설정들을 module.exports에 사용
module.exports = {
  networks: {
    klaytn: {
      provider: new PrivateKeyConnector(PRIVATE_KEY, URL),
      network_id: NETWORK_ID,
      gas: GASLIMIT,
      gasPrice: null,
    }
  }
}
