<template>
  <router-view v-slot="{ Component }">
    <!-- 添加页面切换动画 -->
    <transition 
      name="fade"
      mode="out-in"
      @before-leave="beforeLeave"
      @enter="enter"
      @after-enter="afterEnter">
      <keep-alive>
        <component 
          :is="Component" 
          v-if="$route.meta.keepAlive" />
      </keep-alive>
    </transition>
    <transition name="fade" mode="out-in">
      <component 
        :is="Component" 
        v-if="!$route.meta.keepAlive" />
    </transition>
  </router-view>
</template>

<script setup>
import { nextTick } from 'vue'

// 页面切换过渡钩子
const beforeLeave = (el) => {
  // 离开前保存滚动位置
  el._scrollPosition = window.scrollY
}

const enter = (el) => {
  // 进入时恢复滚动位置
  if(el._scrollPosition) {
    nextTick(() => {
      window.scrollTo(0, el._scrollPosition)
    })
  }
}

const afterEnter = () => {
  // 过渡完成后清理
  window.scrollTo(0, 0)
}
</script>

<style>
/* 优化过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 优化滚动性能 */
* {
  -webkit-overflow-scrolling: touch;
}

/* 禁用不必要的动画 */
* {
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
}

/* 使用硬件加速 */
.page-content {
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000;
}
</style> 