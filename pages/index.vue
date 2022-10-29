<template>
  <div class="container">
    <h1>ホーム</h1>

    <p>{{ this.message }}</p>

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
import Header from "@/components/header.vue";
import axios from 'axios'
export default {
  components: {
    Header,
  },
  data() {
    return {
      message: 'ログインができておりません',
      message: '',
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
      .then((res) => {
        console.log(res.data)
        this.message = res.data
      })
      .catch((error) => {
        console.log(error)
      })
  }
}
</script>