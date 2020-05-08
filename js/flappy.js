let walkSpeed = 0.04
let scoreDist = 52
let gapBetween = 30
const flexBoxes = document.querySelectorAll("[obstacle]")
let evaluteScore = function (right) {
    return right == scoreDist
}
if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    flexBoxes.forEach((flexbox, index, array) => {
        flexbox.style.right = `${-40 - (120 * index)}%`
    })
    walkSpeed = 0.095
    scoreDist = 48.35
    gapBetween = 120
    document.addEventListener("touchstart", e => {
        e.preventDefault()
        touchState = true
    })
    document.addEventListener("touchend", e => {
        e.preventDefault()
        touchState = false
    })


    evaluteScore = function (right) {
        return scoreDist - 0.1 < right && right < scoreDist
    }
}

let touchState = false
const keyState = {};
window.addEventListener('keydown', function (e) {
    keyState[e.keyCode || e.which] = true;
}, true);
window.addEventListener('keyup', function (e) {
    keyState[e.keyCode || e.which] = false;
}, true);

const resetPipe = function (flexbox, resetPos = true) {
    let percentage = (Math.random() * 69) + 1
    let reversedPercentage = 100 - percentage - 30
    let upperpipe = flexbox.childNodes[0]
    let lowerpipe = flexbox.childNodes[3]
    upperpipe.style.height = `${percentage}%`
    lowerpipe.style.height = `${reversedPercentage}%`
    if (resetPos) {
        let flexRights = []
        flexBoxes.forEach(item => flexRights.push(parseFloat(item.style.right.split("%")[0])))

        let right = flexRights.reduce((total, num) => num < total ? num : total, flexRights[0])
        flexbox.style.right = `${right - gapBetween}%`
    }

}


const walkPipe = function () {
    this.start = () => {
        this.intervalID = setInterval(() => {
            let flexBoxes = document.querySelectorAll("[obstacle]")
            flexBoxes.forEach(flexbox => {
                let right = parseFloat(flexbox.style.right.split("%")[0]) || 0
                if (right >= 100) {
                    resetPipe(flexbox)
                    right = flexbox.style.right
                }
                else if (evaluteScore(right)) {
                    document.querySelectorAll("audio")[0].play()
                    document.querySelector("h1").innerHTML = parseInt(document.querySelector("h1").innerHTML) + 1
                }
                flexbox.style.right = `${right + walkSpeed}%`
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
            window.ontouchend = null
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
    if (keyState['32'] || touchState) {
        gravity.stop()
        player.style.top = `${playerTop - 0.2}%`
        if (playerTop <= 0) {
            player.style.top = `0.1%`
        }
    }
}, 1)

gravity = new birdGravity
pipesMov = new walkPipe
gravity.start()
pipesMov.start()
document.querySelectorAll("[obstacle]").forEach(flexbox => { resetPipe(flexbox, false) })
window.onkeyup = e => {
    if (e.keyCode == 32) {
        gravity.start()
    }
}
window.ontouchend = () => {
    gravity.start()
}
