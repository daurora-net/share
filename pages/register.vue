<template>
  <div>
    <AuthHeader />
    <div class="card">
      <p class="auth-form_ttl">新規登録</p>
      <div class="form">
        <form @submit.prevent="register">
          <input placeholder="ユーザーネーム" type="text" v-model="name" name="ユーザーネーム" />
          <input placeholder="メールアドレス" type="email" v-model="email" />
          <input placeholder="パスワード" type="password" v-model="password" />
          <button type="submit" :disabled="isSubmitting" class="auth_button">新規登録</button>
        </form>
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
      isSubmitting: false,  // ボタンの有効/無効の状態を管理するフラグ
    };
  },
  methods: {
    register() {
      this.isSubmitting = true;  // ボタンを無効化

      if (!this.name || !this.email || !this.password) {
        alert("ユーザーネームまたはメールアドレスまたはパスワードが入力されていません。");
        this.isSubmitting = false;  // ボタンを再有効化
        return;
      }

      firebase
        .auth()
        .createUserWithEmailAndPassword(this.email, this.password)
        .then((data) => {
          const sendData = {
            id: data.user.uid,
            name: this.name,
            email: this.email,
          };

          this.$axios.post("/v1/user", sendData)
            .then(() => {
              setTimeout(() => {
                this.$router.replace("/login");
              }, 1000);
              this.isSubmitting = false;  // ボタンを再有効化
            })
            .catch((error) => {
              console.error("エラーが発生しました:", error);
              alert("ユーザー情報の保存中にエラーが発生しました。再度お試しください。");
              this.isSubmitting = false;  // ボタンを再有効化
            });
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
          this.isSubmitting = false;  // ボタンを再有効化
        });
    },
  },
};
</script>