<template>
  <div>
    <AuthHeader />
    <div class="card">
      <p class="auth-form_ttl">新規登録</p>
      <div class="form">
        <input placeholder="ユーザーネーム" type="text" v-model="name" name="ユーザーネーム" />
        <input placeholder="メールアドレス" type="email" v-model="email" />
        <input placeholder="パスワード" type="password" v-model="password" />
        <button @click="register" class="auth_button">新規登録</button>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from "~/plugins/firebase";
export default {
  data() {
    return {
      name: null,
      email: null,
      password: null,
    };
  },
  methods: {
    register() {
      if (!this.name || !this.email || !this.password) {
        alert("ユーザーネームまたはメールアドレスまたはパスワードが入力されていません。");
        return;
      }
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.email, this.password)
        .then((data) => {
          const sendData = {
            id: data.user.uid,
            name: this.name,
          };
          this.$axios.post("http://127.0.0.1:8000/api/v1/user", sendData);
          this.$router.replace("/login");
        })
        .catch((error) => {
          switch (error.code) {
            case "auth/invalid-email":
              alert("メールアドレスの形式が違います。");
              break;
            case "auth/email-already-in-use":
              alert("このメールアドレスはすでに使われています。");
              break;
            case "auth/weak-password":
              alert("パスワードは6文字以上で入力してください。");
              break;
            default:
              alert("エラーが起きました。しばらくしてから再度お試しください。");
              break;
          }
        });
    },
  },
};
</script>