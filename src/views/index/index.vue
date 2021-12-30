<template>
    <div>
        <ul>
            <router-link tag="li" v-for="item in routeList" :key="item.path" :to="item.path">{{item.meta.name}}</router-link>
        </ul>
    </div>
</template>

<script>
import { ref } from "vue"
import { useRoute, useRouter } from 'vue-router';
export default {
    setup() {
        const router = useRouter()
        const route = useRoute()
        const routeList = ref(router.getRoutes())
        return {
            routeList
        }
    }
}
</script>