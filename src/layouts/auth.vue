<template>
     <div class="flex min-h-screen w-full items-center justify-center p-6 bg-bg-canvas relative overflow-hidden">
       <!-- Glowing background mesh elements -->
       <div class="glowing-mesh" aria-hidden="true">
         <div class="mesh-shape mesh-1"></div>
         <div class="mesh-shape mesh-2"></div>
       </div>

       <slot />
     </div>
   </template>
