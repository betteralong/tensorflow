import { createRouter, createWebHistory } from 'vue-router';
import Index from "../views/index/index.vue"
const routes = [
    { path: '/', component: Index, meta: { name: '首页' } },
    { path: '/lesson1', meta: { name: '1' }, component: () => import('../views/lesson1/index.vue')},
    { path: '/lesson2', meta: { name: '2' }, component: () => import('../views/lesson2/index.vue')},
    { path: '/lesson3', meta: { name: '3' }, component: () => import('../views/lesson3/index.vue')},
    { path: '/lesson4', meta: { name: '4' }, component: () => import('../views/lesson4/index.vue')},
    { path: '/lesson5', meta: { name: '5' }, component: () => import('../views/lesson5/index.vue')},
    { path: '/music', meta: { name: '切歌' } ,component: () => import('../views/music/index.vue')},
  ]

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;