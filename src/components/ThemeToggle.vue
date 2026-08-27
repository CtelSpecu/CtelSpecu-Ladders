<template>
  <label class="theme-switch" :aria-label="isDark ? '切换到浅色模式' : '切换到深色模式'">
    <input type="checkbox" :checked="isDark" @change="toggleTheme" />
    <div class="switch-bg">
      <div class="sky-stars">
        <div class="star star-1"></div>
        <div class="star star-2"></div>
        <div class="star star-3"></div>
        <div class="star star-4"></div>
      </div>

      <div class="sky-clouds">
        <div class="cloud cloud-1"></div>
        <div class="cloud cloud-2"></div>
      </div>

      <div class="sky-vault">
        <div class="sun"></div>
        <div class="moon">
          <div class="craters">
            <div class="crater crater-1"></div>
            <div class="crater crater-2"></div>
            <div class="crater crater-3"></div>
          </div>
        </div>
      </div>

      <div class="landscape">
        <div class="mountain mountain-1"></div>
        <div class="mountain mountain-2"></div>
        <div class="terrain"></div>
        <div class="tree tree-1"></div>
        <div class="tree tree-2"></div>
        <div class="tree tree-3"></div>
      </div>
    </div>
  </label>
</template>

<script setup lang="ts">
import { useTheme } from '../composables/useTheme';

const { isDark, toggleTheme } = useTheme();
</script>

<style scoped>
  .theme-switch {
    position: relative;
    display: inline-block;
    width: 50px;
    height: 50px;
    cursor: pointer;
    border-radius: 50%;
    filter: drop-shadow(0 5px 11px rgba(0, 0, 0, 0.15));
    -webkit-tap-highlight-color: transparent;
    flex-shrink: 0;
    pointer-events: auto;
    touch-action: manipulation;
  }

  .theme-switch input {
    opacity: 0;
    width: 0;
    height: 0;
    position: absolute;
  }

  .switch-bg {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 50%;
    overflow: hidden;
    border: 2.2px solid #ffffff;
    box-shadow: inset 0 3.3px 6.7px rgba(0, 0, 0, 0.3);
    background: linear-gradient(180deg, #5ab5e6 0%, #aee0ff 100%);
    z-index: 1;
    transition: border-color 0.8s ease;
  }

  .switch-bg::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, #0b1325 0%, #1a2845 100%);
    opacity: 0;
    transition: opacity 0.8s ease;
    z-index: -1;
  }

  .sky-vault {
    position: absolute;
    width: 100%;
    height: 200%;
    top: 0;
    left: 0;
    transform-origin: 50% 50%;
    transition: transform 0.9s cubic-bezier(0.5, 0.1, 0.3, 1.2);
    z-index: 2;
  }

  .sun,
  .moon {
    position: absolute;
    width: 15.6px;
    height: 15.6px;
    left: calc(50% - 7.8px);
    border-radius: 50%;
  }

  .sun {
    top: 6.7px;
    background: linear-gradient(145deg, #fffcf0, #ffd300);
    box-shadow:
      0 0 8.3px rgba(255, 211, 0, 0.6),
      inset -1.1px -1.1px 3.3px rgba(0, 0, 0, 0.1);
  }

  .moon {
    bottom: 6.7px;
    background: linear-gradient(145deg, #e2e2e5, #8a8e94);
    box-shadow:
      0 0 8.3px rgba(255, 255, 255, 0.4),
      inset -1.1px -1.1px 3.3px rgba(0, 0, 0, 0.3);
    transform: rotate(180deg);
  }

  .craters {
    position: absolute;
    width: 100%;
    height: 100%;
  }
  .crater {
    position: absolute;
    background: #7a7e85;
    border-radius: 50%;
    box-shadow:
      inset 0.6px 0.6px 1.1px rgba(0, 0, 0, 0.4),
      inset -0.6px -0.6px 1.1px rgba(255, 255, 255, 0.8);
  }
  .crater-1 {
    width: 4.4px;
    height: 4.4px;
    top: 3.3px;
    left: 3.3px;
  }
  .crater-2 {
    width: 2.8px;
    height: 2.8px;
    top: 8.9px;
    left: 2.8px;
  }
  .crater-3 {
    width: 3.3px;
    height: 3.3px;
    top: 8.3px;
    left: 8.9px;
  }

  .sky-clouds {
    position: absolute;
    width: 100%;
    height: 100%;
    transition: 0.8s ease;
    opacity: 1;
    z-index: 1;
  }
  .cloud {
    position: absolute;
    background: white;
    border-radius: 11px;
    box-shadow: 0 1.1px 2.2px rgba(0, 0, 0, 0.1);
  }
  .cloud-1 {
    width: 17.8px;
    height: 6.7px;
    top: 17.8px;
    left: -4.4px;
  }
  .cloud-1::before {
    content: "";
    position: absolute;
    width: 8.9px;
    height: 8.9px;
    background: white;
    border-radius: 50%;
    top: -3.9px;
    left: 4.4px;
  }
  .cloud-2 {
    width: 14.4px;
    height: 5.6px;
    top: 27.8px;
    right: -3.3px;
  }
  .cloud-2::before {
    content: "";
    position: absolute;
    width: 7.8px;
    height: 7.8px;
    background: white;
    border-radius: 50%;
    top: -3.3px;
    left: 3.3px;
  }

  .sky-stars {
    position: absolute;
    width: 100%;
    height: 100%;
    transition: 0.8s ease;
    opacity: 0;
    transform: translateY(-8.3px);
    z-index: 1;
  }
  .star {
    position: absolute;
    background: white;
    border-radius: 50%;
    box-shadow: 0 0 1.7px white;
  }
  .star-1 {
    width: 1.1px;
    height: 1.1px;
    top: 10px;
    left: 10px;
  }
  .star-2 {
    width: 1.7px;
    height: 1.7px;
    top: 15.6px;
    left: 33.3px;
  }
  .star-3 {
    width: 1.1px;
    height: 1.1px;
    top: 25px;
    left: 12.2px;
  }
  .star-4 {
    width: 0.8px;
    height: 0.8px;
    top: 10px;
    left: 25px;
  }

  .landscape {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 50%;
    z-index: 3;
    pointer-events: none;
  }

  .mountain {
    position: absolute;
    bottom: 6.7px;
    width: 0;
    height: 0;
    border-left: 13.3px solid transparent;
    border-right: 13.3px solid transparent;
    transition: border-bottom-color 0.8s ease;
  }
  .mountain-1 {
    left: -4.4px;
    border-bottom: 23.3px solid #4ca382;
  }
  .mountain-2 {
    right: -4.4px;
    border-bottom: 17.8px solid #65b899;
  }

  .terrain {
    position: absolute;
    bottom: -11.1px;
    left: -8.3px;
    width: 66.7px;
    height: 22.2px;
    background: #348e6a;
    border-radius: 50%;
    transition: background 0.8s ease;
  }

  .tree {
    position: absolute;
    width: 10px;
    height: 14.4px;
    filter: drop-shadow(0.6px 1.1px 0.6px rgba(0, 0, 0, 0.25));
    z-index: 4;
  }
  .tree::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 85%;
    background: linear-gradient(90deg, #3aa673 0%, #236b47 50%, #15452d 100%);
    clip-path: polygon(
      50% 0%,
      80% 35%,
      60% 35%,
      90% 70%,
      65% 70%,
      100% 100%,
      0% 100%,
      35% 70%,
      10% 70%,
      40% 35%,
      20% 35%
    );
    transition: background 0.8s ease;
  }
  .tree::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 40%;
    width: 20%;
    height: 15%;
    background: linear-gradient(90deg, #704629 0%, #4a2d1a 100%);
    transition: background 0.8s ease;
    border-radius: 0.6px;
  }

  .tree-1 {
    left: 7.8px;
    bottom: 6.7px;
    transform: scale(0.85);
  }
  .tree-2 {
    right: 10px;
    bottom: 7.8px;
    transform: scale(1.05);
  }
  .tree-3 {
    left: 17.8px;
    bottom: 3.9px;
    transform: scale(0.65);
    z-index: 5;
  }
  .tree-3::before {
    background: linear-gradient(90deg, #2d8a5c 0%, #1a5436 50%, #0f3621 100%);
  }

  .theme-switch input:checked + .switch-bg {
    border-color: #2a3b5c;
  }
  .theme-switch input:checked + .switch-bg::before {
    opacity: 1;
  }

  .theme-switch input:checked + .switch-bg .sky-vault {
    transform: rotate(180deg);
  }
  .theme-switch input:checked + .switch-bg .landscape .tree::after {
    background: linear-gradient(90deg, #111a26 0%, #080d14 100%);
  }

  @media (max-width: 768px) {
    .theme-switch {
      width: 40px;
      height: 40px;
    }
  }
  @media (max-width: 480px) {
    .theme-switch {
      width: 36px;
      height: 36px;
    }
  }
</style>
