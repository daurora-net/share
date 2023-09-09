<template>
  <div class="flex">
    <div class="left">
      <SideNav />
    </div>
    <div class="right">
      <div class="title">
        <p>ホーム</p>
      </div>
      <Message v-if="post" :post="post" :uid="uid" @like="like" @unlike="unlike" @deletePost="deletePost" />
      <div v-if="post" class="comment">
        <div class="comment-title">
          <p>コメント</p>
        </div>
        <div class="message" v-for="comment in post.comments" :key="comment.id">
          <div class="flex">
            <p class="comment-name">{{ comment.user.name }}</p>
          </div>
          <div>
            <p class="comment-text">{{ comment.comment }}</p>
          </div>
        </div>
        <validation-observer ref="obs" v-slot="ObserverProps">
          <validation-provider v-slot="{ errors }" rules="required|max:120" mode="lazy">
            <input v-model="content" type="text" name="コメント">
            <div class="error" v-if="hasAttemptedSubmission">{{ errors[0] }}</div>
          </validation-provider>
          <button @click="postComment" :disabled="ObserverProps.invalid || !ObserverProps.validated"
            class="share_button">コメント</button>
        </validation-observer>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from "~/plugins/firebase";
export default {
  data() {
    return {
      post: null,
      uid: null,
      content: null,
    };
  },
  methods: {
    async fetchPost() {
      const { data } = await this.$axios.get(`/v1/post/${this.$route.params.id}`);
      this.post = data.post;
    },
    async fetchData() {
      firebase.auth().onAuthStateChanged(async (user) => {
        if (user) {
          this.uid = user.uid;
          await this.saveUserToDatabase(user);
          await this.fetchPost();
        }
      });
    },
    async saveUserToDatabase(user) {
      const { uid, email, displayName } = user;
      try {
        await this.$axios.post('/v1/user', {
          user_id: uid,
          email: email,
          name: displayName || "未設定"
        });
      } catch (error) {
        console.error("Error saving user to database:", error);
      }
    },
    async postComment() {
      // Firebaseでユーザの認証状態を確認
      firebase.auth().onAuthStateChanged(async (user) => {
        if (!user) {
          alert("認証されていません。再度ログインしてください。");
          return;
        }

        try {
          const { data } = await this.$axios.post("/v1/comment", {
            post_id: this.post.id,
            user_id: user.uid,
            comment: this.content,
          });

          // コメントの内容をリセット
          this.content = "";

          // コメントをVueのデータ構造に追加
          this.post.comments.push(data.comment);

          // 通知を表示
          alert("コメントを追加しました");
        } catch (error) {
          console.error("コメントの追加中にエラーが発生しました:", error);
          alert("コメントの追加中にエラーが発生しました。再試行してください。");
        }
      });
    },

    async like() {

      const { data } = await this.$axios.post("/v1/like",
        {
          post_id: this.post.id,
          user_id: this.uid,
        }
      );
      this.post.likes.push(data.like);
    },
    async unlike() {
      const findLike = this.post.likes.find(
        (like) => like.user_id === this.uid
      );
      await this.$axios.delete(`/v1/like/${findLike.id}`);

      const findLikeIdx = this.post.likes.findIndex(
        (like) => like.id === findLike.id
      );
      this.post.likes.splice(findLikeIdx, 1);
    },
    async deletePost(event) {
      await this.$axios.delete(`/v1/post/${event.id}`);
      this.$router.push("/");
    },
  },
  created() {
    this.fetchData();
  },
};
</script>