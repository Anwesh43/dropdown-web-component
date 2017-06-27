const w = window.innerWidth,h = window.innerHeight
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
        dropDownCanvas.height = (2*this.children.length+1) * (h/12) + h/15
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
        context.fillStyle = '#9E9E9E'
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
