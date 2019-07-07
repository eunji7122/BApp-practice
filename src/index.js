import Caver from "caver-js";
import {Spinner} from "spin.js";


$.getJSON('./real-estate.json', function(data) {
  console.log(data[0].id);
})

// 어떤 클레이튼 노드에 연결해서 쓸지 정의
const config = {
  rpcURL: 'https://api.baobab.klaytn.net:8651'
}
const cav = new Caver(config.rpcURL);
// webpack에서 생성된 정보가 넘어옴
const agContract = new cav.klay.Contract(DEPLOYED_ABI, DEPLOYED_ADDRESS);
const App = {
  auth: {
    accessType: 'keystore',  // 인증방식은 keystore
    keystore: '',  // keystore의 전체 내용을 저장
    password: ''   // 해당 key의 비밀번호
  },

  start: async function () {
    // 페이지를 새로고침했을 때 기존 로그인 정보가 사라지지않고 저장하기 위함
    const walletFromSession = sessionStorage.getItem('walletInstance');
    if (walletFromSession) {
      try {
        cav.klay.accounts.wallet.add(JSON.parse(walletFromSession));
        this.changeUI(JSON.parse(walletFromSession));
      } catch (e) {
        sessionStorage.removeItem('walletInstance');
      }
    }
  },

  // 유효한 keystore 파일인지 검사
  handleImport: async function () {
    const fileReader = new FileReader();
    fileReader.readAsText(event.target.files[0]); // 선택한 파일
    fileReader.onload = (event) => {  // event = 파일의 내용
      try { // 파일의 내용이 유효한지 검사
        if (!this.checkValidKeystore(event.target.result)) {
          $('#message').text('유효하지 않은 keystore 파일입니다.');
          return;
        }
        this.auth.keystore = event.target.result;  // 불러온 keystore 내용을 대입
        $('#message').text('keystore 통과. 비밀번호를 입력하세요.');
        document.querySelector('#input-password').focus();
      } catch (event) {
        $('#message').text('유효하지 않은 keystore 파일입니다.');
        return;
      }
    }
  },

  handlePassword: async function () {
    this.auth.password = event.target.value;
  },

  handleLogin: async function () {
    if (this.auth.accessType === 'keystore') {
      try {
        // keystore 내용과 비밀번호를 인자로 넘겨서 해독한 오브젝트(privateKey)를 가져와서 저장
        const privateKey = cav.klay.accounts.decrypt(this.auth.keystore, this.auth.password).privateKey;
        this.integrateWallet(privateKey);
      } catch (e) {
        $('#message').text('비밀번호가 일치하지 않습니다.');
      }
    }
  },

  handleLogout: async function () {
    // wallet과 session을 초기화
    this.removeWallet();
    // 처음 상태의 UI로 돌아가기 위함
    location.reload();
  },

  generateNumbers: async function () {

  },

  submitAnswer: async function () {

  },

  deposit: async function () {
    var spinner = this.showSpinner();
    const walletInstance = this.getWallet();
    if (walletInstance) {
      if (await this.callOwner() !== walletInstance.address) return;
      else {
        var amount = $('#amount').val();
        if (amount) {
          agContract.methods.deposit().send({
            from: walletInstance.address,
            gas: '250000',
            value: cav.utils.toPeb(amount, "KLAY")
          })
          .once('transactionHash', (txHash) => {
            console.log(`txHash: ${txHash}`);
          })
          .once('receipt', (receipt) => {
            console.log(`(#${receipt.blockNumber})`, receipt);
            spinner.stop();
            alert(amount + " KLAY를 컨트랙에 송금했습니다.");
            location.reload();
          })
          .once('error', (error) => {
            alert(error.message);
          });
        }
        return;
      }
    }
  },

  callOwner: async function () {
    // owner 값을 불러옴
    return await agContract.methods.owner().call();
  },

  callContractBalance: async function () {
    // 값을 불러옴
    return await agContract.methods.getBalance().call();
  },

  getWallet: function () {
    // 현재 계정 정보를 가져옴 (로그인되어 있는 계정)
    if (cav.klay.accounts.wallet.length) {
      return cav.klay.accounts.wallet[0];
    }
  },

  checkValidKeystore: function (keystore) {
    const parseKeystore = JSON.parse(keystore); // keystore 내용을 분해해서 오브젝트로 만듦
    const isValidKeystore = parseKeystore.version &&
      parseKeystore.id &&
      parseKeystore.address &&
      parseKeystore.crypto;

      return isValidKeystore;
  },

  integrateWallet: function (privateKey) {
    // 계정 정보 인스턴스를 walletInstnace에 추가
    const walletInstance = cav.klay.accounts.privateKeyToAccount(privateKey);
    // 트랜잭션을 생성할 때 이 walletInstace를 불러와서 처리
    cav.klay.accounts.wallet.add(walletInstance);
    // 세션에 계정 정보를 불러와서 계정 로그인 상태를 유지
    sessionStorage.setItem('walletInstance', JSON.stringify(walletInstance));
    this.changeUI(walletInstance);
  },

  reset: function () {
    this.auth = {
      keystore: '',
      password: ''
    };
  },

  changeUI: async function (walletInstance) {
    $('#loginModal').modal('hide');
    $('#login').hide();
    $('#logout').show();
    $('#address').append('<br>' + '<p>' + '내 계정 주소: ' + walletInstance.address + '</p>');
    $('#contractBalance').append('<p>' + '이벤트 잔액: ' + cav.utils.fromPeb(await this.callContractBalance(), "KLAY") + ' KLAY' + '</p>');     

    if (await this.callOwner() === walletInstance.address) {
      $("#owner").show();
    }

    $.getJSON('./real-estate.json', function(data) {
      var list = $('#list');
      var template = $('#template');

      console.log(data);
      // json 배열에 있는 데이터를 하나씩 불러와서 해당 json 정보를 담음
      for (var i = 0; i < data.length; i++) {
        template.find('img').attr('src', './'+data[i].picture);
        template.find('.id').text(data[i].id);
        template.find('.type').text(data[i].type);
        template.find('.area').text(data[i].area);
        template.find('.price').text(data[i].price);

        // 리스트에 완성된 템플릿을 추가
        list.append(template.html());
      }
    })
  
  },

  removeWallet: function () {
    cav.klay.accounts.wallet.clear();
    sessionStorage.removeItem('walletInstance');
    this.reset();
  },

  showTimer: function () {

  },

  showSpinner: function () {
    var target = document.getElementById("spin");
    return new Spinner(opts).spin(target);
  },

  receiveKlay: function () {

  }
};

window.App = App;

// 페이지가 로드될 때 가장 먼저 start() 실행 시킴
window.addEventListener("load", function () {
  App.start();
});

var opts = {
  lines: 10, // The number of lines to draw
  length: 30, // The length of each line
  width: 17, // The line thickness
  radius: 45, // The radius of the inner circle
  scale: 1, // Scales overall size of the spinner
  corners: 1, // Corner roundness (0..1)
  color: '#5bc0de', // CSS color or array of colors
  fadeColor: 'transparent', // CSS color or array of colors
  speed: 1, // Rounds per second
  rotate: 0, // The rotation offset
  animation: 'spinner-line-fade-quick', // The CSS animation name for the lines
  direction: 1, // 1: clockwise, -1: counterclockwise
  zIndex: 2e9, // The z-index (defaults to 2000000000)
  className: 'spinner', // The CSS class to assign to the spinner
  top: '50%', // Top position relative to parent
  left: '50%', // Left position relative to parent
  shadow: '0 0 1px transparent', // Box-shadow for the lines
  position: 'absolute' // Element positioning
};