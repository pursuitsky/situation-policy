<template>
    <div>
        <me-menu></me-menu>
        <router-view class="me-content"></router-view>
    </div>
</template>

<script>
import MeMenu from './menu'
export default {
    name: 'admin',
    components: {
        MeMenu
    },
    // beforeRouteEnter (to, from, next) {
    //     if (from.path != '/login') {
    //         next('/login')
    //     } else {
    //         next()
    //     }
    //     // alert(from.path)
    // },
}
</script>

<style scoped>
.me-content{
    margin-top: 100px auto 140px;
}
</style>