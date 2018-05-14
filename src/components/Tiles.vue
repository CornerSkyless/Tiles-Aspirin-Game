<template>
  <div>
    <div class="tiles">
      <div class="tiles-ground">
        <div v-for="row in ground" :key="row.row" class="brick-row">
          <div v-for="col in row"
               class="brick"
               :style="brickStyle"
               :key="col.col"
               :class="{
               'brick-hover':hoverBrickOnGroundList.indexOf(col.row*groundSize+col.col)>=0,
               'brick-filled':col.filled,
               'brick-error':wrongFilledList.indexOf(col.row*groundSize+col.col)>=0,
               'no-bt':col.connected.indexOf((col.row-1)*groundSize+col.col)>=0,
               'no-bl':col.connected.indexOf((col.row)*groundSize+col.col-1)>=0,
               'no-bb':col.connected.indexOf((col.row+1)*groundSize+col.col)>=0,
               'no-br':col.connected.indexOf((col.row)*groundSize+col.col+1)>=0
               }"
               @click.right="deleteBrick(col)" @contextmenu.prevent
          >
          </div>
        </div>
      </div>
      <div v-just-drag="dragOption" id="TopLeft" class="dragable" :style="dragTopLeftStyle">
        <div class="brick-row">
          <div class="brick brick-filled no-br no-bb" :style="brickStyle"></div>
          <div class="brick brick-filled no-bl" :style="brickStyle"></div>
        </div>
        <div class="brick-row">
          <div class="brick brick-filled no-bt" :style="brickStyle"></div>
        </div>
      </div>
      <div v-just-drag="dragOption" id="TopRight" class="dragable" :style="dragTopRightStyle">
        <div class="brick-row">
          <div class="brick brick-filled no-br" :style="brickStyle"></div>
          <div class="brick brick-filled no-bl no-bb" :style="brickStyle"></div>
        </div>
        <div class="brick-row">
          <div class="brick brick-none" :style="brickStyle"></div>
          <div class="brick brick-filled no-bt" :style="brickStyle"></div>
        </div>
      </div>
      <div v-just-drag="dragOption" id="BottomLeft" class="dragable" :style="dragBottomLeftStyle">
        <div class="brick-row">
          <div class="brick brick-filled no-bb" :style="brickStyle"></div>
        </div>
        <div class="brick-row">
          <div class="brick brick-filled no-bt no-br" :style="brickStyle"></div>
          <div class="brick brick-filled no-bl" :style="brickStyle"></div>
        </div>
      </div>
      <div v-just-drag="dragOption" id="BottomRight" class="dragable" :style="dragBottomRightStyle">
        <div class="brick-row">
          <div class="brick brick-none" :style="brickStyle"></div>
          <div class="brick brick-filled no-bb" :style="brickStyle"></div>
        </div>
        <div class="brick-row">
          <div class="brick brick-filled no-br" :style="brickStyle"></div>
          <div class="brick brick-filled no-bl no-bt" :style="brickStyle"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
  @import "../assets/style.scss";
</style>

<script>

export default {
  name: 'Tiles',
  data () {
    const vm = this
    return {
      groundSize: 8,
      groundHeight: 400,
      brickHeight: 0,
      pos: {},
      stepId: 0,
      dragOption: {
        pos: {},
        moveXInterval: [0, 800],
        moveYInterval: [0, 400],
        finishDrag (el) {
          let wrongFill = false
          vm.hoverBrickOnGroundList.forEach(pos => {
            const row = Math.floor(pos / vm.groundSize)
            const col = pos % vm.groundSize
            if (vm.ground[row] && vm.ground[row][col] && vm.ground[row][col].filled) {
              wrongFill = true
            }
          })
          if (!wrongFill) {
            vm.hoverBrickOnGroundList.forEach(pos => {
              const row = Math.floor(pos / vm.groundSize)
              const col = pos % vm.groundSize
              if (vm.ground[row] && vm.ground[row][col]) {
                vm.ground[row][col].filled = true
                vm.ground[row][col].stepId = vm.stepId
                vm.ground[row][col].connected = vm.hoverBrickOnGroundList
              }
            })
            vm.stepId++
          }
          const style = vm['drag' + el.id + 'Style']
          el.style.left = style.left
          el.style.top = style.top
          vm.dragOption.pos.offsetLeft = 99999
          vm.dragOption.pos.offsetTop = 99999
        },
        startDrag (el) {
          const map = {
            TopLeft: [[true, true], [true, false]],
            TopRight: [[true, true], [false, true]],
            BottomLeft: [[true, false], [true, true]],
            BottomRight: [[false, true], [true, true]]
          }
          vm.activeDrag = map[el.id] || [[true, true], [true, false]]
        }
      },
      ground: [],
      activeDrag: [[true, false], [true, true]]
    }
  },
  methods: {
    deleteBrick (item) {
      item.connected.forEach(pos => {
        const row = Math.floor(pos / this.groundSize)
        const col = pos % this.groundSize
        this.ground[row][col].filled = false
        this.ground[row][col].stepId = this.stepId
        this.ground[row][col].connected = []
      })
      this.stepId++
    }
  },
  computed: {
    brickStyle () {
      return {
        height: this.brickHeight - 2 + 'px',
        width: this.brickHeight - 2 + 'px'
      }
    },
    dragPositionMatrix () {
      const mainPos = this.dragOption.pos
      if (this.dragOption.pos.offsetLeft >= this.groundHeight - this.brickHeight * (1.6) ||
          this.dragOption.pos.offsetTop >= this.groundHeight - this.brickHeight * (1.6)) {
        return [
          [{row: 999, col: 999}, {row: 999, col: 999}],
          [{row: 999, col: 999}, {row: 999, col: 999}]
        ]
      }
      let brickMatrix = [
        [
          {left: mainPos.offsetLeft + this.brickHeight / 2, top: mainPos.offsetTop + this.brickHeight / 2},
          {
            left: mainPos.offsetLeft + this.brickHeight + this.brickHeight / 2,
            top: mainPos.offsetTop + this.brickHeight / 2
          }
        ],
        [
          {
            left: mainPos.offsetLeft + this.brickHeight / 2,
            top: mainPos.offsetTop + this.brickHeight + this.brickHeight / 2
          },
          {
            left: mainPos.offsetLeft + this.brickHeight + this.brickHeight / 2,
            top: mainPos.offsetTop + this.brickHeight + this.brickHeight / 2
          }
        ]
      ]
      brickMatrix = brickMatrix.map(row => {
        return row.map(item => {
          return {
            row: Math.floor(item.top / this.brickHeight),
            col: Math.floor(item.left / this.brickHeight)
          }
        })
      })
      return brickMatrix
    },
    hoverBrickOnGroundList () {
      let list = []
      const dragPositionMatrix = this.dragPositionMatrix
      dragPositionMatrix.forEach((row, i) => {
        row.forEach((item, j) => {
          if (this.activeDrag[i][j]) list.push(item.row * this.groundSize + item.col)
        })
      })
      return list
    },
    wrongFilledList () {
      let wrongFill = false
      this.hoverBrickOnGroundList.forEach(pos => {
        const row = Math.floor(pos / this.groundSize)
        const col = pos % this.groundSize
        if (this.ground[row] && this.ground[row][col] && this.ground[row][col].filled) {
          wrongFill = true
        }
      })
      if (wrongFill) return this.hoverBrickOnGroundList
      else return []
    },
    dragTopLeftStyle () {
      return {
        left: this.groundHeight + this.brickHeight + 'px',
        top: this.brickHeight + 'px'
      }
    },
    dragTopRightStyle () {
      return {
        left: this.groundHeight + this.brickHeight * 4 + 'px',
        top: this.brickHeight + 'px'
      }
    },
    dragBottomLeftStyle () {
      return {
        left: this.groundHeight + this.brickHeight + 'px',
        top: this.brickHeight * 4 + 'px'
      }
    },
    dragBottomRightStyle () {
      return {
        left: this.groundHeight + this.brickHeight * 4 + 'px',
        top: this.brickHeight * 4 + 'px'
      }
    }
  },
  created () {
    this.brickHeight = this.groundHeight / this.groundSize
    for (let i = 0; i < this.groundSize; i++) {
      this.ground.push([])
      for (let j = 0; j < this.groundSize; j++) {
        this.ground[i].push({filled: false, row: i, col: j, connected: []})
      }
    }
    this.ground[3][1].filled = true
  },
  components: {}
}
</script>
