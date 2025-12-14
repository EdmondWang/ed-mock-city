import * as PIXI from 'pixi.js'

export class Player {
  public sprite: PIXI.Graphics
  private speed: number = 5
  private velocity: { x: number; y: number } = { x: 0, y: 0 }
  private keys: Record<string, boolean> = {}
  private width: number = 50
  private height: number = 50

  constructor() {
    this.sprite = new PIXI.Graphics()
    this.init()
  }

  private init(): void {
    // 创建玩家精灵
    this.sprite.beginFill(0xff0000)
    this.sprite.drawRect(-this.width / 2, -this.height / 2, this.width, this.height)
    this.sprite.endFill()
    
    // 设置锚点到中心
    this.sprite.anchor.set(0.5)
  }

  handleKeyDown(e: KeyboardEvent): void {
    this.keys[e.key] = true
  }

  handleKeyUp(e: KeyboardEvent): void {
    this.keys[e.key] = false
  }

  update(delta: number): void {
    // 更新速度
    this.updateVelocity()
    
    // 应用速度到位置
    this.sprite.position.x += this.velocity.x * delta
    this.sprite.position.y += this.velocity.y * delta
    
    // 更新旋转
    this.updateRotation()
  }

  private updateVelocity(): void {
    // 重置速度
    this.velocity.x = 0
    this.velocity.y = 0
    
    // 处理键盘输入
    if (this.keys['ArrowUp'] || this.keys['w'] || this.keys['W']) {
      this.velocity.y = -this.speed
    }
    if (this.keys['ArrowDown'] || this.keys['s'] || this.keys['S']) {
      this.velocity.y = this.speed
    }
    if (this.keys['ArrowLeft'] || this.keys['a'] || this.keys['A']) {
      this.velocity.x = -this.speed
    }
    if (this.keys['ArrowRight'] || this.keys['d'] || this.keys['D']) {
      this.velocity.x = this.speed
    }
    
    // 归一化对角线移动速度
    const magnitude = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y)
    if (magnitude > this.speed) {
      this.velocity.x = (this.velocity.x / magnitude) * this.speed
      this.velocity.y = (this.velocity.y / magnitude) * this.speed
    }
  }

  private updateRotation(): void {
    // 根据速度方向旋转玩家
    if (this.velocity.x !== 0 || this.velocity.y !== 0) {
      this.sprite.rotation = Math.atan2(this.velocity.y, this.velocity.x)
    }
  }

  destroy(): void {
    // 清理资源
    this.sprite.destroy()
  }
}