<template>
  <div class="container">
    <h1>ホーム</h1>

    <span>{{ result }}</span>

    <p>{{ message }}</p>
    <NuxtLink to="/register">新規登録</NuxtLink>
    <br />
    <NuxtLink to="/login">ログイン</NuxtLink>
    <br />
    <NuxtLink to="/logout">ログアウト</NuxtLink>
  </div>
</template>

<script>
import firebase from '~/plugins/firebase'
export default {
  data() {
    return {
      message: 'ログインができておりません',
      result: ''
    }
  },
  created() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.message = 'ログイン済みです'
      }
    })
  },
  mounted() {
    axios.get('http://127.0.0.1:8000/test1')
      .then((response) => {
        this.result = response.data.result
      })
      .catch((error) => {
        console.log(error)
        this.result = 'ERROR'
      })
  }
}
</script>