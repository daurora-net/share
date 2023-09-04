<template>
  <div class="flex">
    <div class="left">
      <SideNav @shared="addPost" />
    </div>
    <div class="right">
      <div class="title">
        <p>ホーム</p>
      </div>
      <div v-for="post in posts" :key="post.id">
        <Message :post="post" :uid="uid" @like="like(post)" @unlike="unlike(post)" @deletePost="deletePost" />
      </div>
    </div>
  </div>
</template>

<script>
import firebase from "~/plugins/firebase";
export default {
  middleware: "auth",
  data() {
    return {
      posts: [],
      uid: null,
    };
  },
  methods: {
    async getPostData() {
      try {
        const { data } = await this.$axios.get("/v1/post");
        this.posts = data.posts;
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    },
    fetchData() {
      firebase.auth().onAuthStateChanged((user) => {
        this.uid = user.uid;
        this.getPostData();
      });
    },
    async like(post) {
      const { data } = await this.$axios.post("/v1/like",
        {
          post_id: post.id,
          user_id: this.uid,
        }
      );
      post.likes.push(data.like);
    },
    async unlike(post) {
      const findLike = post.likes.find((like) => like.user_id === this.uid);
      await this.$axios.delete(`/v1/like/${findLike.id}`);

      const findLikeIdx = post.likes.findIndex(
        (like) => like.id === findLike.id
      );
      post.likes.splice(findLikeIdx, 1);
    },
    async deletePost(event) {
      await this.$axios.delete(`/v1/post/${event.id}`);

      const findPostIdx = this.posts.findIndex((post) => post.id === event.id);
      this.posts.splice(findPostIdx, 1);
    },
    addPost(post) {
      this.posts.push(post);
    },
  },
  created() {
    this.fetchData();
  },
};
</script>