<template>
  <div id="app" class="bg-gray-900 min-h-screen text-gray-300">
    <p
      class="text-purple-900 opacity-70 fixed w-full h-full top-0 bottom-0 right-0 left-0 text-center"
      style="font-size: 48rem; pointer-events: none"
    >
      Spark
    </p>
    <img
      class="fixed w-full h-full top-0 bottom-0 right-0 left-0 bg-cover opacity-10"
      style="pointer-events: none"
      :src="bgimage"
      alt="why not?"
    />
    <canvas
      id="canvas"
      class="fixed w-full h-full top-0 bottom-0 right-0 left-0 bg-transparent"
    ></canvas>
    <router-view />
    <!-- notifications start -->
    <div class="fixed bottom-0 right-0 p-4">
      <transition-group name="notification" tag="div" class="space-y-2">
        <div
          v-for="notification of $store.state.notifications"
          :key="notification.id"
          class="notification-item flex justify-end"
        >
          <div
            class="px-4 py-2 border-b-2 border-green-600 text-green-500"
            @click="$store.commit('REMOVE_NOTIFICATION', notification.id)"
          >
            {{ notification.text }}
          </div>
        </div>
      </transition-group>
    </div>
    <!-- notifications end -->
  </div>
</template>

<script>
import bg from "/src/assets/bg01.png";
const bgimage = bg;
export default {
  data() {
    return {
      bgimage,
    };
  },
  mounted() {
    const canvas = document.getElementById("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const c = canvas.getContext("2d");

    // const mouse = {
    //   x: null,
    //   y: null,
    // };

    // window.addEventListener("mousemove", (e) => {
    //   mouse.x = e.x;
    //   mouse.y = e.y;
    // });

    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    });

    function getDistance(x1, y1, x2, y2) {
      let xDist = x2 - x1;
      let yDist = y2 - y1;

      return Math.sqrt(xDist ** 2 + yDist ** 2);
    }

    function init() {
      circleArray = [];
      for (let i = 0; i < (innerWidth * innerHeight) / (200 * 200); i++) {
        const modifier = Math.random() + 0.5; //** 2;
        const radius = 30 * modifier;
        let x = Math.random() * (innerWidth - 2 * radius) + radius;
        let y = Math.random() * (innerHeight - 2 * radius) + radius;
        if (i != 0) {
          for (let j = 0; j < circleArray.length; j++) {
            if (
              getDistance(x, y, circleArray[j].x, circleArray[j].y) <=
              radius + circleArray[j].radius
            ) {
              x = Math.random() * (innerWidth - 2 * radius) + radius;
              y = Math.random() * (innerHeight - 2 * radius) + radius;

              j = -1;
            }
          }
        }
        circleArray.push(new Circle(x, y, radius));
      }
    }

    let circleArray = [];

    function rotate(velocity, angle) {
      const rotatedVelocities = {
        x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
        y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle),
      };

      return rotatedVelocities;
    }

    function resolveCollision(particle, otherParticle) {
      const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
      const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;

      const xDist = otherParticle.x - particle.x;
      const yDist = otherParticle.y - particle.y;

      // Prevent accidental overlap of particles
      if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {
        // Grab angle between the two colliding particles
        const angle = -Math.atan2(
          otherParticle.y - particle.y,
          otherParticle.x - particle.x
        );

        // Store mass in var for better readability in collision equation
        const m1 = particle.mass;
        const m2 = otherParticle.mass;

        // Velocity before equation
        const u1 = rotate(particle.velocity, angle);
        const u2 = rotate(otherParticle.velocity, angle);

        // Velocity after 1d collision equation
        const v1 = {
          x: (u1.x * (m1 - m2)) / (m1 + m2) + (u2.x * 2 * m2) / (m1 + m2),
          y: u1.y,
        };
        const v2 = {
          x: (u2.x * (m1 - m2)) / (m1 + m2) + (u1.x * 2 * m2) / (m1 + m2),
          y: u2.y,
        };

        // Final velocity after rotating axis back to original location
        const vFinal1 = rotate(v1, -angle);
        const vFinal2 = rotate(v2, -angle);

        // Swap particle velocities for realistic bounce effect
        particle.velocity.x = vFinal1.x;
        particle.velocity.y = vFinal1.y;

        otherParticle.velocity.x = vFinal2.x;
        otherParticle.velocity.y = vFinal2.y;
      }
    }

    function Circle(x, y, radius) {
      this.x = x;
      this.y = y;
      this.velocity = {
        x: (Math.random() - 0.5) * 4,
        y: (Math.random() - 0.5) * 4,
      };
      this.radius = radius;
      this.color = "hsl(" + (260 + 17 * Math.random()) + ",50%,50%)";
      this.mass = (this.radius * 2 * Math.PI) / this.radius;
      this.opacity = 0.075;

      this.draw = function() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.save();
        c.globalAlpha = this.opacity;
        c.fillStyle = this.color;
        c.fill();
        c.restore();
      };

      this.update = function() {
        //------------------ collision detection
        for (let i = 0; i < circleArray.length; i++) {
          if (!(this == circleArray[i])) {
            if (
              getDistance(this.x, this.y, circleArray[i].x, circleArray[i].y) <=
              this.radius + circleArray[i].radius
            ) {
              //console.log("collision detectecd!");
              resolveCollision(this, circleArray[i]);
            }
          }
        }
        // --------- Collision detection with mouse
        // if (
        //   getDistance(mouse.x, mouse.y, this.x, this.y) < 150 &&
        //   this.opacity < 1
        // ) {
        //   this.opacity += 0.01;
        // } else if (this.opacity > 0.075) {
        //   this.opacity -= 0.01;
        // }
        //-------------- bounce off walls
        if (
          this.x + this.radius > window.innerWidth ||
          this.x - this.radius < 0
        ) {
          this.velocity.x = -this.velocity.x;
        }
        if (
          this.y + this.radius > window.innerHeight ||
          this.y - this.radius < 0
        ) {
          this.velocity.y = -this.velocity.y;
        }
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.draw();
      };
    }

    function animate() {
      requestAnimationFrame(animate);
      c.clearRect(0, 0, innerWidth, innerHeight);
      for (let i = 0; i < circleArray.length; i++) {
        circleArray[i].update();
      }
    }

    init();
    animate();
  },
};
</script>

<style lang="scss">
#app {
  background-image: url("/src/assets/bg01.png");
}
.notification-item {
  transition: all 1s;
}
.notification-enter,
.notification-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
.notification-leave-active {
  position: absolute;
}
html {
  scroll-behavior: smooth;
}
</style>
