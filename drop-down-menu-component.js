const w = window.innerWidth,h = window.innerHeight
const dropDownColor = '#9E9E9E'
class DropDownComponent extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({mode:'open'})
        this.btn = document.createElement('img')
        this.dropDownImg = document.createElement('img')
        const children = this.children
        this.childObjs = []
        for(var i=0;i<children.length;i++) {
            const child = children[i]
            this.childObjs.push({text:child.innerHTML,href:child.getAttribute('href')})
        }
        shadow.appendChild(this.btn)
        shadow.appendChild(this.dropDownImg)
        this.dir = 0
    }
    update() {

    }
    startUpdate(dir) {
        this.dir = dir
    }
    stopped() {
        return dir == 0
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = w/15
        canvas.height = w/15
        const context = canvas.getContext('2d')
        const dropDownCanvas = document.createElement('canvas')
        dropDownCanvas.width = w/3
        dropDownCanvas.height = (2*this.children.length+1) * (h/12) + w/15
        const dropDownContext = dropDownCanvas.getContext('2d')
        this.btn.src = canvas.toDataURL()
        this.dropDownImg.src = dropDownCanvas.toDataURL()
    }
    connectedCallback() {
        this.render()
    }
}
class DropDownBtn {
    constructor() {
        this.rot = 0
    }
    draw(context,size) {
        context.save()
        context.translate(size/2,size/2)
        context.rotate(this.rot*Math.PI/180)
        context.fillStyle = dropDownColor
        context.beginPath()
        context.moveTo(0,size)
        context.lineTo(size,size)
        context.lineTo(size/2,0)
        context.fill()
        context.restore()
    }
    update(dir) {
        this.rot += 18*dir
        if(this.rot > 90) {
            this.rot = 90
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
        context.font = context.font.replace(/\d{2}/,h/16)
        context.save()
        context.rect(0,0,wSize,hSize*this.scale)
        context.clip()
        context.fillRect(0,0,wSize,hSize)
        context.beginPath()
        context.moveTo(w/6,0)
        context.lineTo(w/6-w/30,w/15)
        context.lineTo(w/6+w/30,w/15)
        context.fill()
        context.fillStyle = 'black'
        const y = h/15+h/12
        children.forEach((child)=>{
            const text = child.text
            const tw = context.measureText(text).width
            context.fillText(child.text,w/6-tw/2,y)
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
