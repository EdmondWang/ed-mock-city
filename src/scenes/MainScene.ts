import * as PIXI from 'pixi.js'
import { Player } from '../sprites/Player'
import { Game } from '../game/Game'

export class MainScene {
  private game: Game
  public container: PIXI.Container
  private player: Player | null = null
  private background: PIXI.Graphics | null = null
  private score: number = 0
  private scoreText: PIXI.Text | null = null
  private isInitialized: boolean = false
  private keydownHandler: (e: KeyboardEvent) => void
  private keyupHandler: (e: KeyboardEvent) => void

  constructor(game: Game) {
    this.game = game
    this.container = new PIXI.Container()
    this.keydownHandler = (e: KeyboardEvent) => this.handleKeyDown(e)
    this.keyupHandler = (e: KeyboardEvent) => this.handleKeyUp(e)
  }

  init(): void {
    this.createBackground()
    this.createPlayer()
    this.createScoreText()
    this.setupEventListeners()
    
    // 启动游戏循环
    if (this.game['app']) {
      this.game['app'].ticker.add((delta: number) => {
        this.update(delta)
      })
    }

    this.isInitialized = true
  }

  private createBackground(): void {
    // 创建背景
    this.background = new PIXI.Graphics()
    if (this.game['app']) {
      this.background.beginFill(0x87ceeb)
      this.background.drawRect(0, 0, this.game['app'].screen.width, this.game['app'].screen.height)
      this.background.endFill()
      this.container.addChild(this.background)
    }
  }

  private createPlayer(): void {
    // 创建玩家精灵
    this.player = new Player()
    if (this.game['app']) {
      this.player.sprite.position.set(this.game['app'].screen.width / 2, this.game['app'].screen.height / 2)
      this.container.addChild(this.player.sprite)
    }
  }

  private createScoreText(): void {
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

  private setupEventListeners(): void {
    // 监听键盘事件
    window.addEventListener('keydown', this.keydownHandler)
    window.addEventListener('keyup', this.keyupHandler)
  }

  private handleKeyDown(e: KeyboardEvent): void {
    if (this.player) {
      this.player.handleKeyDown(e)
    }
  }

  private handleKeyUp(e: KeyboardEvent): void {
    if (this.player) {
      this.player.handleKeyUp(e)
    }
  }

  update(delta: number): void {
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

  private updateScore(): void {
    this.score++
    if (this.scoreText) {
      this.scoreText.text = `Score: ${this.score}`
    }
  }

  resize(width: number, height: number): void {
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

  destroy(): void {
    // 移除事件监听
    window.removeEventListener('keydown', this.keydownHandler)
    window.removeEventListener('keyup', this.keyupHandler)

    // 移除游戏循环
    if (this.game['app']) {
      this.game['app'].ticker.remove(this.update, this)
    }

    // 销毁玩家
    if (this.player) {
      this.player.destroy()
    }

    // 销毁容器中的所有元素
    this.container.removeChildren()
  }
}