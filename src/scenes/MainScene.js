import * as PIXI from 'pixi.js'
import { Player } from '../sprites/Player.js'

export class MainScene {
  constructor(game) {
    this.game = game
    this.container = new PIXI.Container()
    this.player = null
    this.background = null
    this.score = 0
    this.scoreText = null
    this.isInitialized = false
  }

  init() {
    this.createBackground()
    this.createPlayer()
    this.createScoreText()
    this.setupEventListeners()
    
    // 启动游戏循环
    this.game.app.ticker.add((delta) => {
      this.update(delta)
    })

    this.isInitialized = true
  }

  createBackground() {
    // 创建背景
    this.background = new PIXI.Graphics()
    this.background.beginFill(0x87ceeb)
    this.background.drawRect(0, 0, this.game.app.screen.width, this.game.app.screen.height)
    this.background.endFill()
    this.container.addChild(this.background)
  }

  createPlayer() {
    // 创建玩家精灵
    this.player = new Player()
    this.player.sprite.position.set(this.game.app.screen.width / 2, this.game.app.screen.height / 2)
    this.container.addChild(this.player.sprite)
  }

  createScoreText() {
    // 创建分数文本
    this.scoreText = new PIXI.Text('Score: 0', {
      fontFamily: 'Arial',
      fontSize: 24,
      fill: 0xffffff,
      align: 'center'
    })
    this.scoreText.position.set(20, 20)
    this.container.addChild(this.scoreText)
  }

  setupEventListeners() {
    // 监听键盘事件
    window.addEventListener('keydown', (e) => {
      this.handleKeyDown(e)
    })

    window.addEventListener('keyup', (e) => {
      this.handleKeyUp(e)
    })
  }

  handleKeyDown(e) {
    if (this.player) {
      this.player.handleKeyDown(e)
    }
  }

  handleKeyUp(e) {
    if (this.player) {
      this.player.handleKeyUp(e)
    }
  }

  update(delta) {
    if (!this.isInitialized) {
      this.init()
    }

    // 更新玩家
    if (this.player) {
      this.player.update(delta)
    }

    // 更新分数
    this.updateScore()
  }

  updateScore() {
    this.score++
    this.scoreText.text = `Score: ${this.score}`
  }

  resize(width, height) {
    // 更新背景大小
    if (this.background) {
      this.background.clear()
      this.background.beginFill(0x87ceeb)
      this.background.drawRect(0, 0, width, height)
      this.background.endFill()
    }

    // 确保玩家在屏幕中央
    if (this.player && this.player.sprite) {
      this.player.sprite.position.set(width / 2, height / 2)
    }
  }

  destroy() {
    // 移除事件监听
    window.removeEventListener('keydown', this.handleKeyDown)
    window.removeEventListener('keyup', this.handleKeyUp)

    // 移除游戏循环
    this.game.app.ticker.remove(this.update, this)

    // 销毁玩家
    if (this.player) {
      this.player.destroy()
    }

    // 销毁容器中的所有元素
    this.container.removeChildren()
  }
}