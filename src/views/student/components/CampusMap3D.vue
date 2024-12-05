<template>
  <div class="campus-map">
    <div id="map-container" ref="mapContainer"></div>
    <div class="unlock-control" v-if="isLocked">
      <el-button size="small" type="primary" @click="unlockView">
        <el-icon><Switch /></el-icon>
        自由视角
      </el-button>
    </div>
    <div class="map-controls">
      <el-button-group>
        <el-button size="small" @click="zoomIn">
          <el-icon><Plus /></el-icon>
        </el-button>
        <el-button size="small" @click="zoomOut">
          <el-icon><Minus /></el-icon>
        </el-button>
      </el-button-group>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import WebGL from 'three/examples/jsm/capabilities/WebGL.js'
import { Plus, Minus, Switch } from '@element-plus/icons-vue'
import { Raycaster } from 'three'

export default {
  name: 'CampusMap3D',
  components: {
    Plus,
    Minus,
    Switch
  },
  props: {
    canteens: {
      type: Array,
      required: true
    }
  },
  emits: ['select-canteen'],
  setup(props, { emit }) {
    const mapContainer = ref(null)
    let scene, camera, renderer, controls
    let canteenMarkers = []
    let targetPosition = new THREE.Vector3(0, 50, 50)

    // 添加触摸控制相关变量
    let touchStartX = 0
    let touchStartY = 0
    let isTouching = false

    // 添加射线检测器
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()
    
    const isLocked = ref(false)  // 添加锁定状态变量

    // 添加餐厅详细信息
    const canteenDetails = {
      '中央食堂': {
        floors: [
          {
            name: '一楼',
            sections: [
              { name: '左区', desc: '特色炒菜、面食、盖浇饭' },
              { name: '右区', desc: '自选菜品、米饭窗口' }
            ]
          },
          {
            name: '二楼',
            sections: [
              { name: '左区', desc: '特色小炒、面食' },
              { name: '右区', desc: '自选菜品' },
              { name: '教工食堂', desc: '教职工专用餐区' }
            ]
          }
        ]
      },
      '沁园餐厅': {
        floors: [
          {
            name: '一楼',
            desc: '学生餐厅，提供各类炒菜、面食'
          },
          {
            name: '二楼',
            desc: '教工食堂，环境优雅，菜品丰富'
          }
        ]
      },
      '馨园餐厅': {
        desc: '位于教学区，提供快餐、面食等，环境舒适'
      },
      'A区餐饮服务点': {
        desc: '便利的小型餐饮点，提供简餐、饮品和小吃'
      },
      '仲园餐厅': {
        floors: [
          {
            name: '一楼',
            desc: '提供各类炒菜、面食、特色小吃'
          },
          {
            name: '二楼',
            desc: '自助餐区，菜品种类丰富'
          }
        ]
      },
      'F区餐饮服务点': {
        desc: '便捷的餐饮服务点，提供快餐和饮品'
      },
      '雅园餐厅': {
        desc: '环境优美的餐厅，提供特色菜品和西式简餐'
      }
    }

    // 创建标注线和文字的函数
    const createInfoLabel = (position, info) => {
      // 修改折线位置和形状
      const points = []
      points.push(new THREE.Vector3(position.x, 2, position.z))      // 从柱子顶部开始
      points.push(new THREE.Vector3(position.x + 2, 4, position.z))  // 稍微向右上方延伸
      points.push(new THREE.Vector3(position.x + 5, 4, position.z))  // 短距离水平延伸

      const lineGeometry = new THREE.BufferGeometry().setFromPoints(points)
      const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff })
      const line = new THREE.Line(lineGeometry, lineMaterial)

      // 修改信息面板的创建函数
      const createInfoPanel = (text, yOffset = 0) => {
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        canvas.width = 512
        canvas.height = 256

        context.font = 'bold 28px Arial'  // 调整字体大小和加粗
        context.fillStyle = 'white'
        context.textAlign = 'left'
        context.textBaseline = 'middle'

        // 优化文字换行处理
        const wrapText = (context, text, x, y, maxWidth, lineHeight) => {
          const words = text.split('')  // 按字符分割，更适合中文
          let line = ''
          let posY = y

          for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n]
            const metrics = context.measureText(testLine)
            const testWidth = metrics.width

            if (testWidth > maxWidth && n > 0) {
              context.fillText(line, x, posY)
              line = words[n]
              posY += lineHeight
            } else {
              line = testLine
            }
          }
          context.fillText(line, x, posY)
          return posY
        }

        // 处理多行文本
        const lines = text.split('\n')
        let currentY = 25  // 调整起始高度
        const lineHeight = 35  // 增加行间距
        const maxWidth = canvas.width - 40  // 增加边距

        lines.forEach(line => {
          currentY = wrapText(context, line, 20, currentY, maxWidth, lineHeight) + lineHeight
        })

        const texture = new THREE.CanvasTexture(canvas)
        const material = new THREE.SpriteMaterial({ 
          map: texture,
          transparent: true
        })
        const sprite = new THREE.Sprite(material)
        
        // 调整信息面板的位置
        sprite.position.set(
          position.x + 8,            // 减小水平偏移
          4 - yOffset * 0.8,        // 降低整体高度，减小层间距
          position.z
        )
        sprite.scale.set(12, 6, 1)  // 调整面板大小

        return sprite
      }

      // 修改多层建筑的信息显示
      const infoSprites = []
      if (info.floors) {
        info.floors.forEach((floor, index) => {
          let text = `${floor.name}\n`
          if (floor.sections) {
            floor.sections.forEach(section => {
              text += `${section.name}：${section.desc}\n`  // 使用中文冒号
            })
          } else {
            text += floor.desc
          }
          infoSprites.push(createInfoPanel(text, index * 4))  // 减小层间距
        })
      } else {
        infoSprites.push(createInfoPanel(info.desc))
      }

      return { line, infoSprites }
    }

    // 添加解除锁定函数
    const unlockView = () => {
      isLocked.value = false
      
      // 重置控制器设置
      controls.enabled = true
      controls.enablePan = true         // 启用平移
      controls.enableZoom = true        // 启用缩放
      controls.enableRotate = true      // 启用旋转
      controls.minDistance = 10         // 重置最小距离
      controls.maxDistance = 150        // 重置最大距离
      controls.minPolarAngle = 0        // 重置最小仰角
      controls.maxPolarAngle = Math.PI * 0.85  // 重置大仰角
      
      // 显示所有餐厅
      toggleCanteensVisibility()
      
      // 修改这里：重置相机位置到更近的视角
      camera.position.set(0, 25, 35)    // 更近的视角
      controls.target.set(0, 0, 0)      
      
      // 强制更新控制器和相机
      camera.lookAt(0, 0, 0)
      controls.update()

      // 强制渲染一帧
      renderer.render(scene, camera)

      // 移除所有信息标注
      canteenMarkers.forEach(marker => {
        if (marker.data.infoObjects) {
          marker.data.infoObjects.forEach(obj => {
            scene.remove(obj)
          })
          delete marker.data.infoObjects
        }
      })
    }

    const initScene = () => {
      scene = new THREE.Scene()
      camera = new THREE.PerspectiveCamera(
        75,
        mapContainer.value.clientWidth / mapContainer.value.clientHeight,
        0.1,
        1000
      )

      renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        canvas: mapContainer.value.querySelector('canvas') || undefined
      })
      
      renderer.setPixelRatio(window.devicePixelRatio)
      renderer.setSize(mapContainer.value.clientWidth, mapContainer.value.clientHeight)
      
      renderer.shadowMap.enabled = true
      renderer.shadowMap.type = THREE.PCFSoftShadowMap
      
      if (!mapContainer.value.querySelector('canvas')) {
        mapContainer.value.appendChild(renderer.domElement)
      }

      // 添加环境光
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
      scene.add(ambientLight)

      // 添加平行光
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
      directionalLight.position.set(0, 10, 0)
      scene.add(directionalLight)

      // 添加天空盒
      const skyboxTexture = new THREE.CubeTextureLoader().load([
        '/assets/skybox/px.jpg', '/assets/skybox/nx.jpg', 
        '/assets/skybox/py.jpg', '/assets/skybox/ny.jpg', 
        '/assets/skybox/pz.jpg', '/assets/skybox/nz.jpg'
      ])
      scene.background = skyboxTexture

      // 初始化控制器
      controls = new OrbitControls(camera, renderer.domElement)
      controls.enableDamping = true
      controls.dampingFactor = 0.05
      controls.enableRotate = true      // 允许旋转
      controls.enablePan = true         // 允许平移
      controls.enableZoom = true        // 允许缩放
      controls.rotateSpeed = 0.5        // 调整旋转速度
      controls.panSpeed = 0.5           // 调整平移速度
      controls.zoomSpeed = 0.5          // 调整缩放速度

      // 设置一些合理的限制
      controls.minDistance = 10         // 最小缩放距离
      controls.maxDistance = 150        // 最大缩放距离
      controls.maxPolarAngle = Math.PI * 0.85  // 允许更大的俯仰角度
      
      // 调整相机初始位置
      camera.position.set(0, 25, 35)
      camera.lookAt(0, 0, 0)

      // 修改地面纹理部分
      const textureLoader = new THREE.TextureLoader()
      
      // 加载地面纹理
      const groundTexture = textureLoader.load('http://192.168.192.101:9000/canteen/3D%E5%B9%B3%E9%9D%A2%E5%9C%B0%E6%9D%BF.jpg')  // 替换为您的图片路径
      
      // 优化纹理设置
      groundTexture.wrapS = THREE.RepeatWrapping
      groundTexture.wrapT = THREE.RepeatWrapping
      groundTexture.repeat.set(1, 1)  // 调整重复次数
      
      // 改进纹理过滤
      groundTexture.magFilter = THREE.LinearFilter
      groundTexture.minFilter = THREE.LinearMipmapLinearFilter
      groundTexture.anisotropy = renderer.capabilities.getMaxAnisotropy() // 提高斜视角清晰度
      
      // 创建地面材质
      const groundMaterial = new THREE.MeshStandardMaterial({ 
        map: groundTexture,
        roughness: 0.7,    // 调整粗糙度
        metalness: 0.1,    // 降低金属感
        color: 0xcccccc    // 添加一个浅灰色基调
      })
      
      // 创建地面几何体
      const groundGeometry = new THREE.PlaneGeometry(100, 100)
      const ground = new THREE.Mesh(groundGeometry, groundMaterial)
      
      // 旋转和位置设置
      ground.rotation.x = -Math.PI / 2
      ground.position.y = 0
      
      // 添加阴影
      ground.receiveShadow = true
      
      scene.add(ground)

      // 添加食堂标记
      addCanteenMarkers()

      animate()
    }

    // 修改 createTextSprite 函数
    const createTextSprite = (text) => {
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      canvas.width = 256
      canvas.height = 128

      // 设置文字样式
      context.font = 'Bold 40px Arial'
      context.fillStyle = 'white'
      context.textAlign = 'center'
      context.textBaseline = 'middle'
      
      // 直接绘制文字
      context.fillStyle = 'white'
      context.fillText(text, canvas.width / 2, canvas.height / 2)

      // 创建纹理
      const texture = new THREE.CanvasTexture(canvas)
      const spriteMaterial = new THREE.SpriteMaterial({ 
        map: texture,
        transparent: true  // 确保透明度生效
      })
      const sprite = new THREE.Sprite(spriteMaterial)
      
      // 调整精灵大小
      sprite.scale.set(10, 5, 1)
      
      return sprite
    }

    // 修改创建标记和标签的函数
    const createMarkerWithLabel = (canteen) => {
      // 创建标记圆柱体
      const markerGeometry = new THREE.CylinderGeometry(0.7, 0.7, 4, 32)
      const markerMaterial = new THREE.MeshPhongMaterial({ 
        color: canteen.color,
        shininess: 100,
        emissive: canteen.color,
        emissiveIntensity: 0.2
      })
      const marker = new THREE.Mesh(markerGeometry, markerMaterial)
      
      // 添加光晕效果
      const glowGeometry = new THREE.SphereGeometry(1.2, 32, 32)
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: canteen.color,
        transparent: true,
        opacity: 0.3
      })
      const glow = new THREE.Mesh(glowGeometry, glowMaterial)
      marker.add(glow)

      // 设置标记位置
      marker.position.set(
        canteen.position.x,
        2,
        canteen.position.z
      )

      // 添加悬停动画
      marker.onBeforeRender = () => {
        glow.scale.setScalar(1 + Math.sin(Date.now() * 0.003) * 0.1)
      }

      // 创建并设置文字精灵
      const textSprite = createTextSprite(canteen.name)
      textSprite.position.set(
        canteen.position.x,
        6,  // 降低文字高度，从8改为6
        canteen.position.z + 2  // 向前偏移，使文字更容易看到
      )
      
      // 为标记和文字都添加用户数据
      marker.userData = canteen
      textSprite.userData = canteen

      return { marker, textMesh: textSprite }
    }

    const addCanteenMarkers = () => {
      // 定义餐厅位置和信息
      const canteenPositions = [
        { 
          id: 1,
          name: '中央食堂',
          position: { x: -5, z: -20 },  // 中心位置
          color: 0xff0000  // 红色
        },
        {
          id: 2,
          name: '沁园餐厅',
          position: { x: 2, z: -20 },  // 右上方
          color: 0x00ff00  // 绿色
        },
        {
          id: 3,
          name: '馨园餐厅',
          position: { x: -7, z: -22 },  // 左上方
          color: 0x0000ff  // 蓝色
        },
        {
          id: 4,
          name: 'A区餐饮服务点',
          position: { x: -10, z: -30 },  // 右下方
          color: 0xffff00  // 黄色
        },
        {
          id: 5,
          name: '仲园餐厅',
          position: { x: -32, z: -3 },  // 左下方
          color: 0xff00ff  // 紫色
        },
        {
          id: 6,
          name: 'F区餐饮服务点',
          position: { x: -28, z: 8 },  // 右下角
          color: 0x00ffff  // 青色
        },
        {
          id: 7,
          name: '雅园餐厅',
          position: { x: -14, z: 12 },  // 左下角
          color: 0xffa500  // 橙色
        }
      ]

      canteenPositions.forEach(canteen => {
        const { marker, textMesh } = createMarkerWithLabel(canteen)
        
        scene.add(marker)
        scene.add(textMesh)
        
        // 存储标记信息
        canteenMarkers.push({
          mesh: marker,
          data: canteen
        })

        // 添加点击事件
        marker.userData = canteen
        marker.callback = focusOnCanteen
        marker.callbackTarget = marker
      })
    }

    const focusOnCanteen = (canteen) => {
      // 只触发选择事件
      emit('select-canteen', canteen)
    }

    const smoothCameraMove = (targetPos, lookAtPos = null) => {
      const speed = 0.08 // 增加移动速度
      const offset = new THREE.Vector3().subVectors(targetPos, camera.position).multiplyScalar(speed)
      
      camera.position.add(offset)
      
      if (lookAtPos) {
        // 平滑过渡相机朝向
        const currentLookAt = controls.target
        const newLookAt = new THREE.Vector3(lookAtPos.x, 0, lookAtPos.z)
        currentLookAt.lerp(newLookAt, speed)
        controls.target.copy(currentLookAt)
      }
      
      controls.update()

      if (camera.position.distanceTo(targetPos) > 0.1) {
        requestAnimationFrame(() => smoothCameraMove(targetPos, lookAtPos))
      }
    }

    const animate = () => {
      if (!renderer || !scene || !camera) return
      
      requestAnimationFrame(animate)
      if (controls) controls.update()
      renderer.render(scene, camera)
    }

    const handleResize = () => {
      if (camera && renderer && mapContainer.value) {
        camera.aspect = mapContainer.value.clientWidth / mapContainer.value.clientHeight
        camera.updateProjectionMatrix()
        renderer.setSize(mapContainer.value.clientWidth, mapContainer.value.clientHeight)
      }
    }

    const zoomIn = () => {
      camera.position.y *= 0.8
      camera.position.z *= 0.8
    }

    const zoomOut = () => {
      camera.position.y *= 1.2
      camera.position.z *= 1.2
    }

    // 添加相机移动函数
    const moveCamera = (direction) => {
      const moveStep = 10 // 移动步长
      const currentPos = camera.position.clone()
      
      switch (direction) {
        case 'up':
          camera.position.z -= moveStep
          break
        case 'down':
          camera.position.z += moveStep
          break
        case 'left':
          camera.position.x -= moveStep
          break
        case 'right':
          camera.position.x += moveStep
          break
      }
      
      // 保持相机朝向中心
      camera.lookAt(0, 0, 0)
      controls.update()
    }

    // 修改触摸控制相关函数
    const handleTouchMove = (event) => {
      if (!isTouching || event.touches.length !== 1) return

      const moveStep = 0.3 // 降低灵敏度
      const currentX = event.touches[0].clientX
      const currentY = event.touches[0].clientY
      
      const deltaX = (currentX - touchStartX) * moveStep
      const deltaZ = (currentY - touchStartY) * moveStep

      // 添加惯性
      const momentum = 0.95
      camera.position.x -= deltaX * momentum
      camera.position.z += deltaZ * momentum

      touchStartX = currentX
      touchStartY = currentY

      controls.update()
    }

    // 添加双指缩放支持
    let initialPinchDistance = 0

    const handleTouchStart = (event) => {
      if (event.touches.length === 2) {
        initialPinchDistance = Math.hypot(
          event.touches[0].clientX - event.touches[1].clientX,
          event.touches[0].clientY - event.touches[1].clientY
        )
      } else {
        isTouching = true
        touchStartX = event.touches[0].clientX
        touchStartY = event.touches[0].clientY
      }
    }

    const handleTouchEnd = () => {
      isTouching = false
    }

    // 添加一个函数来控制餐厅的可见性
    const toggleCanteensVisibility = (selectedCanteen = null) => {
      canteenMarkers.forEach(marker => {
        // 获取柱子和文字
        const cylinder = marker.mesh
        const text = scene.children.find(
          child => child instanceof THREE.Sprite && 
          child.userData.id === marker.data.id
        )

        if (selectedCanteen) {
          // 如果是锁定状态，只显示选中的餐厅
          const isSelected = marker.data.id === selectedCanteen.id
          cylinder.visible = isSelected
          if (text) text.visible = isSelected
        } else {
          // 如果是解除锁定状态，显示所有餐厅
          cylinder.visible = true
          if (text) text.visible = true
        }
      })
    }

    // 修改点击事件处理函数
    const handleClick = (event) => {
      // 计算鼠标在画布中的归一化坐标
      const rect = renderer.domElement.getBoundingClientRect()
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

      // 更新射线
      raycaster.setFromCamera(mouse, camera)

      // 获取所有可点击的对象（柱子和文字）
      const objects = []
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Sprite) {
          objects.push(object)
        }
      })

      // 检测射线相交的对象
      const intersects = raycaster.intersectObjects(objects)
      
      if (intersects.length > 0) {
        const clickedObject = intersects[0].object
        const canteenData = clickedObject.userData

        if (canteenData && canteenData.position) {
          isLocked.value = true
          controls.enabled = true

          // 设置控制器目标点为餐厅位置
          controls.target.set(canteenData.position.x, 0, canteenData.position.z)
          
          // 修改控制器限制，允许更自由的视角
          controls.enablePan = true        // 允许平移
          controls.enableZoom = true       // 允许缩放
          controls.enableRotate = true     // 允许旋转
          controls.minDistance = 5         // 最小距离
          controls.maxDistance = 50        // 最大距离
          controls.minPolarAngle = 0       // 允许从正上方观看
          controls.maxPolarAngle = Math.PI // 允许从任何角度观看
          
          // 隐藏其他餐厅
          toggleCanteensVisibility(canteenData)
          
          // 不强制移动相机，让用户自由控制视角
          emit('select-canteen', canteenData)

          // 创建信息标注
          const info = canteenDetails[canteenData.name]
          if (info) {
            const { line, infoSprites } = createInfoLabel(canteenData.position, info)
            scene.add(line)
            infoSprites.forEach(sprite => scene.add(sprite))
            
            // 存储标注对象以便后续移除
            canteenData.infoObjects = [line, ...infoSprites]
          }
        }
      }
    }

    onMounted(() => {
      console.log('CampusMap3D mounted')
      console.log('Container:', mapContainer.value)
      console.log('Canteens:', props.canteens)

      // 更新为新的 WebGL2 检测方法
      if (!WebGL.isWebGL2Available()) {
        console.error('WebGL 2 is not available')
        const warning = WebGL.getWebGL2ErrorMessage()
        mapContainer.value.appendChild(warning)
        return
      }

      if (!mapContainer.value) return

      initScene()

      window.addEventListener('resize', handleResize)

      // 添加触摸事件监听
      if (mapContainer.value) {
        mapContainer.value.addEventListener('touchstart', handleTouchStart, { passive: true })
        mapContainer.value.addEventListener('touchmove', handleTouchMove, { passive: true })
        mapContainer.value.addEventListener('touchend', handleTouchEnd, { passive: true })
        mapContainer.value.addEventListener('click', handleClick)
      }
    })

    onBeforeUnmount(() => {
      window.removeEventListener('resize', handleResize)
      if (renderer) {
        renderer.dispose()
        renderer.forceContextLoss()
        renderer = null
      }
      if (scene) {
        scene.clear()
        scene = null
      }
      if (controls) {
        controls.dispose()
        controls = null
      }
      camera = null

      // 移除触摸事件监听
      if (mapContainer.value) {
        mapContainer.value.removeEventListener('touchstart', handleTouchStart)
        mapContainer.value.removeEventListener('touchmove', handleTouchMove)
        mapContainer.value.removeEventListener('touchend', handleTouchEnd)
        mapContainer.value.removeEventListener('click', handleClick)
      }
    })

    return {
      mapContainer,
      zoomIn,
      zoomOut,
      moveCamera,
      isLocked,    // 导出锁定状态
      unlockView   // 导出解除锁定函数
    }
  }
}
</script>

<style scoped>
.campus-map {
  position: relative;
  width: 100%;
  height: 300px;
  background: #f0f2f5;
  border-radius: 8px;
  overflow: hidden;
  touch-action: none; /* 防止浏览器默认触摸行为 */
}

#map-container {
  width: 100%;
  height: 100%;
}

.map-controls {
  position: absolute;
  bottom: 16px;
  right: 16px;
  z-index: 1;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .direction-controls {
    bottom: 16px;
    left: 50%;
    transform: translateX(-50%);
  }
}

/* 添加解除锁定按钮样式 */
.unlock-control {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 1;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .unlock-control {
    top: auto;
    bottom: 16px;
    right: 80px;  /* 避免与缩放按钮重叠 */
  }
}
</style>
