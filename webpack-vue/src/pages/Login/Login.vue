<template>
  <div class="login">
    <div class="bg" :class="{ animationBg: isClickLogin }"></div>
    <div class="form" @keyup.enter="login">
      <h1 class="form-title" :class="{ paused: isClickLogin }">亮键队.</h1>
      <h1 class="form-slogan">键盘在我手，天下我都有！！</h1>
      <!-- <div class="form-input">
        <span class="iconfont icon-denglu1"></span>
        <input ref="usernameInput" type="text" placeholder="enter user name." v-model="username" />
      </div>
      <div class="form-input">
        <span class="iconfont icon-mima1"></span>
        <input ref="passwordInput" type="password" placeholder="Key your password." v-model="password" />
      </div> -->
      <button @click="login" :class="{ animationBtn: isClickLogin }">AVAILABLE NOW</button>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    const doll = document.getElementsByClassName("fa-times")[0];

    doll && doll.click();
  },
  data() {
    return {
      isClickLogin: false,
      username: "",
      password: ""
    };
  },
  methods: {
    login() {
      this.isClickLogin = true;
      setTimeout(() => {
        this.$router.push("/photo");
        this.isClickLogin = false;
      }, 1000);
      //   const { username, password } = this;
      //   if (!username || !password) {
      //     this.$Message.error({
      //       background: true,
      //       content: "用户名，密码都必填"
      //     });
      //     !password && this.$refs.passwordInput.focus();
      //     !username && this.$refs.usernameInput.focus();
      //     return;
      //   }

      //   this.isClickLogin = true;
      //   setTimeout(() => {
      //     const obj = {
      //       username,
      //       password
      //     };

      //     this.$api.login(obj).then((res) => {
      //       this.isClickLogin = false;
      //       if (res.data.err_code == 0) {
      //         localStorage.setItem("token", res.data.data.token);
      //         this.$router.replace("/home");
      //       } else {
      //         this.$Message.error({
      //           background: true,
      //           content: res.data.message
      //         });
      //       }
      //     });
      //   }, 1000);
    }
  }
};
</script>

<style lang="scss" scoped>
$slice-0: inset(50% 50% 50% 50%);
$slice-1: inset(80% -6px 0 0);
$slice-2: inset(50% -6px 30% 0);
$slice-3: inset(10% -6px 85% 0);
$slice-4: inset(40% -6px 43% 50%);
$slice-5: inset(80% -6px 5% 0);
$slice-6: inset(40% -6px 53% 80%);

@keyframes btn {
  0% {
    clip-path: $slice-1;
    transform: translate(-20px, -10px);
  }

  10% {
    clip-path: $slice-3;
    transform: translate(10px, 10px);
  }

  20% {
    clip-path: $slice-1;
    transform: translate(-10px, 10px);
  }

  30% {
    clip-path: $slice-3;
    transform: translate(0px, 5px);
  }

  40% {
    clip-path: $slice-2;
    transform: translate(-5px, 0px);
  }

  50% {
    clip-path: $slice-3;
    transform: translate(5px, 0px);
  }

  60% {
    clip-path: $slice-4;
    transform: translate(5px, 10px);
  }

  70% {
    clip-path: $slice-2;
    transform: translate(-10px, 10px);
  }

  80% {
    clip-path: $slice-5;
    transform: translate(20px, -10px);
  }

  90% {
    clip-path: $slice-1;
    transform: translate(-10px, 0px);
  }

  100% {
    clip-path: $slice-1;
    transform: translate(0);
  }
}

@keyframes bg {
  0% {
    z-index: 1;
    clip-path: $slice-2;
  }

  10% {
    z-index: 1;
    clip-path: $slice-3;
  }

  20% {
    z-index: 1;
    clip-path: $slice-1;
  }

  30% {
    z-index: 1;
    clip-path: $slice-3;
  }

  40% {
    z-index: 1;
    clip-path: $slice-2;
  }

  50% {
    z-index: 1;
    clip-path: $slice-6;
    background: black;
  }

  60% {
    z-index: 1;
    clip-path: $slice-1;
  }

  70% {
    z-index: 1;
    clip-path: $slice-6;
  }

  80% {
    z-index: 1;
    clip-path: $slice-2;
  }

  90% {
    z-index: 1;
    clip-path: $slice-3;
    background: white;
  }

  100% {
    z-index: 1;
    clip-path: $slice-1;
  }
}

@keyframes title {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.login {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  .bg,
  .bg::after,
  .bg:before {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url("../../assets/img/jianpan.png") no-repeat;
    background-size: cover;
  }
  .bg::after {
    content: "";
    display: block;
    transform: translate(-20px, 20px);
    filter: blur(2px);
    opacity: 0.5;
    box-shadow: 0px 0px 5px #eee;
  }
  .bg:before {
    // z-index: 1;
    content: "";
    display: block;
  }
  button,
  button::after {
    cursor: pointer;
    width: 240px;
    height: 50px;
    font-size: 18px;
    opacity: 0.8;
    background: linear-gradient(45deg, transparent 5%, #ff013c 5%);
    font-weight: bold;
    border: 0;
    color: #fff;
    font-style: italic;
    letter-spacing: 2px;
    line-height: 50px;
    box-shadow: 6px 0 0 #00e6f6;
    outline: transparent;
    position: relative;
  }
  button::after {
    content: "AVAILABLE NOW";
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    background: linear-gradient(45deg, transparent 3% #00e6f6 3%, #00e6f6 5%, #ff013c 5%);
    text-shadow: -3px -3px 0 #f8f005, 3px 3px 0px #00e6f6;
    clip-path: $slice-0;
  }
  .animationBtn {
    &::after {
      animation: btn 1s;
      animation-timing-function: steps(1, end);
    }
  }
  .animationBg {
    &::before {
      animation: bg 1s;
      animation-timing-function: steps(1, end);
    }
  }
  .paused {
    animation-play-state: paused !important;
  }
  .form {
    &-title {
      margin: 0;
      text-align: center;
      //-webkit-box-reflect: below 0px -webkit-linear-gradient(transparent, white 100%, rgba(255, 255, 255, 0.5));
      position: relative;
      animation: title 3s infinite alternate-reverse;
      color: white;
      font-size: 50px;
      // line-height: 54px;
      letter-spacing: 2px;
      text-shadow: -2px -2px 0 white, 3px 3px 0px #00e6f6, 0 0 20px #7fffd4, 0 0 40px #7fffd4, 0 0 50px #7fffd4,
        0 0 60px #7fffd4, 0 0 100px #7fffd4;
    }
    &-slogan {
      margin: 0;
      position: relative;
      text-align: center;
      line-height: 50px;
      padding: 30px 0;
      color: white;
      font-size: 40px;
      font-weight: bold;
      letter-spacing: 2px;
      // line-height: 44px;
      text-shadow: -2px -2px 0 #f8f005, 3px 3px 0px #00e6f6;
      //text-indent: 40px;
      z-index: 999;
      // box-shadow: 2px 0px 2px #00e6f6;
      // background: linear-gradient(45deg, transparent 5%, white 5%);
    }
    .test {
      position: relative;
    }

    .form-input {
      font-size: 14px;
      height: 40px;
      margin-bottom: 20px;
      position: relative;
      span {
        z-index: 1;
        font-size: 24px;
        color: #ff013c;
        position: absolute;
        top: -3px;
        left: 4px;
        opacity: 0.8;
      }
      input {
        opacity: 0.8;
        display: inline-block;
        outline: none;
        border: none;
        height: 40px;
        font-weight: bold;
        letter-spacing: 1px;
        width: 300px;
        text-shadow: -3px -3px 0 #f8f005, 3px 3px 0px #00e6f6;
        text-indent: 40px;
        box-shadow: 2px 0px 2px #00e6f6;
        background: linear-gradient(45deg, transparent 5%, white 5%);
      }
      input:focus {
        opacity: 1;
      }
    }

    button {
      margin-top: 6px;
      margin-left: 140px;
    }
  }
}
</style>
