// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.directive('just-drag', // 自定义指令                                      JS
  {
    bind: function (el, binding) {
      let oDiv = el // 当前元素
      oDiv.onmousedown = function (e) {
        // 鼠标按下，计算当前元素距离可视区的距离
        let disX = e.clientX - oDiv.offsetLeft
        let disY = e.clientY - oDiv.offsetTop
        if (typeof binding.value.startDrag === 'function')binding.value.startDrag(oDiv)
        document.onmousemove = function (e) {
          // 通过事件委托，计算移动的距离
          const minLeftOffset = typeof binding.value.moveXInterval === 'object' && typeof binding.value.moveXInterval[0] === 'number' ? binding.value.moveXInterval[0] : -99999
          const minTopOffset = typeof binding.value.moveYInterval === 'object' && typeof binding.value.moveYInterval[0] === 'number' ? binding.value.moveYInterval[0] : -99999
          const maxLeftOffset = typeof binding.value.moveXInterval === 'object' && typeof binding.value.moveXInterval[1] === 'number' ? binding.value.moveXInterval[1] - oDiv.offsetWidth : 99999
          const maxTopOffset = typeof binding.value.moveYInterval === 'object' && typeof binding.value.moveYInterval[1] === 'number' ? binding.value.moveYInterval[1] - oDiv.offsetHeight : 99999
          let l = e.clientX - disX > minLeftOffset ? e.clientX - disX : 0
          let t = e.clientY - disY > minTopOffset ? e.clientY - disY : 0
          l = l < maxLeftOffset ? l : maxLeftOffset
          t = t < maxTopOffset ? t : maxTopOffset
          // 移动当前元素
          oDiv.style.left = l + 'px'
          oDiv.style.top = t + 'px'
          // 将此时的位置传出去
          binding.value.pos = {
            mouseX: e.pageX,
            mouseY: e.pageY,
            offsetLeft: l,
            offsetTop: t,
            maxLeftOffset,
            maxTopOffset,
            width: oDiv.offsetWidth
          }
        }
        document.onmouseup = function (e) {
          document.onmousemove = null
          document.onmouseup = null
          if (typeof binding.value.finishDrag === 'function')binding.value.finishDrag(oDiv)
        }
      }
    }
  }
)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: {
    App
  },
  template: '<App/>'
})
