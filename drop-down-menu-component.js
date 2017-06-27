const w = window.innerWidth,h = window.innerHeight
const dropDownColor = '#9E9E9E'
class DropDownComponent extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({mode:'open'})
        this.btn = document.createElement('img')
        this.btn.style.position = 'absolute'
        this.btn.style.top = this.getAttribute('x') || 0
        this.btn.style.left = (this.getAttribute('y') || 0) + w/6-w/80
        this.dropDownImg = document.createElement('img')
        this.dropDownImg.style.position = 'absolute'
        this.dropDownImg.style.left = this.getAttribute('x') || 0
        this.dropDownImg.style.top = (this.getAttribute('y') || 0)+w/40
        const children = this.children
        this.childObjs = []
        for(var i=0;i<children.length;i++) {
            const child = children[i]
            this.childObjs.push({text:child.innerHTML,href:child.getAttribute('href')})
        }
        shadow.appendChild(this.btn)
        shadow.appendChild(this.dropDownImg)
        this.state = {dir:0}
        this.dropDownBtn = new DropDownBtn()
        this.dropDownMenu = new DropDownMenu()
        this.animationHandler = new AnimationHandler(this)
    }
    update() {
        this.dropDownBtn.update(this.state.dir)
        this.dropDownMenu.update(this.state.dir)
    }
    startUpdate(dir) {
        this.state.dir = dir
        console.log(this.state.dir)
    }
    stopped() {
        return this.state.dir == 0
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = w/40
        canvas.height = w/40
        const context = canvas.getContext('2d')
        const dropDownCanvas = document.createElement('canvas')
        dropDownCanvas.width = w/3
        dropDownCanvas.height = (2*this.children.length+1) * (h/12) + h/15
        const dropDownContext = dropDownCanvas.getContext('2d')
        this.dropDownBtn.draw(context,canvas.width)
        this.dropDownMenu.draw(dropDownContext,this.childObjs,dropDownCanvas.width,dropDownCanvas.height)
        this.btn.src = canvas.toDataURL()
        this.dropDownImg.src = dropDownCanvas.toDataURL()
    }
    connectedCallback() {
        this.render()
        console.log(this.childObjs)
        this.btn.onmousedown = (event) => {
            this.animationHandler.startAnimation()
        }
        this.dropDownImg.onmousedown = (event) => {
            const y = event.offsetY
            this.childObjs.forEach((child)=>{
                if(y > child.y-h/24 && y < child.y+h/24) {
                    window.location = child.href
                }
            })
        }
    }
}
class DropDownBtn {
    constructor() {
        this.rot = 0
    }
    draw(context,size) {
        const newSize = size*0.9
        context.save()
        context.translate(size/2,size/2)
        context.rotate(this.rot*Math.PI/180)
        context.fillStyle = dropDownColor
        context.beginPath()
        context.moveTo(-newSize/2,newSize/2)
        context.lineTo(newSize/2,newSize/2)
        context.lineTo(0,-newSize/2)
        context.fill()
        context.restore()
    }
    update(dir) {
        console.log(this.rot)
        this.rot += 36*dir
        if(this.rot > 180) {
            this.rot = 180
        }
        if(this.rot < 0){
            this.rot = 0
        }
    }
}
class DropDownMenu {
    constructor() {
        this.scale = 0
    }
    draw(context,children,wSize,hSize) {
        context.fillStyle = dropDownColor
        context.font = context.font.replace(/\d{2}/,h/12)
        context.save()
        context.rect(0,0,wSize,hSize*this.scale)
        context.clip()
        context.beginPath()
        context.moveTo(w/6,0)
        context.lineTo(w/6-w/30,h/15)
        context.lineTo(w/6+w/30,h/15)
        context.fill()
        context.fillRect(0,h/15,wSize,hSize-h/15)
        context.fillStyle = 'black'
        var y = h/15+h/12
        children.forEach((child)=>{
            if(!child.y) {
                child.y = y
            }
            const text = child.text
            const tw = context.measureText(text).width
            context.fillText(child.text,wSize/2-tw/2,y)
            y += h/6
        })
        context.restore()

    }
    update(dir) {
        this.scale += 0.2 * dir
        if(this.scale > 1) {
            this.scale = 1
        }
        if(this.scale < 0) {
            this.scale = 0
        }
    }
}
class AnimationHandler {
    constructor(component) {
        this.component = component
        this.animated = false
        this.prevDir = -1
    }
    startAnimation() {
        if(this.animated != true) {
            this.animated = true
            var i = 0
            this.component.startUpdate(this.prevDir*-1)
            const interval = setInterval(()=>{
                    this.component.render()
                    this.component.update()
                    if(i == 5) {
                        this.component.render()
                        this.animated = false
                        this.prevDir *= -1
                        console.log(i)
                        clearInterval(interval)
                    }
                    i++
            },50)
        }
    }
}
customElements.define('drop-down-menu',DropDownComponent)
