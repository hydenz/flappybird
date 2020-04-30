var keyState = {};    
window.addEventListener('keydown',function(e){
    keyState[e.keyCode || e.which] = true;
},true);    
window.addEventListener('keyup',function(e){
    keyState[e.keyCode || e.which] = false;
},true);

const resetPipe = function (flexbox, move = true) {
    let percentage = (Math.random() * 69) + 1
    let reversedPercentage = 100 - percentage - 30
    let upperpipe = flexbox.childNodes[0]
    let lowerpipe = flexbox.childNodes[3]
    upperpipe.style.height = `${percentage}%`
    lowerpipe.style.height = `${reversedPercentage}%`
    if (move)
        flexbox.style.right = "0%"
}


const walkPipe = function () {
    this.start = () => {
        this.intervalID = setInterval(() => {
            let flexBoxes = document.querySelectorAll("[obstacle]")
            flexBoxes.forEach(flexbox => {
                let right = parseFloat(flexbox.style.right.split("%")[0]) || 0
                if (right >= 100) {
                    flexbox.style.right = "0%"
                    right = "0%"
                    resetPipe(flexbox)
                }
                else if (right==52) {
                    document.querySelectorAll("audio")[0].play()
                    document.querySelector("h1").innerHTML = parseInt(document.querySelector("h1").innerHTML) + 1
                }
                flexbox.style.right = `${right + 0.04}%`
            })
        }, 1)
    }
    this.stop = () => { clearInterval(this.intervalID) }
}

const isCollide = setInterval(() => {
    let birdRect = document.querySelector("[wm-bird]").getBoundingClientRect()
    let obstacles = document.querySelectorAll("[obstacle] > div")
    obstacles.forEach(obstacle => {
        let obsRect = obstacle.getBoundingClientRect()
        if (!(
            ((birdRect.top + birdRect.height) < (obsRect.top)) ||
            (birdRect.top > (obsRect.top + obsRect.height)) ||
            ((birdRect.left + birdRect.width) < obsRect.left) ||
            (birdRect.left > (obsRect.left + obsRect.width))
        )) {
            document.querySelectorAll("audio")[1].play()
            pipesMov.stop()
            gravity.stop()
            clearInterval(birdJump)
            window.onkeyup = null
            setTimeout(() => {location.reload()}, 3500)
            clearInterval(isCollide)
        }
    })
}, 1)

const birdGravity = function () {
    this.start = () => {
        let gspeed = 0.05
        this.intervalID = setInterval(() => {
            let player = document.querySelector("[wm-bird]")
            let playerTop = parseFloat(player.style.top.split("%")[0]) || 50
            if (playerTop <= 94.8) {
                player.style.top = `${playerTop + gspeed}%`
                gspeed += 0.0005
            }
        }, 1)
    }
    this.stop = () => { clearInterval(this.intervalID) }
}

const birdJump = setInterval(() => {
    let player = document.querySelector("[wm-bird]")
    let playerTop = parseFloat(player.style.top.split("%")[0])
    if (keyState['32']) {
        gravity.stop()
        player.style.top = `${playerTop - 0.2}%`
    }
},1)

gravity = new birdGravity
pipesMov = new walkPipe
gravity.start()
pipesMov.start()
document.querySelectorAll("[obstacle]").forEach(flexbox => { resetPipe(flexbox, false) })
window.onkeyup = gravity.start