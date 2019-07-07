// ABI = 블록체인과 컨트랙간에 상호작용을 할 수 있는 파일
const fs = require('fs')  // 파일시스템 추가
const AdditionGame = artifacts.require('./AdditionGame.sol')

module.exports = function (deployer) {
  deployer.deploy(AdditionGame)  // 배포
    .then(() => {
      if (AdditionGame._json) {  // AdditionGame의 json파일을 받았다면
        // deployedABI 파일 안에 JSON으로 받은 ABI 정보를 string화해서 인자로 넘김
        fs.writeFile('deployedABI', JSON.stringify(AdditionGame._json.abi),
          (err) => {
            if (err) throw err;
          // deployedABI파일에 배포된 ABI 정보가 문자화되서 저장됨
            console.log("파일에 ABI 입력 성공");
          }
        )
        
        fs.writeFile('deployedAddress', AdditionGame.address,
          (err) => {
            if (err) throw err;
            console.log("파일에 주소 입력 성공");
          }
        )
      }
    })
}
