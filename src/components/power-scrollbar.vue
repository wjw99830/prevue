<template>
  <div class="power-scrollbar" ref="wrapper" @mousemove="onHover">
    <slot></slot>
    <div class="scroll-pathway scroll-y" :class="{ active: scrolling && scrollDirection === 'y' }">
      <div
        onselectstart="return false"
        class="scroll-thumb"
        v-show="scrollThumbY < 100"
        :style="{ transform: `translateY(${scrollTop}%)`, height: scrollThumbY + '%', backgroundColor: color || 'black' }"
        @mousedown="onScrollStart($event, 'y')"
      ></div>
    </div>
    <div class="scroll-pathway scroll-x" :class="{ active: scrolling && scrollDirection === 'x' }">
      <div
        onselectstart="return false"
        class="scroll-thumb"
        v-show="scrollThumbX < 100"
        :style="{ transform: `translateX(${scrollLeft}%)`, width: scrollThumbX + '%', backgroundColor: color || 'black' }"
        @mousedown="onScrollStart($event, 'x')"
      ></div>
    </div>
  </div>
</template>
<script lang='ts'>
  import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
  @Component({
    name: 'power-scrollbar',
  })
  export default class PowerScrollbar extends Vue {
    @Prop()
    color!: string;

    scrolling = false;
    scrollDirection = '';
    scrollThumbY = 0;
    scrollThumbX = 0;
    scrollTop = 0;
    scrollLeft = 0;
    scrollStartPosition = {
      x: 0,
      y: 0,
      top: 0,
      left: 0,
    };

    get routePath() {
      return this.$route.path;
    }
    get maxScrollTop() {
      const wrapper = this.$refs.wrapper as HTMLElement;
      if (!wrapper) {
        return 0;
      }
      const content = wrapper.children[0];
      return (1 - content.clientHeight / content.scrollHeight) * 100 / this.scrollThumbY * 100;
    }
    get maxScrollLeft() {
      const wrapper = this.$refs.wrapper as HTMLElement;
      if (!wrapper) {
        return 0;
      }
      const content = wrapper.children[0];
      return (1 - content.clientWidth / content.scrollWidth) * 100 / this.scrollThumbX * 100;
    }

    onScrollBinding: ((e: Event) => void) | null = null;
    onScroll(e: Event) {
      if (this.scrolling) {
        return;
      }
      const wrapper = this.$refs.wrapper as HTMLElement;
      const content = wrapper.children[0];
      if (this.scrollThumbY < 100) {
        this.scrollTop = content.scrollTop / content.scrollHeight * 100 / this.scrollThumbY * 100;
      }
      if (this.scrollThumbX < 100) {
        this.scrollLeft = content.scrollLeft / content.scrollWidth * 100 / this.scrollThumbX * 100;
      }
    }
    onHover() {
      const wrapper = this.$refs.wrapper as HTMLElement;
      const content = wrapper.children[0];
      const scrollThumbY = content.clientHeight / content.scrollHeight * 100;
      const scrollThumbX = content.clientWidth / content.scrollWidth * 100;
      if (this.scrollThumbY !== scrollThumbY || this.scrollThumbX !== scrollThumbX) {
        this.scrollThumbY = scrollThumbY;
        this.scrollThumbX = scrollThumbX;
        if (!this.onScrollBinding) {
          this.onScrollBinding = this.onScroll.bind(this);
          content.addEventListener('scroll', this.onScrollBinding);
        }
      }
    }
    onScrollEnd() {
      this.scrolling = false;
    }
    mounted() {
      document.addEventListener('mouseup', this.onScrollEnd);
      document.addEventListener('mousemove', this.onScrolling);
    }
    @Watch('routePath')
    onRouteUpdate() {
      const wrapper = this.$refs.wrapper as HTMLElement;
      const content = wrapper.children[0];
      if (this.onScrollBinding) {
        content.removeEventListener('scroll', this.onScrollBinding);
      }
      this.onScrollBinding = null;
      this.scrolling = false;
      this.scrollDirection = '';
      this.scrollThumbY = 0;
      this.scrollThumbX = 0;
      this.scrollTop = 0;
      this.scrollLeft = 0;
      this.scrollStartPosition = {
        x: 0,
        y: 0,
        top: 0,
        left: 0,
      };
      this.$nextTick(() => this.onHover());
    }
    beforeDestroy() {
      const wrapper = this.$refs.wrapper as HTMLElement;
      const content = wrapper.children[0];
      if (this.onScrollBinding) {
        content.removeEventListener('scroll', this.onScrollBinding);
      }
      document.removeEventListener('mouseup', this.onScrollEnd);
      document.removeEventListener('mousemove', this.onScrolling);
    }
    onScrollStart(e: MouseEvent, direction: 'x' | 'y') {
      this.scrolling = true;
      this.scrollDirection = direction;
      this.scrollStartPosition.x = e.x;
      this.scrollStartPosition.y = e.y;
      this.scrollStartPosition.top = this.scrollTop;
      this.scrollStartPosition.left = this.scrollLeft;
    }
    onScrolling(e: MouseEvent) {
      const direction = this.scrollDirection;
      if (this.scrolling) {
        const { x, y } = e;
        const wrapper = this.$refs.wrapper as HTMLElement;
        const content = wrapper.children[0];
        if (direction === 'y') {
          const dy = y - this.scrollStartPosition.y;
          const wrapperH = wrapper.clientHeight;
          const top = this.scrollStartPosition.top + dy / wrapperH * 100 / this.scrollThumbY * 100;
          this.scrollTop = Math.min(this.maxScrollTop, Math.max(0, top));
          const scrollTop = this.scrollTop * 0.01 * wrapperH * this.scrollThumbY * 0.01 / wrapperH * content.scrollHeight
          content.scrollTop = scrollTop;
        } else {
          const dx = x - this.scrollStartPosition.x;
          const wrapperW = wrapper.clientWidth;
          const left = this.scrollStartPosition.left + dx / wrapperW * 100 / this.scrollThumbX * 100;
          this.scrollLeft = Math.min(this.maxScrollLeft, Math.max(0, left));
          content.scrollLeft = this.scrollLeft * 0.01 * wrapperW * this.scrollThumbX * 0.01 / wrapperW * content.scrollWidth;
        }
      }
    }
  }
</script>
<style lang="less">
  .power-scrollbar {
    position: relative;
    // display: inline-block;
    overflow: hidden;
    &:hover > .scroll-pathway {
      opacity: .3;
    }
    > *:first-child {
      overflow: scroll;
      width: calc(100% + 17px);
      height: calc(100% + 17px);
      &::-webkit-scrollbar {
        width: 17px;
        height: 17px;
        background-color: transparent;
      }
    }
    > .scroll-pathway {
      position: absolute;
      z-index: 1;
      opacity: 0;
      transition: opacity .2s;
      cursor: pointer;
      &.active {
        opacity: .3;
      }
    }
    > .scroll-y {
      height: 100%;
      width: 7px;
      right: 0;
      top: 0;
    }
    > .scroll-x {
      width: 100%;
      height: 7px;
      bottom: 0;
    }
    .scroll-thumb {
      width: 100%;
      height: 100%;
      border-radius: 30px;
    }
  }
</style>
