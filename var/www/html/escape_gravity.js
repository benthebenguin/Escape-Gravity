var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

//initialize all variables
var current_level = 1;
var level_progress = 0;
var starting_lives = 3;
var current_lives = starting_lives;
var start = true;
var dead = true;
var exploding = false;
var explosion = {
        radius: 1,
        x: 0,
        y: 0,
};

var ship = {
        hitbox: 4,
        x: (canvas.width / 2),
        y: (canvas.height - 30),
        speed: 3,
};

var starting_speed = 2;
var max_meteors = 10;
var meteor = {
        x:[],
        y:[],
        speed: starting_speed,
};
var meteor_num = 0;
var meteor_radius = 80;
var meteor_countdown = 50;

var rightPressed = false;
var leftPressed = false;
var upPressed = false;
var downPressed = false;


//initializes the game loop
function play() {
    //if ship crashes plays the explosion animation
    if(exploding)
    {

        drawExplosion();
        if(explosion.radius > meteor_radius)
        {
            exploding = false;

            ship.y = canvas.height - 30;

            for(var i = 0; i < meteor_num; i++)
            {
                meteor.x.shift();
                meteor.y.shift();
                meteor_num--;
            }
        }

        explosion.radius++;

    //displays game over screen, allows player to input a movement to restart
    }
    else if(dead)
    {
        //start screen displays instead if first time opening the game
        if(start)
        {
            ctx.fillStyle = "#FFFF00";
            ctx.font = "25px Helvetica";
            ctx.textAlign = "center";
            ctx.fillText("ESCAPING GRAVITY", canvas.width/2, 175);

            ctx.font = "20px Helvetica";
            ctx.fillText("Press an arrow key to play", canvas.width/2, 475);

            if(rightPressed || leftPressed || upPressed || downPressed)
            {
                dead = false;
                start = false;
            }
        }
        else {

            ctx.fillStyle = "#ad1113";
            ctx.font = "25px Helvetica";
            ctx.textAlign = "center";
            ctx.fillText("GAME OVER!", canvas.width/2, 175);

            ctx.font = "20px Helvetica";
            ctx.fillStyle = "white";
            ctx.fillText("Press an arrow key to play", canvas.width/2, 475);

            ctx.fillText("Level Reached: " + current_level, canvas.width/2, 230);

            if(rightPressed || leftPressed || upPressed || downPressed)
            {
                //reset stats to starting values
                dead = false;
                meteors = 0;
                meteor_countdown = 10;

                current_level = 1;
                current_lives = starting_lives;
            }
        }
    }
    //main game loop
    else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawShip();
        drawMeteors();
        meteorCheck();
        update();

        //displays for level and lives
        ctx.fillStyle = "#FFFF00";
        ctx.font = "30px Courier";
        ctx.textAlign = "left";
        ctx.fillText(level_progress + "%", 10, 50);

        ctx.fillStyle = "#FFFF00";
        ctx.font = "30px Courier";
        ctx.textAlign = "left";
        ctx.fillText("Level: " + current_level, 10, 25);

        ctx.textAlign = "right";
        ctx.fillText("Lives: " + current_lives, canvas.width - 20, 25);
    }

}


//changes the ship's lean based on keypress
function drawShip() {
    if(rightPressed) {
        ctx.beginPath();
        ctx.moveTo(ship.x, ship.y - 10);
        ctx.lineTo(ship.x + 7, ship.y + 12);
        ctx.lineTo(ship.x, ship.y + 8);
        ctx.lineTo(ship.x - 13, ship.y + 8);
        ctx.fillStyle = "#CCCCCC";
        ctx.fill();
        ctx.closePath();
    }
    else if(leftPressed) {
        ctx.beginPath();
        ctx.moveTo(ship.x, ship.y - 10);
        ctx.lineTo(ship.x + 13, ship.y + 8);
        ctx.lineTo(ship.x, ship.y + 8);
        ctx.lineTo(ship.x - 7, ship.y + 12);
        ctx.fillStyle = "#CCCCCC";
        ctx.fill();
        ctx.closePath();
    }
    else
    {
        ctx.beginPath();
        ctx.moveTo(ship.x, ship.y - 10);
        ctx.lineTo(ship.x + 10, ship.y + 10);
        ctx.lineTo(ship.x, ship.y + 8);
        ctx.lineTo(ship.x - 10, ship.y + 10);
        ctx.fillStyle = "#CCCCCC";
        ctx.fill();
        ctx.closePath();
    }
}

//iterates through the array of active meteors and displays them
function drawMeteors() {
    for(var i = 0; i < meteor_num; i++)
    {
        ctx.beginPath();
        ctx.arc(meteor.x[i], meteor.y[i], meteor_radius, 0, Math.PI * 2);
        ctx.fillStyle = "#CCCCCC";
        ctx.fill();
        ctx.closePath();
    }

}

//creates an explosion that ripples outwards
function drawExplosion()
{
    ctx.beginPath();
    ctx.arc(explosion.x, explosion.y, explosion.radius + 40, 0, Math.PI * 2);
    ctx.fillStyle = "#7C0A02";
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.arc(explosion.x, explosion.y, explosion.radius + 30, 0, Math.PI * 2);
    ctx.fillStyle = "#B22222";
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.arc(explosion.x, explosion.y, explosion.radius + 20, 0, Math.PI * 2);
    ctx.fillStyle = "#E25822";
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.arc(explosion.x, explosion.y, explosion.radius + 10, 0, Math.PI * 2);
    ctx.fillStyle = "#F1BC31";
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.arc(explosion.x, explosion.y, explosion.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#F6F052";
    ctx.fill();
    ctx.closePath();
}

//checks to spawn meteors as well as increase the level progress
function meteorCheck() {

    if(meteor_countdown <= 0 )
    {
        addMeteor();
        //spawns additional meteor after level 1
        if(current_level > 2)
        {
            addMeteor();
        }

        meteor_countdown = 100;
        level_progress += 10;

    }
    else {
        meteor_countdown--;
    }

}

//spawns an additional meteor with random x value and pushes it to the meteor array
function addMeteor() {
    meteor.x.push(meteor_radius + (Math.random() * (canvas.width - meteor_radius)));
    meteor.y.push(0 - canvas.height);

    meteor_num = meteor.x.length;
}

//checks all values that are updated through each iteration
function update() {

    //updates ship position based on user input
    if (rightPressed && ship.x < canvas.width - ship.hitbox/2) {
        ship.x += ship.speed;
    }
    else if (leftPressed && ship.x > 0 + ship.hitbox/2) {
        ship.x -= ship.speed;
    }
    if (downPressed && ship.y < canvas.height - ship.hitbox) {
        ship.y += ship.speed;
    }
    else if (upPressed && ship.y > 0 + ship.hitbox/2) {
        ship.y -= ship.speed;
    }

    //updates meteor position according to fall speed
    for(var i = 0; i < meteor_num; i++)
    {
        meteor.y[i] += meteor.speed;
    }

    //leveling up increases meteor speed
    if(level_progress >= 100)
    {
        current_level++;
        meteor.speed++;
        level_progress = 0;

    }


    //collision check
    for(var i = 0; i < meteor_num; i++)
    {
        if( (ship.x + ship.hitbox/2) > (meteor.x[i] - meteor_radius) &&
        (ship.x - ship.hitbox/2) < (meteor.x[i] + meteor_radius) &&
        (ship.y + ship.hitbox/2) > (meteor.y[i] - meteor_radius) &&
        (ship.y - ship.hitbox/2) < (meteor.y[i] +meteor_radius))
         {
            shipHit();
            current_lives--;
            if(current_lives <= 0)
            {
                gameOver();
            }
         }

    //removes meteors that reach the bottom of the screen
        if((meteor.y[i] - meteor_radius) > canvas.height)
        {
            meteor.x.shift();
            meteor.y.shift();
            meteor_num--;
        }
    }
}

//ship has crashed into a meteor and will explode
function shipHit() {
    exploding = true;
    explosion.radius = 1;
    explosion.x = ship.x;
    explosion.y = ship.y;

    //ship is moved off screen to avoid additional collisions
    ship.x = (canvas.width / 2);
    ship.y = (canvas.height + 100);
}

// player is out of lives, resetting the game
function gameOver(){
	meteor.x = [];
	meteor.y = [];
	meteor.speed = starting_speed;
	dead = true;
}

//keylisteners for user input
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
    else if(e.key == "Up" || e.key == "ArrowUp") {
        upPressed = true;
    }
    else if(e.key == "Down" || e.key == "ArrowDown") {
        downPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
    else if(e.key == "Up" || e.key == "ArrowUp") {
        upPressed = false;
    }
    else if(e.key == "Down" || e.key == "ArrowDown") {
        downPressed = false;
    }
}

//initializes game sequence
setInterval(play, 15);