import * as PIXI from 'pixi.js'
import { MainScene } from '../scenes/MainScene'

export class Game {
  private app: PIXI.Application | null = null
  private currentScene: MainScene | null = null

  init(): void {
    // 创建PIXI应用
    this.app = new PIXI.Application({
      width: 800,
      height: 600,
      backgroundColor: 0x1099bb,
      resolution: window.devicePixelRatio || 1,
      antialias: true
    })

    // 将canvas添加到DOM
    const appContainer = document.querySelector('#app')
    if (appContainer) {
      appContainer.appendChild(this.app.view)
    }

    // 设置响应式
    this.setupResponsive()

    // 初始化主场景
    this.switchScene('main')
  }

  private setupResponsive(): void {
    window.addEventListener('resize', () => {
      this.resize()
    })
    this.resize()
  }

  private resize(): void {
    if (!this.app) return
    
    const appContainer = document.querySelector('#app')
    if (!appContainer) return
    
    const width = appContainer.clientWidth
    const height = appContainer.clientHeight
    
    this.app.renderer.resize(width, height)
    
    if (this.currentScene && this.currentScene.resize) {
      this.currentScene.resize(width, height)
    }
  }

  private switchScene(sceneName: string): void {
    if (!this.app) return
    
    // 移除当前场景
    if (this.currentScene) {
      this.app.stage.removeChild(this.currentScene.container)
      this.currentScene.destroy()
    }

    // 创建新场景
    switch (sceneName) {
      case 'main':
        this.currentScene = new MainScene(this)
        break
      // 可以添加更多场景
      default:
        this.currentScene = new MainScene(this)
    }

    // 添加新场景到舞台
    if (this.currentScene) {
      this.app.stage.addChild(this.currentScene.container)
    }
  }

  update(delta: number): void {
    if (this.currentScene && this.currentScene.update) {
      this.currentScene.update(delta)
    }
  }

  destroy(): void {
    if (this.currentScene) {
      this.currentScene.destroy()
    }
    if (this.app) {
      this.app.destroy(true)
    }
  }
}