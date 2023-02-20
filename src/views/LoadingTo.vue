<template>
    <div class="LoadingTo"></div>
</template>
  
<script>
export default {
    name: "LoadingTo",

    async created() {
        this.$router.replace('/inicio');
    },
};
</script>