<script setup>
import axios from 'axios';
import Button from 'primevue/button'
import { onMounted } from 'vue';
const backendUrl = import.meta.env.VITE_BACKEND_URL
let isOwner = ref('false')

onMounted(()=>{
    const userId = localStorage.getItem('userId')
    const gameId = localStorage.getItem('gameId')
    axios.get(`${backendUrl}/game/guess`,{
        gameId: localStorage.getItem('gameId'),
        userId:localStorage.getItem('userId')
    }).then(res=>{
        if(res.data.isOwner){
            isOwner.value = true;
        }
    })
})
</script>

<template>
    <h1>GUESS THE IMPOSTER!!</h1>
    <Button v-if="isOwner" label="PlayAgain"/>
</template>