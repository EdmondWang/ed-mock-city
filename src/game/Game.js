import * as PIXI from 'pixi.js'
import { MainScene } from '../scenes/MainScene.js'

export class Game {
  constructor() {
    this.app = null
    this.currentScene = null
  }

  init() {
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
    appContainer.appendChild(this.app.view)

    // 设置响应式
    this.setupResponsive()

    // 初始化主场景
    this.switchScene('main')
  }

  setupResponsive() {
    window.addEventListener('resize', () => {
      this.resize()
    })
    this.resize()
  }

  resize() {
    const appContainer = document.querySelector('#app')
    const width = appContainer.clientWidth
    const height = appContainer.clientHeight
    
    this.app.renderer.resize(width, height)
    
    if (this.currentScene && this.currentScene.resize) {
      this.currentScene.resize(width, height)
    }
  }

  switchScene(sceneName) {
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
    this.app.stage.addChild(this.currentScene.container)
  }

  update(delta) {
    if (this.currentScene && this.currentScene.update) {
      this.currentScene.update(delta)
    }
  }

  destroy() {
    if (this.currentScene) {
      this.currentScene.destroy()
    }
    this.app.destroy(true)
  }
}