<template>
    <div class="profile">
        <h1 class="header">Мой профиль</h1>
        <div class="wrapper">
            <div class="content">
                <ProfileLinks :links="profileLinks" />
                <NuxtPage />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { profileLinks } from '~/components/profileLinks/profileLinksTypes';
import Profile from '~/components/profileComponents/profile/Profile.vue';
definePageMeta({
    layout: 'default'
})
</script>

<style scoped lang="scss">
.wrapper {
    .content {
        display: flex;
        flex-direction: row;
        gap: $spacing-md;

    }
}

.profile {
    width: $content-width;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: $spacing-xl;
}
</style>