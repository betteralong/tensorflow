<template>
    <div>
        <ul>
            <router-link class="lesson-link" tag="li" v-for="item in routeList" :key="item.path" :to="item.path">{{item.meta.name}}</router-link>
        </ul>
    </div>
</template>

<script>
import { ref } from "vue"
import { useRoute, useRouter } from 'vue-router';
export default {
    setup() {
        const router = useRouter()
        const routeList = ref(router.getRoutes())
        return {
            routeList
        }
    }
}
</script>

<style>
.lesson-link{
  display: block;
  padding: 12px;;
}
</style>