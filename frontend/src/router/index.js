import { createRouter, createWebHistory } from 'vue-router'
import HomeComponent from '../components/HomeComponent/HomeComponent.vue'
import CreateRoomView from '../views/CreateRoomView.vue'
import JoinRoomView from '../views/JoinRoomView.vue'
import GameComponent from '@/components/Game/GameComponent.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeComponent },
    { path: '/create-room', name: 'create-room', component: CreateRoomView },
    { path: '/join-room', name: 'join-room', component: JoinRoomView, props: true },
    { path: '/game', name: 'game', component: GameComponent, props: true },
  ],
})

export default router
