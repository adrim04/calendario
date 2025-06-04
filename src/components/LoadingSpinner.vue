<template>
    <div class="loading-container" :class="{ 'overlay': overlay }">
        <div class="spinner" :class="size">
            <div class="spinner-circle"></div>
        </div>
        <p v-if="message" class="loading-message">{{ message }}</p>
    </div>
</template>

<script>
export default {
    name: 'LoadingSpinner',
    props: {
        size: {
            type: String,
            default: 'medium',
            validator: (value) => ['small', 'medium', 'large'].includes(value)
        },
        message: {
            type: String,
            default: ''
        },
        overlay: {
            type: Boolean,
            default: false
        }
    }
}
</script>

<style lang="scss" scoped>
.loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;

    &.overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(255, 255, 255, 0.9);
        z-index: 9999;
    }
}

.spinner {
    &.small .spinner-circle {
        width: 20px;
        height: 20px;
        border-width: 2px;
    }

    &.medium .spinner-circle {
        width: 40px;
        height: 40px;
        border-width: 3px;
    }

    &.large .spinner-circle {
        width: 60px;
        height: 60px;
        border-width: 4px;
    }
}

.spinner-circle {
    border: 3px solid #f3f3f3;
    border-top: 3px solid #42b983;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

.loading-message {
    margin: 0;
    color: #6c757d;
    font-size: 0.875rem;
    text-align: center;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>
