<template>
  <div class="message">
    <div class="flex">
      <p class="name">{{ post.user.name }}</p>
      <img class="icon" src="../assets/img/heart.png" @click="handleToggleLike" />
      <p class="number">{{ post.likes.length }}</p>
      <img class="icon" src="../assets/img/cross.png" @click="emitDeletePost" />
      <img class="icon detail" src="../assets/img/detail.png" @click="goPostDetail" v-if="$route.name === 'index'" />
    </div>
    <p class="text">{{ post.content }}</p>
  </div>
</template>

<script>
export default {
  props: {
    post: Object,
    uid: String,
  },
  methods: {
    async handleToggleLike() {
      if (this.isLiked()) {
        this.$emit("unlike");
      } else {
        this.$emit("like");
      }
    },
    isLiked() {
      const userIds = this.post.likes.map((like) => like.user_id);
      return userIds.includes(this.uid);
    },
    emitDeletePost() {
      this.$emit("deletePost", this.post);
    },
    goPostDetail() {
      this.$router.push(`/posts/${this.post.id}`);
    },
  },
};
</script>