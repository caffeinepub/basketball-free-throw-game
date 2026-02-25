import React, { useRef, useEffect, useImperativeHandle, forwardRef } from 'react';

interface GameCanvasProps {
  onScore: () => void;
  onMiss?: () => void;
}

export interface GameCanvasHandle {
  resetGame: () => void;
  shoot: (power: number) => void;
}

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  isActive: boolean;
}

interface Hoop {
  x: number;
  y: number;
  width: number;
  height: number;
  rimY: number;
  rimLeft: number;
  rimRight: number;
}

const GameCanvas = forwardRef<GameCanvasHandle, GameCanvasProps>(({ onScore, onMiss }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ballRef = useRef<Ball>({
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    radius: 15,
    isActive: false,
  });
  const hoopRef = useRef<Hoop>({
    x: 0,
    y: 0,
    width: 80,
    height: 60,
    rimY: 0,
    rimLeft: 0,
    rimRight: 0,
  });
  const animationFrameRef = useRef<number | undefined>(undefined);
  const courtImageRef = useRef<HTMLImageElement | undefined>(undefined);
  const ballImageRef = useRef<HTMLImageElement | undefined>(undefined);
  const hoopImageRef = useRef<HTMLImageElement | undefined>(undefined);
  const hasPassedThroughHoopRef = useRef(false);
  const hasScoredRef = useRef(false);
  const lastBallYRef = useRef(0);
  const shotAttemptedRef = useRef(false);
  const successAnimationRef = useRef(0);

  // Physics constants
  const GRAVITY = 0.5;
  const FLOOR_Y_RATIO = 0.85;

  useImperativeHandle(ref, () => ({
    resetGame: () => {
      resetBall();
    },
    shoot: (power: number) => {
      shootBall(power);
    },
  }));

  const resetBall = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    ballRef.current = {
      x: canvas.width * 0.2,
      y: canvas.height * FLOOR_Y_RATIO - ballRef.current.radius,
      vx: 0,
      vy: 0,
      radius: 15,
      isActive: false,
    };
    hasPassedThroughHoopRef.current = false;
    hasScoredRef.current = false;
    lastBallYRef.current = ballRef.current.y;
    shotAttemptedRef.current = false;
    successAnimationRef.current = 0;
  };

  const shootBall = (power: number) => {
    if (ballRef.current.isActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Calculate velocity based on power (30-100%)
    // Power affects both horizontal and vertical velocity
    const normalizedPower = power / 100;
    
    // Calculate trajectory to aim toward the hoop
    const hoop = hoopRef.current;
    const ball = ballRef.current;
    
    // Target the center of the hoop
    const targetX = hoop.x + hoop.width / 2;
    const targetY = hoop.rimY;
    
    // Calculate distance
    const dx = targetX - ball.x;
    const dy = targetY - ball.y;
    
    // Base velocities adjusted by power
    // Higher power = faster shot, lower power = slower arc
    const timeToTarget = 1.5 - (normalizedPower * 0.5); // 1.0 to 1.5 seconds
    const baseVx = dx / (timeToTarget * 60); // 60 fps assumption
    const baseVy = (dy / (timeToTarget * 60)) - (GRAVITY * timeToTarget * 60 / 2);
    
    // Apply power scaling
    const powerScale = 0.7 + (normalizedPower * 0.6); // 0.7 to 1.3
    
    ballRef.current.vx = baseVx * powerScale;
    ballRef.current.vy = baseVy * powerScale;
    ballRef.current.isActive = true;
    hasPassedThroughHoopRef.current = false;
    hasScoredRef.current = false;
    lastBallYRef.current = ballRef.current.y;
    shotAttemptedRef.current = true;
    successAnimationRef.current = 0;
  };

  const checkScore = () => {
    const ball = ballRef.current;
    const hoop = hoopRef.current;

    // Check if ball is passing through the hoop from above
    const isInHoopXRange = ball.x > hoop.rimLeft && ball.x < hoop.rimRight;
    const isAtRimLevel = ball.y >= hoop.rimY - ball.radius && ball.y <= hoop.rimY + 10;
    const isMovingDown = ball.vy > 0;
    const wasAboveRim = lastBallYRef.current < hoop.rimY - ball.radius;

    if (isInHoopXRange && isAtRimLevel && isMovingDown && wasAboveRim && !hasPassedThroughHoopRef.current) {
      hasPassedThroughHoopRef.current = true;
      hasScoredRef.current = true;
      successAnimationRef.current = 30; // 30 frames of animation
      onScore();
    }

    lastBallYRef.current = ball.y;
  };

  const checkMiss = () => {
    const ball = ballRef.current;
    const hoop = hoopRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return;

    // If ball has passed the hoop horizontally and is falling, and hasn't scored, it's a miss
    if (shotAttemptedRef.current && !hasScoredRef.current && !ball.isActive) {
      const passedHoop = ball.x > hoop.x + hoop.width;
      if (passedHoop && onMiss) {
        onMiss();
        shotAttemptedRef.current = false;
      }
    }
  };

  const updatePhysics = () => {
    const ball = ballRef.current;
    const canvas = canvasRef.current;
    if (!canvas || !ball.isActive) {
      checkMiss();
      return;
    }

    // Apply gravity
    ball.vy += GRAVITY;

    // Update position
    ball.x += ball.vx;
    ball.y += ball.vy;

    // Check for scoring
    checkScore();

    // Floor collision
    const floorY = canvas.height * FLOOR_Y_RATIO;
    if (ball.y + ball.radius >= floorY) {
      ball.y = floorY - ball.radius;
      ball.vy *= -0.6; // Bounce with energy loss
      ball.vx *= 0.8; // Friction

      if (Math.abs(ball.vy) < 1) {
        ball.isActive = false;
        ball.vy = 0;
      }
    }

    // Side walls
    if (ball.x - ball.radius <= 0 || ball.x + ball.radius >= canvas.width) {
      ball.vx *= -0.5;
      ball.x = ball.x - ball.radius <= 0 ? ball.radius : canvas.width - ball.radius;
    }

    // Reset if ball goes off screen
    if (ball.y > canvas.height + 100 || ball.x > canvas.width + 100) {
      ball.isActive = false;
      checkMiss();
    }
  };

  const draw = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw court background
    if (courtImageRef.current?.complete) {
      ctx.drawImage(courtImageRef.current, 0, 0, canvas.width, canvas.height);
    } else {
      // Fallback gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#87CEEB');
      gradient.addColorStop(1, '#DEB887');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Draw hoop
    drawHoop(ctx);

    // Draw ball
    drawBall(ctx);

    // Draw success animation
    if (successAnimationRef.current > 0) {
      drawSuccessAnimation(ctx);
      successAnimationRef.current--;
    }

    // Draw floor line
    const floorY = canvas.height * FLOOR_Y_RATIO;
    ctx.strokeStyle = 'rgba(139, 69, 19, 0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, floorY);
    ctx.lineTo(canvas.width, floorY);
    ctx.stroke();
  };

  const drawHoop = (ctx: CanvasRenderingContext2D) => {
    const hoop = hoopRef.current;

    // Draw hoop image if available
    if (hoopImageRef.current?.complete) {
      const imageWidth = 120;
      const imageHeight = 180;
      ctx.drawImage(
        hoopImageRef.current,
        hoop.x + hoop.width - imageWidth + 20,
        hoop.y - 60,
        imageWidth,
        imageHeight
      );
    } else {
      // Fallback: Draw hoop manually
      // Backboard
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 3;
      ctx.fillRect(hoop.x + hoop.width - 10, hoop.y - 40, 10, 80);
      ctx.strokeRect(hoop.x + hoop.width - 10, hoop.y - 40, 10, 80);

      // Rim
      ctx.strokeStyle = '#FF6347';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(hoop.x + hoop.width / 2, hoop.rimY, hoop.width / 2, 0, Math.PI, true);
      ctx.stroke();

      // Net
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.lineWidth = 2;
      for (let i = 0; i < 8; i++) {
        const angle = Math.PI * (i / 7);
        const x = hoop.x + hoop.width / 2 + Math.cos(angle) * (hoop.width / 2);
        const y = hoop.rimY;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + 40);
        ctx.stroke();
      }
    }
  };

  const drawBall = (ctx: CanvasRenderingContext2D) => {
    const ball = ballRef.current;

    if (ballImageRef.current?.complete) {
      ctx.drawImage(
        ballImageRef.current,
        ball.x - ball.radius,
        ball.y - ball.radius,
        ball.radius * 2,
        ball.radius * 2
      );
    } else {
      // Fallback ball
      ctx.fillStyle = '#FF8C00';
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  };

  const drawSuccessAnimation = (ctx: CanvasRenderingContext2D) => {
    const hoop = hoopRef.current;
    const alpha = successAnimationRef.current / 30;
    
    // Draw glowing ring around hoop
    ctx.strokeStyle = `rgba(255, 215, 0, ${alpha * 0.8})`;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(hoop.x + hoop.width / 2, hoop.rimY, hoop.width / 2 + 10, 0, Math.PI * 2);
    ctx.stroke();

    // Draw particles
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 * i) / 8 + (30 - successAnimationRef.current) * 0.1;
      const distance = 40 + (30 - successAnimationRef.current) * 2;
      const x = hoop.x + hoop.width / 2 + Math.cos(angle) * distance;
      const y = hoop.rimY + Math.sin(angle) * distance;
      
      ctx.fillStyle = `rgba(255, 215, 0, ${alpha})`;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const gameLoop = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    updatePhysics();
    draw(ctx, canvas);

    animationFrameRef.current = requestAnimationFrame(gameLoop);
  };

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const container = canvas.parentElement;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Update hoop position on the right side of the court
    const hoopWidth = 80;
    const hoopX = canvas.width * 0.7;
    const hoopY = canvas.height * 0.35;
    
    hoopRef.current = {
      x: hoopX,
      y: hoopY,
      width: hoopWidth,
      height: 60,
      rimY: hoopY,
      rimLeft: hoopX + 5,
      rimRight: hoopX + hoopWidth - 5,
    };

    // Reset ball position
    resetBall();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Load images
    const courtImage = new Image();
    courtImage.src = '/assets/generated/basketball-court-background@1024x768.png';
    courtImageRef.current = courtImage;

    const ballImage = new Image();
    ballImage.src = '/assets/generated/basketball-transparent@128x128.png';
    ballImageRef.current = ballImage;

    const hoopImage = new Image();
    hoopImage.src = '/assets/generated/basketball-hoop-transparent.dim_200x300.png';
    hoopImageRef.current = hoopImage;

    // Setup canvas
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Start game loop
    gameLoop();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current !== undefined) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full bg-gradient-to-b from-sky-200 to-amber-100"
      tabIndex={0}
    />
  );
});

GameCanvas.displayName = 'GameCanvas';

export default GameCanvas;
